import React from 'react'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import PropTypes from 'prop-types'
import { TextField } from 'redux-form-material-ui'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import { FacebookLoginButton } from 'react-social-login-buttons'
import SocialLoginButton from 'react-social-login-buttons/lib/buttons/SocialLoginButton'
import { connect } from 'react-redux'
import { get } from 'lodash'
import './signUp.css'

const validate = (values) => {
  const errors = {}

  if (!values.email || !values.password || !values.confirmPassword) {
    if (!values.email) {
      errors.email = 'You forgot to enter an email!'
    }
    if (!values.password) {
      errors.password = 'You forgot to enter a password!'
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = 'You forgot to confirm your password!'
    }
  }
  if (values.password && values.confirmPassword && !(values.password === values.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match'
  }

  return errors
}

const GoogleLoginButton = (props) => {
  const customProps = {
    style: {
      background: 'white',
      color: '#808080'
    },
    activeStyle: {
      background: '#eeeeee'
    }
  }

  return (<SocialLoginButton {...{ ...customProps, ...props }}>
    <img
      alt=""
      style={{ verticalAlign: 'middle', height: 26, paddingRight: 10 }}
      src="https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-128.png"
    />
    <span style={{ verticalAlign: 'middle' }}>Sign up with Google</span>
  </SocialLoginButton>)
}

const adaptFileEventToValue = delegate =>
  e => delegate(e.target.files[0])

const FileInput = ({
  input: {
    value: omitValue,
    onChange,
    onBlur,
    ...inputProps
  },
  meta: omitMeta,
  ...props
}) => (
  <div id="fileContainer">
    <div id="fileText">
      Profile Picture
    </div>
    <div id="fileInput">
      <input
        onChange={adaptFileEventToValue(onChange)}
        onBlur={adaptFileEventToValue(onBlur)}
        type="file"
        {...inputProps}
        {...props}
      />
    </div>
  </div>
)

const fireBaseErrorCode = (code) => {
  switch (code) {
    case 'auth/account-exists-with-different-credential':
      return 'An account is already associated with this email. Please enter your email and password'
    case 'auth/email-already-in-use': return 'This email is already in use'
    case 'auth/weak-password': return 'Your password must be at least 6 characters'

    default:
      return 'Error Signing In'
  }
}

class SignUpForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false, continueWithEmail: false }
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
  }
  handleOpen() {
    this.setState({ open: true })
  }
  handleClose() {
    this.setState({ open: false, continueWithEmail: false })
  }
  render() {
    const { account, handleSubmit, error, submitting, pristine, sendSubmit, signUpWithGoogle, signUpWithFacebook } = this.props
    const { continueWithEmail } = this.state
    const socialSignInError = get(account, 'socialSignInError.code')
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        disabled={error || pristine || submitting}
        onClick={() => {
          sendSubmit()
        }}
      />
    ]
    return (
      <div>
        <FlatButton label="Sign Up" style={{ color: 'white' }} labelStyle={{ fontSize: '12pt' }} onClick={this.handleOpen} />
        <Dialog
          contentStyle={{ width: '100%', marginBottom: 150 }}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          title="Sign Up"
          actions={continueWithEmail ? actions : []}
          modal={false}
          open={this.state.open}
          autoScrollBodyContent
          onRequestClose={this.handleClose}
        >
          {continueWithEmail ? (
            <form
              onSubmit={handleSubmit}
            >
              <div>
                <Field
                  name="firstName"
                  component={TextField}
                  floatingLabelText="First Name"
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      sendSubmit()
                    }
                  }}
                />
              </div>
              <div>
                <Field
                  name="lastName"
                  component={TextField}
                  floatingLabelText="Last Name"
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      sendSubmit()
                    }
                  }}
                />
              </div>
              <br />
              <div>
                <Field
                  name="photoFile"
                  component={FileInput}
                  type="file"
                />
              </div>
              <div>
                <Field
                  name="email"
                  component={TextField}
                  floatingLabelText="Email"
                  type="email"
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      sendSubmit()
                    }
                  }}
                />
              </div>
              <div>
                <Field
                  name="password"
                  component={TextField}
                  floatingLabelText="Password"
                  type="password"
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      sendSubmit()
                    }
                  }}
                />
              </div>
              <div id="confirmPasswordInput">
                <Field
                  name="confirmPassword"
                  component={TextField}
                  floatingLabelText="Confirm Password"
                  type="password"
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      sendSubmit()
                    }
                  }}
                />
              </div>
            </form>
          ) : (
            <div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 40 }}>
                  <FacebookLoginButton onClick={() => signUpWithFacebook()} text="Sign up with Facebook" style={{ marginBottom: 20 }} />
                  <GoogleLoginButton onClick={() => signUpWithGoogle()} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ marginLeft: 75, marginTop: 10, border: '1px solid #979797', height: 60, width: 0 }} />
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: 75, width: 48, height: 48, borderRadius: '50%', border: '1px solid grey' }}> OR </div>
                  <div style={{ marginLeft: 75, border: '1px solid #979797', height: 60, width: 0 }} />
                </div>
                <div style={{ paddingTop: 80 }}>
                  <RaisedButton style={{ width: 238, marginLeft: 55 }} onClick={() => this.setState({ continueWithEmail: true })}>
                  Sign Up with Email
                  </RaisedButton>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 10, color: 'red' }}>
                {socialSignInError ? fireBaseErrorCode(socialSignInError) : ''}
              </div>
            </div>
          )}
        </Dialog>
      </div>
    )
  }
}

SignUpForm.propTypes = {
  cancelSignInUpForm: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  signUpWithGoogle: PropTypes.func.isRequired,
  signUpWithFacebook: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  sendSubmit: PropTypes.func.isRequired
}

const SignUpFormFormEnriched = reduxForm({
  form: 'signUp',
  validate
})(SignUpForm)

// Decorate with redux-form
const selector = formValueSelector('signUp') // <-- same as form name
const SignUpFormFormConnected = connect(
  (state) => {
    // can select values individually
    const photoFile = selector(state, 'photoFile')
    return {
      photoFile
    }
  }
)(SignUpFormFormEnriched)

export default SignUpFormFormConnected
