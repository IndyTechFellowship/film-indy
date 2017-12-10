import * as firebase from 'firebase'
import { push } from 'react-router-redux'
import { omitBy, get } from 'lodash'
import { submit } from 'redux-form'
import { SIGN_IN, SIGN_UP, SIGN_OUT, SEND_PASSWORD_RESET_EMAIL, RESET_PASSWORD, CREATE_VENDOR, DELETE_VENDOR } from '../types/accountActionTypes'
import * as algoliaActions from './algoliaActions'

/* this an example of how to chain actions together.
 This is a function which takes username and email and and returns a function with the argument of dispatch
 which can be used inside the function to dispatch events.
 In this case we dispatch the signIn actions and then then it is finished we dispatch a push to the router to go the /dashboard */

const encodeAsFirebaseKey = string => string.replace(/%/g, '%25')
  .replace(/\./g, '%2E')
  .replace(/#/g, '%23')
  .replace(/\$/g, '%24')
  .replace(/\//g, '%2F')
  .replace(/\[/g, '%5B')
  .replace(/\]/g, '%5D')

const migrateOrCreateUserAccountEntry = (uid, emailKey, snapshot, accountDataToSave, accountRef, dispatch) => {
  const val = snapshot.val()
  if (val) {
    // an account already exists, migrate the account
    const accountData = omitBy(accountDataToSave, i => !i)
    const nameUpdates = omitBy({ firstName: accountDataToSave.firstName, lastName: accountDataToSave.lastName, public: true }, i => !i)
    // migrate the name index with the new uid
    dispatch(algoliaActions.migrateName(uid, emailKey, nameUpdates))
    accountRef.child(emailKey).remove()
    if (accountData.photoFile) {
      firebase.uploadFile(`/images/users/account/${uid}/account_image`, accountData.photoFile).then((response) => {
        accountRef.child(uid).update({
          ...val,
          ...accountData,
          photoURL: response.uploadTaskSnaphot.downloadURL,
          public: true
        })
      })
    } else {
      accountRef.child(uid).update({
        ...val,
        ...accountData,
        public: true
      })
    }
  } else {
    // no row in the userAccount table exists with that email, totally new user
    const accountData = omitBy(accountDataToSave, i => !i)
    const nameUpdates = omitBy({ firstName: accountDataToSave.firstName, lastName: accountDataToSave.lastName }, i => !i)
    dispatch(algoliaActions.addToNameIndex(uid, { ...nameUpdates, public: false }))
    if (accountData.photoFile) {
      firebase.uploadFile(`/images/users/account/${uid}/account_image`, accountData.photoFile).then((response) => {
        accountRef.child(uid).update({
          ...accountData,
          photoURL: response.uploadTaskSnaphot.downloadURL,
          public: false
        })
      })
    } else {
      accountRef.child(uid).update({
        ...accountData,
        public: false
      })
    }
  }
}

const migrate = (accountDataToSave, signUpResult, dispatch) => {
  const uid = firebase.auth().currentUser.uid
  const emailKey = encodeAsFirebaseKey(accountDataToSave.email)
  const accountRef = firebase.database().ref('/userAccount')
  const profilesRef = firebase.database().ref('/userProfiles')
  accountRef.child(emailKey).once('value').then((snapshot) => {
    migrateOrCreateUserAccountEntry(uid, emailKey, snapshot, accountDataToSave, accountRef, dispatch)
  })
  profilesRef.child(emailKey).once('value').then((snapshot) => {
    const val = snapshot.val()
    if (val) {
      profilesRef.child(emailKey).remove()
      profilesRef.child(uid).update(val)
      dispatch(algoliaActions.migrateProfile(uid, emailKey))
    } else {
      profilesRef.child(uid).update({
        public: false
      }).then(() => dispatch(algoliaActions.createProfileRecord(uid, { public: false, roles: [] })))
    }
  })
  return dispatch(push('account'))
}

export const signIn = (email, password) => dispatch => dispatch({
  type: SIGN_IN,
  payload: firebase.auth().signInWithEmailAndPassword(email, password)
}).then(() => dispatch(push('account')))

export const signUp = (firstName, lastName, photoFile, email, password) => dispatch => dispatch({
  type: SIGN_UP,
  payload: firebase.auth().createUserWithEmailAndPassword(email, password)
}).then((result) => {
  const accountDataToSave = {
    firstName,
    lastName,
    email,
    photoFile
  }
  migrate(accountDataToSave, result, dispatch)
})

export const signOut = () => dispatch => dispatch({
  type: SIGN_OUT,
  payload: firebase.auth().signOut()
}).then(() => dispatch(push('/')))

export const sendPasswordResetEmail = emailAddress => dispatch => dispatch({
  type: SEND_PASSWORD_RESET_EMAIL,
  payload: firebase.auth().sendPasswordResetEmail(emailAddress)
}).then(() => dispatch(push('login')))

export const updateAuth = result => dispatch => dispatch({
  type: '@@reactReduxFirebase/AUTH_UPDATE_SUCCESS',
  auth: result
})

export const createVendor = vendorName => (dispatch) => {
  const uid = firebase.auth().currentUser.uid
  const vendorRef = firebase.database().ref('/vendorProfiles')
  return dispatch({
    type: CREATE_VENDOR,
    payload: vendorRef.push({
      creator: uid,
      name: vendorName
    }).then((ref) => {
      dispatch(algoliaActions.createVendorProfileRecord(ref.key, { vendorName }))
    })
  })
}

export const deleteVendor = vendorId => dispatch => ({
  type: DELETE_VENDOR,
  payload: firebase.database().ref(`vendorProfiles/${vendorId}`).remove()
    .then(() => dispatch(algoliaActions.deleteVendorProfileRecord(vendorId)))
})
export const signUpWithGoogle = () => (dispatch) => {
  const provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/userinfo.email')
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
  provider.setCustomParameters({
    display: 'popup'
  })
  const fbPromise = firebase.auth().signInWithPopup(provider)
  return dispatch({
    type: 'SIGN_UP_GOOGLE',
    payload: fbPromise
  }).then(({ value }) => {
    const user = value.user
    const displayName = get(user, 'displayName', '')
    const email = get(user, 'email', '')
    const photoURL = get(user, 'photoURL', '')
    const accountDataToSave = {
      firstName: displayName,
      lastName: '',
      email,
      photoURL
    }
    migrate(accountDataToSave, value, dispatch)
  })
}

export const signInWithGoogle = () => (dispatch) => {
  const provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/userinfo.email')
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
  provider.setCustomParameters({
    display: 'popup'
  })
  const fbPromise = firebase.auth().signInWithPopup(provider)
  return dispatch({
    type: 'SIGN_IN_GOOGLE',
    payload: fbPromise
  }).then(({ value }) => {
    const user = value.user
    const email = get(user, 'email', '')
    const accountDataToSave = {
      email
    }
    migrate(accountDataToSave, value, dispatch)
  })
}

export const signInWithFacebook = () => (dispatch) => {
  const provider = new firebase.auth.FacebookAuthProvider()
  provider.addScope('email')
  provider.addScope('public_profile')
  const fbPromise = firebase.auth().signInWithPopup(provider)
  return dispatch({
    type: 'SIGN_IN_FACEBOOK',
    payload: fbPromise
  }).then(({ value }) => {
    const displayName = get(value, 'user.displayName', '')
    const email = get(value, 'user.email')
    const defaultEmail = email || `${displayName}@facebook.com`
    const accountDataToSave = {
      email: defaultEmail
    }
    migrate(accountDataToSave, value, dispatch)
  })
}

export const signUpWithFacebook = () => (dispatch) => {
  const provider = new firebase.auth.FacebookAuthProvider()
  provider.addScope('email')
  provider.addScope('public_profile')
  const fbPromise = firebase.auth().signInWithPopup(provider)
  return dispatch({
    type: 'SIGN_UP_FACEBOOK',
    payload: fbPromise
  }).then(({ value }) => {
    const displayName = get(value, 'user.displayName', '')
    const email = get(value, 'user.email')
    const defaultEmail = email || `${displayName}@facebook.com`
    const extraUserInfo = get(value, 'additionalUserInfo.profile')
    const firstName = get(extraUserInfo, 'first_name', '')
    const lastName = get(extraUserInfo, 'last_name', '')
    const photoURL = get(extraUserInfo, 'picture.data.url')
    const accountDataToSave = {
      firstName,
      lastName,
      email: defaultEmail,
      photoURL
    }
    migrate(accountDataToSave, value, dispatch)
  })
}

export const cancelSignInUpForm = () => ({
  type: 'Cancel_Sign_In_Up_Form'
})

export const submitSignUp = () => dispatch => dispatch(submit('signUp'))

export const submitSignIn = () => dispatch => dispatch(submit('signIn'))

export const submitVendorCreate = () => dispatch => dispatch(submit('addVendor'))

export const remoteSubmitForm = formName => dispatch => dispatch(submit(formName))

export const resetPassword = newPassword => dispatch => dispatch({
  type: RESET_PASSWORD,
  payload: firebase.auth().currentUser.updatePassword(newPassword)
})
