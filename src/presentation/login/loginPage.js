import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from 'material-ui/Snackbar'
import FlatButton from 'material-ui/FlatButton'
import { get } from 'lodash'
import '../../App.css'
import SignInForm from './SignInForm'
import { Route, Link, withRouter } from 'react-router-dom'


const firebaseErrorCodeToFriendlyMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/wrong-password': return 'Invalid Password'
    case 'auth/user-not-found': return 'No user with that email exists'
    default: return 'There was an issue signing in. Please try again'
  }
}

const LoginPage = props => (
  <div >
    <SignInForm onSubmit={values => props.signIn(values.email, values.password)} />
    <Link to="/forgotpassword">
      <FlatButton
        label = "Forgot Password?"
        primary = {true}
      />
    </Link>
    <Snackbar
      bodyStyle={{ backgroundColor: '#F44336' }}
      open={props.account.signInError !== undefined}
      message={firebaseErrorCodeToFriendlyMessage(get(props, 'account.signInError.code'))}
      autoHideDuration={4000}
    />
  </div>
)

LoginPage.propTypes = {
  account: PropTypes.shape({
    signInError: PropTypes.shape({
      code: PropTypes.string,
      message: PropTypes.string,
    }),
  }),
  signIn: PropTypes.func.isRequired,
}

LoginPage.defaultProps = {
  account: {},
}

export default LoginPage
