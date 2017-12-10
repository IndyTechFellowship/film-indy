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
import PropTypes from 'prop-types'
import { get, pickBy } from 'lodash'
import AddLinkForm from './AddLinkForm'
import EditLinkForm from './EditLinkForm'
import AddCreditForm from './AddCreditForm'
import '../../App.css'
import './ViewProfile.css'

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
    this.state = ({ dialogOpen: false, updated: false, addLinkDialogOpen: false, editLinkDialogOpen: false, addCreditDialogOpen: false })
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
    const { auth, profile, data, pristine, submitting,
      handleSubmit, remoteSubmitForm, addLinkToProfile, editProfileLink, removeProfileLink, initForm,
      addCredit } = this.props
    const uid = get(auth, 'uid', '')
    const selectedRoles = get(this.state, 'selectedRoles', [])
    const roles = get(data, 'roles', {})
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
    const name = `${get(profile, 'firstName', '')} ${get(profile, 'lastName', '')}`
    const email = get(auth, 'email', '')
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
    return (
      <div style={{ paddingTop: 10, display: 'flex', flexDirection: 'column' }}>
        <div>
          <Card style={styles.card}>
            <CardTitle title="Edit Profile" />
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'left', paddingTop: 30 }}>
              <Avatar src={profileImageUrl} size={150} />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', marginLeft: '40px' }}>
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
                          floatingLabelText="Year you began working in industry"
                          type="number"
                        />
                      </div>
                      <div>
                        <Field
                          name="phone"
                          component={renderTextField}
                          floatingLabelText="Phone"
                          type="number"
                        />
                      </div>
                      <div style={{ fontWeight: 'bold', textAlign: 'left', marginTop: '15px'}}>{email}</div>
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
            <CardTitle title="Featured Video" />
            <Divider />
            <form>
              <div>
                <Field
                  name="video"
                  component={renderTextField}
                  floatingLabelText="Featured Video (must be in embed format)"
                  type="url"
                />
              </div>
              <RaisedButton type="submit" className="accountButton" primary label="Save" disabled={pristine || submitting} style={{ marginBottom: '10px' }} onClick={this.updateMessage} />
            </form>
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
                          <p style={{ textAlign: 'left' }} key={credit.title}>{credit.year} : {credit.title}</p>
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
                  userRoles={userRoles}
                  onSubmit={(values) => {
                    const role = userRoles[values.role]
                    const year = values.year
                    const title = values.title
                    const credit = { roleId: role.roleId, title, year }
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
    userProfile: PropTypes.object
  }).isRequired,
  firebase: PropTypes.shape({
    set: PropTypes.func
  }).isRequired,
  partialUpdateAlgoliaObject: PropTypes.func.isRequired,
  addLinkToProfile: PropTypes.func.isRequired,
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
  enableReinitialize: true
})(EditProfile)

export default EditProfileFormEnriched
