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
          hintText="Email"
          floatingLabelText="Email"
          type="email"
        />
      </div>
      <div>
        <Field
          name="password"
          component={TextField}
          hintText="Password"
          floatingLabelText="Password"
          type="password"
        />
      </div>
      <RaisedButton type="submit">Register</RaisedButton>
    </form>
  )
};

SignUpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const SignUpFormEnriched = reduxForm({
  form: 'signUp',
})(SignUpForm);

export default SignUpFormEnriched
