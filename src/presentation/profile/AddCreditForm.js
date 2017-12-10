import React from 'react'
import { Field, reduxForm } from 'redux-form'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import PropTypes from 'prop-types'

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

const renderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
  <SelectField
    floatingLabelText={label}
    floatingLabelFixed
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom}
  />
)

const AddCreditForm = ({ handleSubmit, userRoles, genres }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <Field
        name="role"
        component={renderSelectField}
        label="Role"
      >
        {userRoles.map((role, i) => (
          <MenuItem key={role.roleName} value={i} primaryText={role.roleName} />
        ))}
      </Field>
      <div>
        <Field
          name="genre"
          component={renderSelectField}
          label="Genre"
        >
          {genres.map((genre, i) => (
            <MenuItem key={genre} value={i} primaryText={genre} />
          ))}
        </Field>
      </div>
      <Field
        name="title"
        component={renderTextField}
        floatingLabelText="Title"
        type="text"
      />
      <Field
        name="year"
        component={renderTextField}
        floatingLabelText="Year"
        type="text"
      />
    </div>
  </form>
)

AddCreditForm.propTypes = {
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  userRoles: PropTypes.arrayOf(PropTypes.shape({
    roleName: PropTypes.string,
    roleId: PropTypes.string
  })).isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'AddCreditForm'
})(AddCreditForm)
