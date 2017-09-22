import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { TextField } from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton'

const SignUpForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
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
      <div>
	    <Field
		  name="confirmPassword"
		  component={TextField}
		  floatingLabelText="Confirm Password"
		  type="password"
	    />
      </div>
      <RaisedButton type="submit">Sign Up</RaisedButton>
    </form>
  )
};

SignUpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const SignUpFormFormEnriched = reduxForm({
  form: 'signUp',
})(SignUpForm);

export default SignUpFormFormEnriched
