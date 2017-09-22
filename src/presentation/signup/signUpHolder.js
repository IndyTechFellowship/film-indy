import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from 'material-ui/Snackbar'
import { get } from 'lodash'
import '../../App.css'
import SignUpForm from './SignUpForm'

const firebaseErrorCodeToFriendlyMessage = (errorCode) => {
	switch (errorCode) {
		case 'auth/email-already-in-use': return 'Account already exists for this email';
		case 'auth/argument-error': return 'Please provide both an Email and Password';
		default: {
			console.log("told to suck it?");
			return 'suck it'
		}
	}
};

const signUpPage = props => (
		<div>
			<SignUpForm onSubmit={values => props.signUp(values.email, values.password)} />
			<Snackbar
					bodyStyle={{ backgroundColor: '#F44336' }}
					open={props.account.signUpError !== undefined}
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
