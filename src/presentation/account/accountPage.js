import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import ResetPasswordForm from './resetPasswordForm'


// Material UI Imports
import Avatar from 'material-ui/Avatar'
import { Card } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Chip from 'material-ui/Chip'
import Snackbar from 'material-ui/Snackbar'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'

import CameraIcon from 'material-ui/svg-icons/image/photo-camera'
import UploadIcon from 'material-ui/svg-icons/file/file-upload'

import VendorCreateModal from './VendorCreateModal'

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

const firebaseErrorCodeToFriendlyMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/weak-password': return 'Password is not Strong Enough'
    case 'auth/requires-recent-login': return 'Password Reset requires a more recent login'
    default: return 'There was an issue resetting your password. Please try again'
  }
}


// Making component const throws an error that it is read-only
class AccountPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      updated: false
    }
    this.handleUpdateClose = this.handleUpdateClose.bind(this)
    this.updateMessage = this.updateMessage.bind(this)
  }

  updateMessage() {
    this.setState({
      updated: true
    })
  }

  handleUpdateClose() {
    this.setState({
      updated: false
    })
  }

  render() {
    const { handleSubmit, pristine, submitting, handleProfileChanges,
      profile, firebase, auth, setPublic, submitVendorCreate, createVendor, deleteVendor,
      usersVendors, resetPassword, account } = this.props
    const photoURL = get(profile, 'photoURL', '')
    const uid = get(auth, 'uid')
    const isPublic = get(profile, 'public', false)
    const vendors = usersVendors || {}
    const authProviderId = get(auth, 'providerData[0].providerId', '')
    return (
      <div>
        <h2 className="accountHeader">Account Information</h2>
        <Card className="profileCard" >
          <div className="profileContainer">
            <div className="imageWrapper">
              <Avatar className="accountImage avatar" src={photoURL} size={300} />
              <CameraIcon className="cameraIcon" color="white" />
              <FlatButton className="imageText" icon={<UploadIcon />} label="Upload Picture" labelPosition="before" containerElement="label">
                <FileUploader uid={uid} uploadFile={firebase.uploadFile} updateProfile={firebase.updateProfile} />
              </FlatButton>
            </div>
            <form onSubmit={handleSubmit(handleProfileChanges)}>
              <div className="fields">
                <div>
                  <Field
                    name="firstName"
                    component={renderTextField}
                    floatingLabelText="First Name"
                    type="text"
                  />
                </div>
                <div>
                  <Field
                    name="lastName"
                    component={renderTextField}
                    floatingLabelText="Last Name"
                    type="text"
                  />
                </div>
                <div>
                  <Field
                    name="email"
                    component={renderTextField}
                    floatingLabelText="Email"
                    type="email"
                  />
                </div>
              </div>
              <RaisedButton type="submit" className="accountButton" primary label="Save" disabled={pristine || submitting} onClick={this.updateMessage} />
            </form>
          </div>
        </Card>

        <h2 className="privacyHeader"> Profile Privacy Settings </h2>
        <Card className="privacySettingsCard">
          <div className="toggleContainer">
            <div className="toggle">
              <Toggle
                label="Public"
                toggled={isPublic}
                onToggle={(event, toggleValue) => {
                  firebase.updateProfile({
                    public: toggleValue
                  })
                  setPublic(toggleValue, uid)
                }}
              />
            </div>
            <div>
            Just here to search? Turn your profile to "Private" to not appear in other's searches.
            </div>
          </div>
        </Card>

        <Snackbar
          bodyStyle={{ backgroundColor: '#00C853' }}
          open={this.state.updated}
          message={'Successfully Updated.'}
          autoHideDuration={4000}
          onRequestClose={this.handleUpdateClose}
        />

        {authProviderId === 'password' ? (
          <div>
            <h2>Change My Password</h2>
            <Card className="passwordCard">
              <ResetPasswordForm onSubmit={values => resetPassword(values.newPassword)} />
              <Snackbar
                bodyStyle={{ backgroundColor: '#F44336' }}
                open={account.resetPasswordError !== undefined}
                message={firebaseErrorCodeToFriendlyMessage(get(account, 'resetPasswordError.code'))}
                autoHideDuration={4000}
              />
            </Card>
          </div>
        ) : null}
        <h2 className="resetHeader">Vendors</h2>
        <Card className="passwordCard">
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {Object.keys(vendors).map((key) => {
              const vend = vendors[key]
              return (
                <Chip
                  onRequestDelete={() => deleteVendor(key)}
                  key={vend.name}
                  style={{ marginRight: 5 }}
                >
                  {vend.name}
                </Chip>
              )
            })}
            {Object.keys(vendors).length === 0 ?
              'Press Add to create a Vendor'
              : null
            }
          </div>
          <VendorCreateModal
            submitVendorCreate={submitVendorCreate}
            onSubmit={(values) => {
              createVendor(values.name)
            }}
          />
        </Card>
      </div>
    )
  }
}

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
        const downloadUrl = response.uploadTaskSnaphot.downloadURL
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
    photoURL: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  auth: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  firebase: PropTypes.shape({
    updateProfile: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired
  }).isRequired,
  setPublic: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleProfileChanges: PropTypes.func.isRequired,
  createVendor: PropTypes.func.isRequired,
  deleteVendor: PropTypes.func.isRequired,
  usersVendors: PropTypes.objectOf(PropTypes.shape({
    creator: PropTypes.string,
    name: PropTypes.string
  })),
  handleSubmit: PropTypes.func.isRequired,
  submitVendorCreate: PropTypes.func.isRequired,
  account: PropTypes.shape({
    resetPasswordError: PropTypes.shape({
      code: PropTypes.string,
      message: PropTypes.string
    })
  }).isRequired,
  resetPassword: PropTypes.func.isRequired
}

AccountPage.defaultProps = {
  usersVendors: PropTypes.objectOf(PropTypes.shape({
    creator: PropTypes.string,
    name: PropTypes.string
  }))
}

const AccountPageFormEnriched = reduxForm({
  form: 'UpdateProfile',
  validate,
  enableReinitialize: true
})(AccountPage)

export default AccountPageFormEnriched
