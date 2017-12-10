import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import * as firebase from 'firebase'
import EditProfile from '../../presentation/profile/EditProfile'
import * as algoliaActions from '../../redux/actions/creators/algoliaActions'
import * as accountActions from '../../redux/actions/creators/accountActions'
import * as profileActions from '../../redux/actions/creators/profileActions'
import AuthenticatedComponent from '../../AuthenticatedComponent'

const createInitialValues = (state) => {
  const uid = state.firebase.auth.uid
  let displayEmail = get(state, `firebase.data.userProfiles.${uid}.displayEmail`)
  if(!displayEmail) displayEmail = get(firebase.auth(), 'currentUser.email')
  return {
    headline: get(state, `firebase.data.userProfiles.${uid}.headline`),
    experience: get(state, `firebase.data.userProfiles.${uid}.experience`),
    phone: get(state, `firebase.data.userProfiles.${uid}.phone`),
    bio: get(state, `firebase.data.userProfiles.${uid}.bio`),
    website: get(state, `firebase.data.userProfiles.${uid}.website`),
    video: get(state, `firebase.data.userProfiles.${uid}.video`),
    youtubeVideo: get(state, `firebase.data.userProfiles.${uid}.youtubeVideo`),
    firstName: get(state, `firebase.data.userAccounts.${uid}.firstName`),
    lastName: get(state, `firebase.data.userAccounts.${uid}.lastName`),
    displayEmail: displayEmail,
  }
}

class EditProfileContainer extends React.Component {
  render() {
    return (
      <EditProfile {...this.props} />
    )
  }
}

EditProfileContainer.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.string
  }).isRequired,
  profile: PropTypes.shape({
    photoURL: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string
  }).isRequired,
  data: PropTypes.shape({
    roles: PropTypes.object,
    userProfile: PropTypes.object
  }).isRequired,
  firebase: PropTypes.shape({
    uploadFile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    updateEmail: PropTypes.func.isRequired,
    set: PropTypes.func
  }).isRequired
}

const WrappedEditProfile = firebaseConnect((props, store) => {
  const firebaseProp = store.getState()
  const uid = get(firebaseProp, 'auth.uid', '')
  return [
    `/userProfiles/${uid}`,
    'roles',
    'genres'
  ]
})(AuthenticatedComponent(EditProfileContainer))

export default withRouter(connect(
  state => ({
    firebase: state.firebase,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    data: state.firebase.data,
    initialValues: createInitialValues(state)

  }),
  { ...algoliaActions, ...profileActions, ...accountActions },
)(WrappedEditProfile))

