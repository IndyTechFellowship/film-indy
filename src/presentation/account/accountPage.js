import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { get } from 'lodash'

// Material UI Imports
import Avatar from 'material-ui/Avatar'
import { Card, CardTitle } from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import CameraIcon from 'material-ui/svg-icons/image/photo-camera'
import UploadIcon from 'material-ui/svg-icons/file/file-upload'

import '../../App.css'
import './accountPage.css'

const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
)

const validate = (values) => {
  const errors = {}

  if (!values.firstName || !values.lastName || !values.email) {
    if (!values.firstName) {
      errors.firstName = 'You forgot to enter your first name!'
    }
    if (!values.lastName) {
      errors.lastName = 'You forgot to enter your last name!'
    }
    if (!values.email) {
      errors.email = 'You forgot to enter an email!'
    }
  }
  return errors
}

// Making component const throws an error that it is read-only
const AccountPage = (props) => {
  const { handleSubmit, pristine, submitting, handleProfileChanges, profile, firebase, auth } = props
  const photoURL = get(profile, 'photoURL', '')
  const uid = get(auth, 'uid')

  return (
    <div>
      <h1>Account Settings</h1>
      <Card className="profileCard" >
        <CardTitle title="Your Profile" />
        <Divider />
        <div className="imageWrapper">
          <Avatar className="accountImage" src={photoURL} size={150} />
          <CameraIcon className="cameraIcon" color="white" />
          <FlatButton className="imageText" icon={<UploadIcon />} label="Upload Picture" labelPosition="before" containerElement="label">
            <FileUploader uid={uid} uploadFile={firebase.uploadFile} updateProfile={firebase.updateProfile} />
          </FlatButton>
        </div>
        <form onSubmit={handleSubmit(handleProfileChanges)}>
          <ul className="fields">
            <li>
              <div>
                <Field
                  name="firstName"
                  component={renderTextField}
                  floatingLabelText="First Name"
                  type="text"
                />
              </div>
            </li>
            <li>
              <div>
                <Field
                  name="lastName"
                  component={renderTextField}
                  floatingLabelText="Last Name"
                  type="text"
                />
              </div>
            </li>
            <li>
              <div>
                <Field
                  name="email"
                  component={renderTextField}
                  floatingLabelText="Email"
                  type="email"
                />
              </div>
            </li>
          </ul>
          <RaisedButton type="submit" className="accountButton" primary label="Save" disabled={pristine || submitting} />
        </form>
      </Card>

      <Card className="passwordCard">
        <CardTitle title="Reset Password" />
        <Divider />
        <ul className="fields">
          <li><TextField hintText="New Password" floatingLabelText="Password" type="password" /></li>
          <li><TextField hintText="Confirm Password" floatingLabelText="Confirm Password" type="password" /></li>
        </ul>
        <RaisedButton className="accountButton" primary label="Submit" />
      </Card>
    </div>
  )
}

// // Decorate with reduxForm(). It will read the initialValues prop provided by connect()
// AccountPage = reduxForm({
//   form: 'accountPage', // a unique identifier for this form
// })(AccountPage);

// // You have to connect() to any reducers that you wish to connect to yourself
// AccountPage = connect(
//   state => ({
//     initialValues: state.account.data, // pull initial values from account reducer
//   }),
//   { load: loadAccount }, // bind account loading action creator
// )(AccountPage);

const FileUploader = props => (
  <input
    name="myFile"
    type="file"
    style={{ display: 'none' }}
    onChange={(event) => {
      const { uid, uploadFile, updateProfile } = props
      const file = event.target.files[0]
      const fbFilePath = `/images/users/account/${uid}/account_image`
      uploadFile(fbFilePath, file).then((response) => {
        const downloadUrl = response.downloadURL
        updateProfile({
          photoURL: downloadUrl
        })
      })
    }}
  />
)

FileUploader.propTypes = {
  uid: PropTypes.string,
  uploadFile: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired
}

FileUploader.defaultProps = {
  uid: ''
}

AccountPage.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    photoURL: PropTypes.string
  }).isRequired,
  auth: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  firebase: PropTypes.shape({
    updateProfile: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired
}

const AccountPageFormEnriched = reduxForm({
  form: 'updateProfile',
  validate,
  enableReinitialize: true
})(AccountPage)

export default AccountPageFormEnriched
