import React from 'react'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import PropTypes from 'prop-types'
import { TextField } from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton'
import { connect } from 'react-redux'


import './signUp.css'


const validate = values => {
    const errors = {};

    if (!values.email || !values.password || !values.confirmPassword) {
        if (!values.email) {
            errors.email = "You forgot to enter an email!";
        }
        if (!values.password) {
            errors.password = "You forgot to enter a password!";
        }
        if (!values.confirmPassword) {
            errors.confirmPassword = "You forgot to confirm your password!";
        }
    }
    if (values.password && values.confirmPassword && !(values.password === values.confirmPassword)) {
        errors.confirmPassword = "Passwords must match";
    }

    return errors;
};

const SignUpForm = (props) => {
  const { handleSubmit, submitting } = props;
	return (
    <form
        onSubmit={handleSubmit}>
      <div>
        <Field
          name="firstName"
          component={TextField}
          floatingLabelText="First Name"
        />
      </div>
      <div>
        <Field
          name="lastName"
          component={TextField}
          floatingLabelText="Last Name"
        />
      </div>
	    <br/>
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
        />
      </div>
      <div>
        <Field
          name="password"
          component={TextField}
          floatingLabelText="Password"
          type="password"
        />
      </div>
      <div id="confirmPasswordInput">
	    <Field
		  name="confirmPassword"
		  component={TextField}
		  floatingLabelText="Confirm Password"
		  type="password"
	    />
      </div>
      <RaisedButton type="submit" disabled={props.error || submitting}>Sign Up</RaisedButton>
    </form>
  )
};

const adaptFileEventToValue = delegate =>
		e => delegate(e.target.files[0])

const FileInput = ({
		input: {
				value: omitValue,
				onChange,
				onBlur,
				...inputProps,
		},
		meta: omitMeta,
		...props,
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


SignUpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

let SignUpFormFormEnriched = reduxForm({
  form: 'signUp',
    validate
})(SignUpForm);

// Decorate with redux-form
const selector = formValueSelector('signUp') // <-- same as form name
SignUpFormFormEnriched = connect(
		state => {
			// can select values individually
			const photoFile = selector(state, 'photoFile');
			return {
				photoFile,
			}
		}
)(SignUpFormFormEnriched)

export default SignUpFormFormEnriched

