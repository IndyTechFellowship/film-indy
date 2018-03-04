import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import ResetPasswordForm from './resetPasswordForm'


// Material UI Imports
import { Card } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Chip from 'material-ui/Chip'
import Snackbar from 'material-ui/Snackbar'
import TextField from 'material-ui/TextField'

import VendorCreateModal from './VendorCreateModal'
import LocationCreateModal from './LocationCreateModal'

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
    const { handleSubmit, pristine, submitting, handleProfileChanges, auth, submitVendorCreate, createVendor, deleteVendor,
      usersVendors, submitLocationCreate, createLocation, deleteLocation, usersLocations, resetPassword, account } = this.props
    const vendors = usersVendors || {}
    const locations = usersLocations || {}
    const authProviderId = get(auth, 'providerData[0].providerId', '')
    return (
      <div>
        <h2 className="accountHeader">Account Information</h2>
        <Card className="profileCard" >
          <div className="profileContainer">
            <form onSubmit={handleSubmit(handleProfileChanges)}>
              <div className="fields" style={{ textAlign: 'center' }}>
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
        <Card className="addCard">
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {Object.keys(vendors).map((key) => {
              const vend = vendors[key]
              return (
                <Chip
                  onRequestDelete={() => deleteVendor(key)}
                  key={vend.name}
                  style={{ marginRight: 5, marginBottom: 10 }}
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

        <h2 className="resetHeader">Locations</h2>
        <Card className="addCard">
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {Object.keys(locations).map((key) => {
              const loc = locations[key]
              return (
                <Chip
                  onRequestDelete={() => deleteLocation(key)}
                  key={loc.name}
                  style={{ marginRight: 5, marginBottom: 10 }}
                >
                  {loc.name}
                </Chip>
              )
            })}
            {Object.keys(locations).length === 0 ?
              'Press Add to create a Location'
              : null
            }
          </div>
          <LocationCreateModal
            submitLocationCreate={submitLocationCreate}
            onSubmit={(values) => {
              createLocation(values.name)
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
  usersVendors: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.objectOf(PropTypes.shape({
      creator: PropTypes.string,
      name: PropTypes.string
    }))
  ]),
  createLocation: PropTypes.func.isRequired,
  deleteLocation: PropTypes.func.isRequired,
  usersLocations: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.objectOf(PropTypes.shape({
      creator: PropTypes.string,
      name: PropTypes.string
    }))
  ]),
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
  })),
  usersLocations: PropTypes.objectOf(PropTypes.shape({
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
