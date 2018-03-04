import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'
import { Card, CardTitle } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import Toggle from 'material-ui/Toggle'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline'
import LinkIcon from 'material-ui/svg-icons/content/link'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import YoutubeIcon from '../profile/YoutubeLogo'
import VimeoIcon from '../profile/VimeoLogo'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import BackIcon from 'material-ui/svg-icons/hardware/keyboard-backspace'
import PropTypes from 'prop-types'
import { get, pickBy } from 'lodash'
import moment from 'moment'
import AddLinkForm from './AddLinkForm'
import EditLinkForm from './EditLinkForm'
import AddCreditForm from './AddCreditForm'
import EditVideoForm from './EditVideoForm'
import SearchAndSelectRoles from '../common/SearchAndSelectRoles'
import AddVideoForm from './AddVideoForm'
import '../../App.css'
import '../../presentation/profile/ViewProfile.css'

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
      editVideoDialogOpen: false
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
    this.handleEditVideoOpen = this.handleEditVideoOpen.bind(this)
    this.handleEditVideoClose = this.handleEditVideoClose.bind(this)
    this.handleAddCreditClose = this.handleAddCreditClose.bind(this)
    this.handleAddCreditOpen = this.handleAddCreditOpen.bind(this)
  }

  componentWillReceiveProps(props) {
    const { data, auth } = props
    const uid = get(auth, 'uid', '')
    const userProfile = get(data, `userProfiles.${uid}`)
    const userRoleIds = get(userProfile, 'roles', [])
    const roles = get(data, 'roles', {})
    const roleNames = userRoleIds.map(roleId => roles[roleId]).filter(i => i !== undefined).map(r => r.roleName)
    this.setState({ selectedRoles: roleNames })
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

  handleEditVideoOpen() {
    this.setState({ editVideoDialogOpen: true })
  }

  handleEditVideoClose() {
    this.setState({ editVideoDialogOpen: false })
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
    const findRoleId = roleName => Object.keys(roles).find((roleId) => {
      const role = roles[roleId]
      return role.roleName === roleName
    })
    const { selectedRoles } = this.state
    const userProfileRolePath = `/userProfiles/${uid}`
    const selectedRoleIds = selectedRoles.map(findRoleId)
    const allRoles = [...selectedRoleIds]
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
      experience: Number.parseInt(values.experience, 10)
    })
    partialUpdateAlgoliaObject('names', {
      objectID: uid,
      experience: Number.parseInt(values.experience, 10)
    })
  }

  render() {
    const { auth, data, pristine, submitting, firebase,
      handleSubmit, remoteSubmitForm, addLinkToProfile, editProfileLink, removeProfileLink, initForm,
      addCredit, deleteCredit, deleteRole, searchForRoles, roleSearchResults,
      addYoutubeToProfile, addVimeoToProfile, removeVideo, editVideo, setPublic } = this.props

    const uid = get(auth, 'uid', '')
    const profile = get(data, `account.${uid}`)
    const selectedRoles = get(this.state, 'selectedRoles', [])
    const roles = get(data, 'roles', {})
    const genres = get(data, 'genres', [])
    const userProfile = get(data, `userProfiles.${uid}`)
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
    const name = `${get(profile, 'firstName', '')} ${get(profile, 'lastName', '')}`
    const isPublic = get(profile, 'public', false)
    const video = get(userProfile, 'video', '')[0]

    const addYoutubeActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleAddYoutubeClose}
      />,
      <FlatButton
        label="Save"
        primary
        onClick={() => {
          remoteSubmitForm('AddVideoForm')
          this.setState({ updated: true })
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
        label="Save"
        primary
        onClick={() => {
          remoteSubmitForm('AddVideoForm')
          this.setState({ updated: true })
          this.handleAddVimeoClose()
        }}
      />
    ]

    const dialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Save"
        primary
        onClick={() => {
          this.setState({ updated: true })
          this.handleSubmit()
        }}
      />
    ]

    const addLinkActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleAddLinkClose}
      />,
      <FlatButton
        label="Save"
        primary
        onClick={() => {
          remoteSubmitForm('AddLinkForm')
          this.setState({ updated: true })
          this.handleAddLinkClose()
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
        label="Save"
        primary
        onClick={() => {
          remoteSubmitForm('AddCreditForm')
          this.setState({ updated: true })
          this.handleAddCreditClose()
        }}
      />
    ]
    const currentYear = moment().year()
    return (
      <div style={{ paddingTop: 10, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'left', marginLeft: 20, marginTop: 5 }}>
          <Link to={`/profile?query=${uid}`}>
            <FloatingActionButton mini backgroundColor="#FFFFFF">
              <BackIcon style={{ fill: 'black' }} />
            </FloatingActionButton>
          </Link>
        </div>
        <div style={{ paddingTop: 30 }}>
          <Card style={styles.card}>
            <div className="toggleContainer">
              <div className="toggle">
                <Toggle
                  label={isPublic ? 'Public' : 'Private'}
                  toggled={isPublic}
                  onToggle={(event, toggleValue) => {
                    firebase.updateProfile({
                      public: toggleValue
                    })
                    setPublic(toggleValue, uid)
                  }}
                />
              </div>
              <div>
            Just here to search? Turn your profile to "Private" to not appear in other's searches.
              </div>
            </div>
          </Card>
        </div>
        <div style={{ display: 'flex', marginTop: 30 }}>
          <Card style={styles.card}>
            <CardTitle style={{ textAlign: 'left' }}title="General" />
            <div style={{ display: 'flex', justifyContent: 'left', paddingTop: 30 }}>
              <div>
                <Avatar src={profileImageUrl} style={{ borderRadius: 5 }} size={180} />
                <RaisedButton
                  style={{ border: 'solid 2px #4A90E2', borderRadius: 5, marginTop: 40 }}
                  labelColor="#06397A"
                  className="imageText"
                  label="Upload Picture"
                  labelPosition="before"
                  containerElement="label"
                >
                  <FileUploader uid={uid} uploadFile={firebase.uploadFile} updateProfile={firebase.updateProfile} />
                </RaisedButton>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', marginLeft: '25px' }}>
                <div style={{ fontWeight: 'bold', textAlign: 'left' }}>{name}</div>
                <div>
                  <form onSubmit={handleSubmit(this.handleProfileUpdate)}>
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
                        name="email"
                        component={renderTextField}
                        floatingLabelText="Display Email Address"
                        type="email"
                      />
                    </div>
                    <div style={{ width: '50%', marginTop: 10 }}>
                      <RaisedButton
                        buttonStyle={{ borderRadius: 5 }}
                        type="submit"
                        primary
                        label="Save"
                        disabled={pristine || submitting}
                        onClick={this.updateMessage}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>

          </Card>
        </div>
        <div style={{ paddingTop: 30 }}>
          <Card style={styles.card}>
            <CardTitle style={{ textAlign: 'left' }} title="About Me" />
            <form onSubmit={handleSubmit(this.handleProfileUpdate)}>
              <div>
                <div>
                  <Field
                    name="bio"
                    component={renderTextField}
                    floatingLabelStyle={{ display: 'flex' }}
                    floatingLabelText="About Me"
                    type="text"
                    multiLine
                    rows={3}
                  />
                </div>
              </div>
              <RaisedButton
                buttonStyle={{ borderRadius: 5 }}
                type="submit"
                className="accountButton"
                primary
                label="Save"
                disabled={pristine || submitting}
                style={{ marginBottom: '10px' }}
                onClick={this.updateMessage}
              />
            </form>
          </Card>
        </div>
        <div style={{ paddingTop: 30 }}>
          <Card className="profile-card big-card" style={styles.card}>
            <CardTitle title="Links" style={{ textAlign: 'left' }} />
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingTop: 5 }}>
              {userLinks.map((link, i) => (
                <RaisedButton
                  backgroundColor="#4A90E2"
                  labelColor="#fff"
                  labelPosition="before"
                  icon={<EditIcon />}
                  label={link.title}
                  buttonStyle={{ borderRadius: 5 }}
                  style={{ marginRight: 5 }}
                  key={link.title}
                  onClick={() => {
                    initForm('EditLinkForm', { title: link.title, url: link.url })
                    this.handleEditLinkOpen()
                  }}
                >
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
                          label="Save"
                          primary
                          onClick={() => {
                            remoteSubmitForm('EditLinkForm')
                            this.setState({ updated: true })
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
                      onDelete={() => {
                        removeProfileLink(userLinks, i, uid)
                        this.handleEditLinkClose()
                      }}
                      initialValues={{ title: link.title, url: link.url }}
                    />
                  </Dialog>
                </RaisedButton>
              ))}
            </div>
            <div>
              <RaisedButton
                style={{ border: 'solid 2px #4A90E2', borderRadius: 5, marginTop: 10 }}
                label="Add Link"
                icon={<LinkIcon />}
                onClick={this.handleAddLinkOpen}
              >
                <Dialog
                  title="Add a Link"
                  actions={addLinkActions}
                  modal={false}
                  open={this.state.addLinkDialogOpen}
                  onRequestClose={this.handleAddLinkClose}
                >
                  <AddLinkForm userLinks={userLinks} onSubmit={values => addLinkToProfile(userLinks, values.title, values.url, uid)} />
                </Dialog>
              </RaisedButton>
            </div>
          </Card>
        </div>

        <div style={{ paddingTop: 30 }}>
          <Card className="profile-card big-card" style={styles.card}>
            <CardTitle style={{ textAlign: 'left' }} title="Featured Video" />
            { video ? (
              <RaisedButton
                backgroundColor="#4A90E2"
                labelColor="#fff"
                labelPosition="before"
                icon={<EditIcon />}
                label={video.title}
                buttonStyle={{ borderRadius: 5 }}
                style={{ marginRight: 5 }}
                key={video.title}
                onClick={() => {
                  initForm('EditVideoForm', { title: video.title, url: video.url })
                  this.handleEditVideoOpen()
                }}
              >
                <Dialog
                  title="Edit a Video"
                  actions={
                    [
                      <FlatButton
                        label="Cancel"
                        primary
                        onClick={this.handleEditVideoClose}
                      />,
                      <FlatButton
                        label="Save"
                        primary
                        onClick={() => {
                          remoteSubmitForm('EditVideoForm')
                          this.setState({ updated: true })
                          this.handleEditVideoClose()
                        }}
                      />
                    ]
                  }
                  modal
                  open={this.state.editVideoDialogOpen}
                >
                  <EditVideoForm
                    onSubmit={(values) => {
                      editVideo(video, values.title, values.url, uid)
                    }}
                    onDelete={() => {
                      removeVideo(video, uid)
                      this.handleEditVideoClose()
                    }}
                    initialValues={{ title: video.title, url: video.url }}
                  />
                </Dialog>
              </RaisedButton>
            ) : (
              <div>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
              Where is your video?
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <RaisedButton
                    onClick={this.handleAddYoutubeOpen}
                    style={{ height: 90, width: 120, marginRight: 10 }}
                    icon={<YoutubeIcon style={{ height: 80, width: 100 }} />}
                  >
                    <Dialog
                      title="Add a Youtube video"
                      actions={addYoutubeActions}
                      modal
                      open={this.state.addYoutubeDialogOpen}
                    >
                      <AddVideoForm onSubmit={values => addYoutubeToProfile(video, values.title, values.url, uid)} />
                    </Dialog>
                  </RaisedButton>
                  <RaisedButton
                    onClick={this.handleAddVimeoOpen}
                    style={{ height: 90, width: 120 }}
                    icon={<VimeoIcon style={{ height: 80, width: 100 }} />}
                  >
                    <Dialog
                      title="Add a Vimeo video"
                      actions={addVimeoActions}
                      modal
                      open={this.state.addVimeoDialogOpen}
                    >
                      <AddVideoForm onSubmit={values => addVimeoToProfile(video, values.title, values.url, uid)} />
                    </Dialog>
                  </RaisedButton>
                </div>
              </div>)
            }
          </Card>
        </div>

        <div style={{ paddingTop: 30 }}>
          <Card className="profile-card big-card" style={styles.card}>
            <CardTitle style={{ textAlign: 'left' }} title="Credits" />
            <div className="roles" style={{ paddingTop: 10 }}>
              {
                userRoles.map((role) => {
                  const associatedCredits = userCredits.filter(c => c.roleId === role.roleId)
                  return (
                    <div className="role-column" key={role.roleId}>
                      <div className="rounded-header">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          {role.roleName}
                          <IconButton onClick={() => {
                            this.setState({ updated: true })
                            deleteRole(userRoles, userCredits, role, uid)
                          }}
                          >
                            <ActionDelete color={'#fff'} />
                          </IconButton>
                        </div>
                      </div>
                      <div className="credits">
                        { associatedCredits.map(credit => (
                          <div key={credit.title}>
                            <div style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }} key={credit.title}>
                              {credit.year}{credit.genre ? ` (${credit.genre})` : ''} : {credit.title}
                              <div>
                                <IconButton
                                  onClick={() => {
                                    this.setState({ updated: true })
                                    deleteCredit(userCredits, credit, uid)
                                  }}
                                >
                                  <ActionDelete />
                                </IconButton>
                              </div>
                            </div>
                          </div>
                        )
                        )}
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div>
              <RaisedButton
                style={{ border: 'solid 2px #4A90E2',
                  borderRadius: 5,
                  marginTop: 20 }}
                label="Add Roles"
                icon={<AddIcon />}
                onClick={this.handleOpen}
              />
              <RaisedButton
                style={{ border: 'solid 2px #4A90E2',
                  borderRadius: 5,
                  marginTop: 20,
                  marginLeft: 10 }}
                label="Add Credits"
                icon={<AddIcon />}
                onClick={this.handleAddCreditOpen}
              />
              <Dialog
                title="Add Credit"
                actions={addCreditActions}
                modal={false}
                open={this.state.addCreditDialogOpen}
                onRequestClose={this.handleAddCreditClose}
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
                modal={false}
                autoScrollBodyContent
                open={this.state.dialogOpen}
                onRequestClose={this.handleClose}
              >
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                  <SearchAndSelectRoles
                    page="editProfile"
                    searchForRoles={searchForRoles}
                    onItemSelected={(selectedItems, itemSelected, type) => {
                      if (type === 'add') {
                        this.setState({ selectedRoles: [...selectedRoles, itemSelected.roleName] })
                      }
                    }}
                    roleSearchResults={roleSearchResults}
                    roleFilters={selectedRoles}
                  />
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
  removeProfileLink: PropTypes.func.isRequired,
  addCredit: PropTypes.func.isRequired,
  deleteCredit: PropTypes.func.isRequired,
  deleteRole: PropTypes.func.isRequired,
  editProfileLink: PropTypes.func.isRequired,
  remoteSubmitForm: PropTypes.func.isRequired,
  searchForRoles: PropTypes.func.isRequired,
  roleSearchResults: PropTypes.arrayOf(PropTypes.object),
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
