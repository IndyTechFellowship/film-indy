import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { TextField } from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton'

const ForgotPasswordForm = (props) => {
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
      <RaisedButton type="submit">Reset Password</RaisedButton>
    </form>
  )
};

ForgotPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const ForgotPasswordFormEnriched = reduxForm({
  form: 'forgotPassword',
})(ForgotPasswordForm);

export default ForgotPasswordFormEnriched
