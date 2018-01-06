import React from 'react'
import { Field, reduxForm } from 'redux-form'
import TextField from 'material-ui/TextField'
import PropTypes from 'prop-types'

const validate = (values) => {
  const errors = {}

  if (!values.title) {
    errors.title = 'A title is required'
  }
  if (!values.url) {
    errors.url = 'A link address is required'
  }
  return errors
}

const renderTextField = ({ input, name, label, meta: { touched, error }, ...custom }) => (
  <TextField
    hintText={label}
    hintStyle={{ float: 'left' }}
    textareaStyle={{ float: 'left' }}
    floatingLabelText={label}
    errorText={touched && error}
    multiLine={input.name === 'bio'}
    fullWidth
    {...input}
    {...custom}
  />
)

const AddVimeoForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <Field
        name="title"
        component={renderTextField}
        floatingLabelText="Title"
        type="text"
      />
      <Field
        name="url"
        component={renderTextField}
        floatingLabelText="Link Address"
        type="url"
      />
    </div>
  </form>
)

AddVimeoForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'AddVimeoForm',
  validate
})(AddVimeoForm)
