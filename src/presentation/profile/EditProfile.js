import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Card, CardTitle } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Chip from 'material-ui/Chip'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline'
import ContentAdd from 'material-ui/svg-icons/content/add'
import UploadIcon from 'material-ui/svg-icons/file/file-upload'
import PropTypes from 'prop-types'
import { get, pickBy } from 'lodash'
import moment from 'moment'
import AddLinkForm from './AddLinkForm'
import EditLinkForm from './EditLinkForm'
import AddYoutubeForm from './AddYoutubeForm'
import AddVimeoForm from './AddVimeoForm'
import AddCreditForm from './AddCreditForm'
import '../../App.css'
import './ViewProfile.css'
import '../account/accountPage.css'

const styles = {
  card: {
    width: '40%',
    height: 'auto',
    marginTop: '1em',
    display: 'block',
    margin: 'auto',
    padding: '1em'
  },
  chipStyle: {
    margin: 6
  }
}

const RoleChipDisplays = (roles, selected, onClick = () => {}, onDelete) => roles.map((role) => {
  const isSelected = selected.includes(role.roleId)
  const chipStyle = isSelected ? { ...styles.chipStyle, backgroundColor: '#707070' } : styles.chipStyle
  const deleteFunc = onDelete !== undefined ? onDelete.bind(this, role.roleId) : onDelete
  return (
    <Chip id={role.roleId} key={role.roleId} onRequestDelete={deleteFunc} onClick={onClick} style={chipStyle} >{role.roleName}</Chip>
  )
})

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

class EditProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({ 
      dialogOpen: false, 
      updated: false, 
      addLinkDialogOpen: false, 
      editLinkDialogOpen: false, 
      addCreditDialogOpen: false, 
      addYoutubeDialogOpen: false,
      addVimeoDialogOpen: false,
    })
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleProfileUpdate = this.handleProfileUpdate.bind(this)
    this.handleUpdateClose = this.handleUpdateClose.bind(this)
    this.updateMessage = this.updateMessage.bind(this)
    this.handleAddLinkClose = this.handleAddLinkClose.bind(this)
    this.handleAddLinkOpen = this.handleAddLinkOpen.bind(this)
    this.handleEditLinkClose = this.handleEditLinkClose.bind(this)
    this.handleEditLinkOpen = this.handleEditLinkOpen.bind(this)
    this.handleAddYoutubeClose = this.handleAddYoutubeClose.bind(this)
    this.handleAddYoutubeOpen = this.handleAddYoutubeOpen.bind(this)
    this.handleAddVimeoClose = this.handleAddVimeoClose.bind(this)
    this.handleAddVimeoOpen = this.handleAddVimeoOpen.bind(this)
    this.handleAddCreditClose = this.handleAddCreditClose.bind(this)
    this.handleAddCreditOpen = this.handleAddCreditOpen.bind(this)    

  }

  handleAddCreditClose() {
    this.setState({ addCreditDialogOpen: false })
  }

  handleAddCreditOpen() {
    this.setState({ addCreditDialogOpen: true })
  }

  handleEditLinkClose() {
    this.setState({ editLinkDialogOpen: false })
  }

  handleEditLinkOpen() {
    this.setState({ editLinkDialogOpen: true })
  }

  handleAddLinkClose() {
    this.setState({ addLinkDialogOpen: false })
  }

  handleAddLinkOpen() {
    this.setState({ addLinkDialogOpen: true })
  }

  handleAddYoutubeClose() {
    this.setState({ addYoutubeDialogOpen: false })
  }

  handleAddYoutubeOpen() {
    this.setState({ addYoutubeDialogOpen: true })
  }  

  handleAddVimeoClose() {
    this.setState({ addVimeoDialogOpen: false })
  }

  handleAddVimeoOpen() {
    this.setState({ addVimeoDialogOpen: true })
  }

  updateMessage() {
    this.setState({
      updated: true
    })
  }

  handleUpdateClose() {
    this.setState({
      updated: false
    })
  }

  handleOpen() {
    this.setState({ dialogOpen: true, selectedRoles: [] })
  }

  handleSubmit() {
    const { auth, firebase, data, partialUpdateAlgoliaObject } = this.props
    const uid = get(auth, 'uid', '')
    const roles = get(data, 'roles', {})
    const { selectedRoles } = this.state
    const userProfile = get(this.props, `data.userProfiles.${uid}`)
    const userRoleIds = get(userProfile, 'roles', [])
    const userProfileRolePath = `/userProfiles/${uid}`
    const allRoles = [...userRoleIds, ...selectedRoles]
    const rolesNames = allRoles.map(roleId => roles[roleId].roleName)
    firebase.update(userProfileRolePath, { roles: allRoles })
    partialUpdateAlgoliaObject('profiles', {
      objectID: uid,
      roles: rolesNames
    })
    this.setState({ dialogOpen: false })
  }
  handleClose() {
    this.setState({ dialogOpen: false })
  }

  handleProfileUpdate(values) {
    const { auth, firebase, partialUpdateAlgoliaObject } = this.props
    const uid = get(auth, 'uid', '')
    const userProfilePath = `/userProfiles/${uid}`
    const onlyDefinedValues = pickBy(values, value => value !== null && value !== undefined)

    firebase.update(userProfilePath, onlyDefinedValues)

    partialUpdateAlgoliaObject('profiles', {
      objectID: uid,
      experience: values.experience
    })
  }

  render() {
    const { auth, profile, data, firebase, pristine, submitting,
      handleSubmit, remoteSubmitForm, addLinkToProfile, editProfileLink, addYoutubeToProfile, addVimeoToProfile, removeProfileLink, initForm,
      addCredit } = this.props
    const uid = get(auth, 'uid', '')
    const selectedRoles = get(this.state, 'selectedRoles', [])
    const roles = get(data, 'roles', {})
    const genres = get(data, 'genres', [])
    const userProfile = get(data, `userProfiles.${auth.uid}`)
    const userRoles = get(userProfile, 'roles', [])
      .map(roleId => ({ roleName: get(roles, `${roleId}.roleName`, ''), roleId }))
      .sort((a, b) => {
        const aCaps = a.roleName.toUpperCase()
        const bcaps = b.roleName.toUpperCase()
        if (aCaps < bcaps) {
          return -1
        } else if (aCaps > bcaps) {
          return 1
        }
        return 0
      })
    const userLinks = get(userProfile, 'links', [])
    const userCredits = get(userProfile, 'credits', [])
    const profileImageUrl = get(profile, 'photoURL', '')
    const photoURL = get(profile, 'photoURL', '')
    const name = `${get(profile, 'firstName', '')} ${get(profile, 'lastName', '')}`
    const email = get(auth, 'email', '')
    const youtubeVideo = get(profile, 'youtubeVideo', '')
    const vimeoVideo = get(profile, 'vimeoVideo', '')
    const possibleRolesToAdd = Object.keys(roles).reduce((acc, roleId) => {
      const roleName = get(roles, `${roleId}.roleName`, '')
      const r = userRoles.map(role => role.roleName)
      if (r.includes(roleName)) {
        return acc
      }
      return [...acc, { roleName, roleId }]
    }, []).sort((a, b) => {
      const aCaps = a.roleName.toUpperCase()
      const bcaps = b.roleName.toUpperCase()
      if (aCaps < bcaps) {
        return -1
      } else if (aCaps > bcaps) {
        return 1
      }
      return 0
    })

    const dialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        disabled={selectedRoles.length === 0}
        onClick={this.handleSubmit}
      />
    ]

    const addLinkActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleAddLinkClose}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={() => {
          remoteSubmitForm('AddLinkForm')
          this.handleAddLinkClose()
        }}
      />
    ]    

    const addYoutubeActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleAddYoutubeClose}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={() => {
          remoteSubmitForm('AddYoutubeForm')
          this.handleAddYoutubeClose()
        }}
      />
    ]

    const addVimeoActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleAddVimeoClose}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={() => {
          remoteSubmitForm('AddVimeoForm')
          this.handleAddVimeoClose()
        }}
      />
    ]

    const addCreditActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleAddCreditClose}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={() => {
          remoteSubmitForm('AddCreditForm')
          this.handleAddCreditClose()
        }}
      />
    ]

    const currentYear = moment().year()
    return (
      <div style={{ paddingTop: 10, display: 'flex', flexDirection: 'column' }}>
        <div>
          <Card style={styles.card}>
            <CardTitle title="Edit Profile" />
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'left', paddingTop: 30 }}>
            <div>
              <Avatar className="accountImage avatar" src={photoURL} size={150} />
              <FlatButton className="imageText" icon={<UploadIcon />} label="Upload Picture" labelPosition="before" containerElement="label">
                <FileUploader uid={uid} uploadFile={firebase.uploadFile} updateProfile={firebase.updateProfile} />
              </FlatButton>
            </div>              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', marginLeft: '25px' }}>
                <div style={{ fontWeight: 'bold', textAlign: 'left' }}>{name}</div>
                <div>
                  <form onSubmit={handleSubmit(this.handleProfileUpdate)}>
                    <div className="fields">
                      <div>
                        <Field
                          name="headline"
                          component={renderTextField}
                          floatingLabelText="Headline"
                          type="text"
                        />
                      </div>
                      <div>
                        <Field
                          name="experience"
                          component={renderTextField}
                          floatingLabelText="Year Started in Industry"
                          type="number"
                          max={`${currentYear}`}
                          min={`${currentYear - 100}`}
                        />
                      </div>
                      <div>
                        <Field
                          name="phone"
                          component={renderTextField}
                          floatingLabelText="Phone Number"
                          type="text"
                        />
                      </div>                   
                      <div>
                        <Field
                          name="displayEmail"
                          component={renderTextField}
                          floatingLabelText="Display Email Address"
                          type="email"
                        />
                      </div>
                      {/*<div style={{ fontWeight: 'bold', textAlign: 'left', marginTop: '15px'}}>{email}</div>*/}
                    </div>
                    <RaisedButton type="submit" className="accountButton" primary label="Save" disabled={pristine || submitting} onClick={this.updateMessage} />
                  </form>
                </div>
              </div>
            </div>

          </Card>
        </div>
        <div style={{ paddingTop: 30 }}>
          <Card style={styles.card}>
            <CardTitle title="About Me" />

            <form onSubmit={handleSubmit(this.handleProfileUpdate)}>
              <div className="fields">
                <div>
                  <Field
                    name="bio"
                    component={renderTextField}
                    floatingLabelText="About Me"
                    type="text"
                    multiLine
                    rows={3}
                  />
                </div>
              </div>
              <RaisedButton type="submit" className="accountButton" primary label="Save" disabled={pristine || submitting} style={{ marginBottom: '10px' }} onClick={this.updateMessage} />
            </form>

            <Divider />
            <CardTitle title="Links" />
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingTop: 5 }}>
              {userLinks.map((link, i) => (
                <Chip
                  onRequestDelete={() => {
                    removeProfileLink(userLinks, i, uid)
                  }}
                  key={link.title}
                  onClick={() => {
                    initForm('EditLinkForm', { title: link.title, url: link.url })
                    this.handleEditLinkOpen()
                  }}
                >
                  {link.title}
                  <Dialog
                    title="Edit a Link"
                    actions={
                      [
                        <FlatButton
                          label="Cancel"
                          primary
                          onClick={this.handleEditLinkClose}
                        />,
                        <FlatButton
                          label="Submit"
                          primary
                          onClick={() => {
                            remoteSubmitForm('EditLinkForm')
                            this.handleEditLinkClose()
                          }}
                        />
                      ]
                    }
                    modal
                    open={this.state.editLinkDialogOpen}
                  >
                    <EditLinkForm
                      onSubmit={(values) => {
                        editProfileLink(userLinks, i, values.title, values.url, uid)
                      }}
                      initialValues={{ title: link.title, url: link.url }}
                    />
                  </Dialog>
                </Chip>
              ))}
            </div>
            <div>
              <RaisedButton primary label="Add Link" style={{ marginTop: '10px' }} icon={<ContentAdd />} onClick={this.handleAddLinkOpen} >
                <Dialog
                  title="Add a Link"
                  actions={addLinkActions}
                  modal
                  open={this.state.addLinkDialogOpen}
                >
                  <AddLinkForm userLinks={userLinks} onSubmit={values => addLinkToProfile(userLinks, values.title, values.url, uid)} />
                </Dialog>
              </RaisedButton>
            </div>
          </Card>
        </div>

        <div style={{paddingTop: '30px'}}>
          <Card style={styles.card}>
            <CardTitle title="Featured Videos" />
            <Divider />
            <p style={{textAlign: 'center', opacity: '0.4'}}>Where is your video?</p>
            <div>
              <RaisedButton primary label="Youtube" style={{ marginTop: '10px' }} icon={<ContentAdd />} onClick={this.handleAddYoutubeOpen} >
                <Dialog
                  title="Add a Youtube video"
                  actions={addYoutubeActions}
                  modal
                  open={this.state.addYoutubeDialogOpen}
                >
                  <AddYoutubeForm youtubeVideo={youtubeVideo} onSubmit={values => addYoutubeToProfile(youtubeVideo, values.title, values.url, uid)} />
                </Dialog>
              </RaisedButton>
            </div>            
            <div>
              <RaisedButton primary label="Vimeo" style={{ marginTop: '10px' }} icon={<ContentAdd />} onClick={this.handleAddVimeoOpen} >
                <Dialog
                  title="Add a Vimeo video"
                  actions={addVimeoActions}
                  modal
                  open={this.state.addVimeoDialogOpen}
                >
                  <AddVimeoForm vimeoVideo={vimeoVideo} onSubmit={values => addVimeoToProfile(vimeoVideo, values.title, values.url, uid)} />
                </Dialog>
              </RaisedButton>
            </div>

{/*            <form>
              <div>
                <Field
                  name="youtubeVideo"
                  component={renderTextField}
                  floatingLabelText="Youtube Video Link"
                  type="url"
                />
              </div>                  
              <div>
                <Field
                  name="vimeoVideo"
                  component={renderTextField}
                  floatingLabelText="Vimeo Video Link"
                  type="url"
                />
              </div>                  
              <RaisedButton type="submit" className="accountButton" primary label="Save" disabled={pristine || submitting} style={{ marginBottom: '10px' }} onClick={this.updateMessage} />
            </form>*/}
          </Card>
        </div>

        <div style={{ paddingTop: 30 }}>
          <Card className="profile-card big-card" style={styles.card}>
            <CardTitle title="Roles" />
            <Divider />
            <div className="roles" style={{ paddingTop: 10 }}>
              {
                userRoles.map((role) => {
                  const associatedCredits = userCredits.filter(c => c.roleId === role.roleId)
                  return (
                    <div className="role-column" key={role.roleId}>
                      <div className="rounded-header"><span>{role.roleName}</span></div>
                      <div className="credits">
                        { associatedCredits.map(credit => (
                          <p style={{ textAlign: 'left' }} key={credit.title}>{credit.year}{credit.genre ? ` (${credit.genre})` : ''} : {credit.title}</p>
                        )
                        )}
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div>
              <RaisedButton label="Add Roles" icon={<AddIcon />} primary onClick={this.handleOpen} style={{ marginTop: '20px' }} />
              <RaisedButton label="Add Credits" icon={<AddIcon />} primary onClick={this.handleAddCreditOpen} style={{ marginTop: '20px', marginLeft: 10 }} />
              <Dialog
                title="Add Credit"
                actions={addCreditActions}
                modal
                open={this.state.addCreditDialogOpen}
              >
                <AddCreditForm
                  genres={genres}
                  userRoles={userRoles}
                  onSubmit={(values) => {
                    const role = userRoles[values.role]
                    const genre = genres[values.genre]
                    const year = values.year
                    const title = values.title
                    const credit = { roleId: role.roleId, genre, title, year }
                    addCredit(userCredits, credit, uid)
                    this.handleAddCreditClose()
                  }}
                />
              </Dialog>
              <Dialog
                title="Add Roles"
                actions={dialogActions}
                modal
                autoScrollBodyContent
                open={this.state.dialogOpen}
              >
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                  {RoleChipDisplays(possibleRolesToAdd, selectedRoles, (event) => {
                    const roleId = event.currentTarget.id
                    if (selectedRoles.includes(roleId)) {
                      const newRoles = selectedRoles.filter(id => id !== roleId)
                      this.setState({ selectedRoles: newRoles })
                    } else {
                      this.setState({ selectedRoles: [...selectedRoles, roleId] })
                    }
                  })}
                </div>
              </Dialog>
            </div>
          </Card>
        </div>

        <Snackbar
          bodyStyle={{ backgroundColor: '#00C853' }}
          open={this.state.updated}
          message={'Successfully Updated.'}
          autoHideDuration={4000}
          onRequestClose={this.handleUpdateClose}
        />

      </div>
    )
  }
}

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
        const downloadUrl = response.uploadTaskSnaphot.downloadURL
        updateProfile({
          photoURL: downloadUrl
        })
      })
    }}
  />
)

FileUploader.propTypes = {
  uid: PropTypes.string,
  uploadFile: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired
}

FileUploader.defaultProps = {
  uid: ''
}

EditProfile.propTypes = {
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  auth: PropTypes.shape({
    uid: PropTypes.string
  }).isRequired,
  profile: PropTypes.shape({
    photoURL: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string
  }).isRequired,
  data: PropTypes.shape({
    roles: PropTypes.object,
    userProfile: PropTypes.object,
    genres: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  firebase: PropTypes.shape({
    set: PropTypes.func
  }).isRequired,
  partialUpdateAlgoliaObject: PropTypes.func.isRequired,
  addLinkToProfile: PropTypes.func.isRequired,
  addYoutubeToProfile: PropTypes.func.isRequired,
  addVimeoToProfile: PropTypes.func.isRequired,
  removeProfileLink: PropTypes.func.isRequired,
  addCredit: PropTypes.func.isRequired,
  editProfileLink: PropTypes.func.isRequired,
  remoteSubmitForm: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

EditProfile.defaultProps = {
  account: {}
}

const EditProfileFormEnriched = reduxForm({
  form: 'UpdatePublicProfile',
  validate: (values) => {
    const errors = {}
    const currentYear = moment().year()
    if (values.experience) {
      if (values.experience > currentYear || values.experience < currentYear - 100) {
        errors.experience = `Please choose a year between ${currentYear - 100} and ${currentYear}`
      }
    }
    return errors
  },
  enableReinitialize: true
})(EditProfile)

export default EditProfileFormEnriched
