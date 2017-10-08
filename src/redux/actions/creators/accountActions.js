import * as firebase from 'firebase'
import { push } from 'react-router-redux'
import { SIGN_IN, SIGN_UP, SIGN_OUT } from '../types/accountActionTypes'

/* this an example of how to chain actions together.
 This is a function which takes username and email and and returns a function with the argument of dispatch
 which can be used inside the function to dispatch events.
 In this case we dispatch the signIn actions and then then it is finished we dispatch a push to the router to go the /dashboard */

const migrateOrUpdate = (firstName, lastName, email) => {
  const userMigrationRef = firebase.database().ref('/userMigration')
  userMigrationRef.orderByChild('email').equalTo(email).once('value').then((snapshot) => {
    const dataToMigrate = snapshot.val()
    if (dataToMigrate !== null) {
      const uid = firebase.auth().currentUser.uid
      const key = Object.keys(dataToMigrate)[0]
      const userToMigrate = dataToMigrate[key]
      const roles = userToMigrate.roles
      const firstName = userToMigrate.firstName
      const lastName = userToMigrate.lastName
      const profilesRef = firebase.database().ref(`/userProfiles/${uid}/roles`)
      const accountRef = firebase.database().ref(`/userAccount/${uid}`)
      profilesRef.set(roles)
      accountRef.set({
        firstName,
        lastName,
      })
    }
  })
  const uid = firebase.auth().currentUser.uid
  const accountRef = firebase.database().ref(`/userAccount/${uid}`)
  accountRef.set({
    firstName,
    lastName,
    photoURL
  })
}

const migrateIfNeeded = (email) => {
  const userMigrationRef = firebase.database().ref('/userMigration')
  userMigrationRef.orderByChild('email').equalTo(email).once('value').then((snapshot) => {
    const dataToMigrate = snapshot.val()
    if (dataToMigrate !== null) {
      const uid = firebase.auth().currentUser.uid
      const key = Object.keys(dataToMigrate)[0]
      const userToMigrate = dataToMigrate[key]
      const roles = userToMigrate.roles
      const firstName = userToMigrate.firstName
      const lastName = userToMigrate.lastName
      const profilesRef = firebase.database().ref(`/userProfiles/${uid}/roles`)
      const accountRef = firebase.database().ref(`/userAccount/${uid}`)
      profilesRef.set(roles)
      accountRef.set({
        firstName,
        lastName
      })
    }
  })
}

export const signIn = (email, password) => dispatch => dispatch({
  type: SIGN_IN,
  payload: firebase.auth().signInWithEmailAndPassword(email, password)
}).then(() => dispatch(push('account')))

export const signUp = (firstName, lastName, photoURL, email, password) => dispatch => dispatch({
  type: SIGN_UP,
  payload: firebase.auth().createUserWithEmailAndPassword(email, password)
}).then(() => dispatch(push('account'))).then(() => migrateIfNeeded(email))

export const signOut = () => dispatch => dispatch({
  type: SIGN_OUT,
  payload: firebase.auth().signOut()
}).then(() => dispatch(push('home')))
