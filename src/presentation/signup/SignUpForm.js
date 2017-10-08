import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { TextField } from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton'
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
  const { handleSubmit, firebase, submitting } = props;
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
        <FlatButton className="imageText" icon={<UploadIcon />} label="Upload Picture" labelPosition="before" containerElement="label">
            <FileUploader uid={uid} uploadFile={firebase.uploadFile} />
        </FlatButton>
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

const FileUploader = props => (
        <input
                name="myFile"
                type="file"
                style={{ display: 'none' }}
                onChange={(event) => {
                    const { uid, uploadFile, updateProfile } = props
                    const file = event.target.files[0]
                    const fbFilePath = `/images/users/account/${uid}/account_image`
                    uploadFile(fbFilePath, file).then((response) => {
                        const downloadUrl = response.downloadURL
                        updateProfile({
                            photoURL: downloadUrl,
                        })
                    })
                }}
        />
)


FileUploader.propTypes = {
    uid: PropTypes.string,
    uploadFile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
}

FileUploader.defaultProps = {
    uid: '',
}

SignUpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const SignUpFormFormEnriched = reduxForm({
  form: 'signUp',
    validate
})(SignUpForm);

export default SignUpFormFormEnriched

