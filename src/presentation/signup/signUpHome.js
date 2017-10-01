import React from "react";
import PropTypes from "prop-types";
import Snackbar from "material-ui/Snackbar";
import {get} from "lodash";
import "../../App.css";
import SignUpForm from "./SignUpForm";

const firebaseErrorCodeToFriendlyMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/email-already-in-use': return "This email is already in use";
        case 'auth/weak-password': return "Your password must be at least 6 characters";
        default: return 'There was an issue creating your account. Please try again'
    }
};

const SignUpPage = props => (
    <div>
      <SignUpForm onSubmit={values => {
	      props.signUp(values.email, values.password);
	      props.updateProfile(values.fName, values.lName, values.photoURL)
      }}/>
      <Snackbar
        bodyStyle={{backgroundColor: '#F44336'}}
        open={props.account.signUpError !== undefined}
        message={firebaseErrorCodeToFriendlyMessage(get(props, 'account.signUpError.code'))}
        autoHideDuration={4000}
      />
    </div>
);

SignUpPage.propTypes = {
    account: PropTypes.shape({
        signUp: PropTypes.shape({
            code: PropTypes.string,
            message: PropTypes.string,
        }),
	    updateProfile: PropTypes.shape({
	        code: PropTypes.string,
		    message: PropTypes.string,
        }),
    }),
    signUp: PropTypes.func.isRequired,
	updateProfile: PropTypes.func.isRequired,
};

SignUpPage.defaultProps = {
    account: {},
};

export default SignUpPage
