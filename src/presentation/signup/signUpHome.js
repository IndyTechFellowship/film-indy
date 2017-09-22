import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from 'material-ui/Snackbar'
import { get } from 'lodash'
import '../../App.css'
import SignUpForm from './SignUpForm'

const firebaseErrorCodeToFriendlyMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/wrong-password': return 'Invalid Password';
    case 'auth/user-not-found': return 'No user with that email exists';
    default: return 'unknown'
  }
};

const signUpPage = props => (
  <div >
    <SignUpForm onSubmit={values => props.signUp(values.email, values.password)} />
    <Snackbar
      bodyStyle={{ backgroundColor: '#F44336' }}
      open={props.account.signInError !== undefined}
      message={firebaseErrorCodeToFriendlyMessage(get(props, 'account.signUpError.code'))}
      autoHideDuration={4000}
    />
  </div>
);

signUpPage.propTypes = {
  account: PropTypes.shape({
    signUpError: PropTypes.shape({
      code: PropTypes.string,
      message: PropTypes.string,
    }),
  }),
  signUp: PropTypes.func.isRequired,
};

signUpPage.defaultProps = {
  account: {},
};

export default signUpPage
