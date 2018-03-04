import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Field, reduxForm } from 'redux-form'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import { Card, CardTitle } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import LinkIcon from 'material-ui/svg-icons/content/link'
import { FormControl } from 'material-ui-next/Form'
import { InputLabel } from 'material-ui-next/Input'
import { MenuItem } from 'material-ui-next/Menu'
import { Link } from 'react-router-dom'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import BackIcon from 'material-ui/svg-icons/hardware/keyboard-backspace'
import RenderSelectField from './CustomSelect'
import AddLinkForm from '../profile/AddLinkForm'
import EditLinkForm from '../profile/EditLinkForm'
import AddVideoForm from '../profile/AddVideoForm'
import EditVideoForm from '../profile/EditVideoForm'
import YoutubeIcon from '../profile/YoutubeLogo'
import VimeoIcon from '../profile/VimeoLogo'
import States from './States'
import './EditVendorProfile.css'


const styles = {

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
      const { vendorId, uploadFile, updateVendorProfile } = props
      const file = event.target.files[0]
      const fbFilePath = `/images/vendors/account/${vendorId}/account_image`
      uploadFile(fbFilePath, file).then((response) => {
        const downloadUrl = response.uploadTaskSnaphot.downloadURL
        updateVendorProfile({ profileImage: downloadUrl }, vendorId)
      })
    }}
  />
)

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
class EditVendorProfile extends React.Component {
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
    this.handleAddLinkClose = this.handleAddLinkClose.bind(this)
    this.handleAddLinkOpen = this.handleAddLinkOpen.bind(this)
    this.handleAddYoutubeClose = this.handleAddYoutubeClose.bind(this)
    this.handleAddYoutubeOpen = this.handleAddYoutubeOpen.bind(this)
    this.handleAddVimeoClose = this.handleAddVimeoClose.bind(this)
    this.handleAddVimeoOpen = this.handleAddVimeoOpen.bind(this)
    this.handleEditLinkClose = this.handleEditLinkClose.bind(this)
    this.handleEditLinkOpen = this.handleEditLinkOpen.bind(this)
    this.handleEditVideoClose = this.handleEditVideoClose.bind(this)
    this.handleEditVideoOpen = this.handleEditVideoOpen.bind(this)
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
  render() {
    const { vendorProfile, vendorId, firebase, pristine, submitting, handleSubmit, remoteSubmitForm, initForm,
      addLinkToVendorProfile, removeVendorProfileLink, editVendorProfileLink, addVimeoToVendorProfile, addYoutubeToVendorProfile,
      editVendorVideo, removeVendorVideo, updateVendorProfile, setVendorPublic } = this.props
    if (vendorProfile) {
      const vendorLinks = get(vendorProfile, 'links', [])
      const isPublic = get(vendorProfile, 'public', false)
      const video = get(vendorProfile, 'video', '')[0]
      let videoType = 0
      if (video) videoType = video.url.indexOf('youtube') > -1 ? 1 : 2 // 1 for Youtube, 2 for Vimeo

      const profileImageUrl = get(vendorProfile, 'profileImage', 'https://images.vexels.com/media/users/3/144866/isolated/preview/927c4907bbd0598c70fb79de7af6a35c-business-building-silhouette-by-vexels.png')
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
          label="Save"
          primary
          onClick={() => {
            remoteSubmitForm('AddVideoForm')
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
            this.handleAddVimeoClose()
          }}
        />
      ]
      return (
        <div style={{ paddingTop: 10, display: 'flex', flexDirection: 'column' }}>
          <div style={{ textAlign: 'left', marginLeft: 20, marginTop: 5 }}>
            <Link to={`/vendor/${vendorId}`}>
              <FloatingActionButton mini backgroundColor="#FFFFFF">
                <BackIcon style={{ fill: 'black' }} />
              </FloatingActionButton>
            </Link>
          </div>
          <div style={{ paddingTop: 30 }}>
            <Card className="profile-card">
              <div className="toggleContainer">
                <div className="toggle">
                  <Toggle
                    label={isPublic ? 'Public' : 'Private'}
                    toggled={isPublic}
                    onToggle={(event, toggleValue) => {
                      updateVendorProfile({ public: toggleValue }, vendorId)
                      setVendorPublic(toggleValue, vendorId)
                    }}
                  />
                </div>
                <div style={{ marginLeft: 20 }}>
                    Just here to search? Turn your profile to "Private" to not appear in other's searches.
                </div>
              </div>
            </Card>
          </div>
          <div style={{ display: 'flex', marginTop: 30 }}>
            <Card className="profile-card">
              <CardTitle style={{ textAlign: 'left' }}title="General" />
              <div style={{ display: 'flex', justifyContent: 'left', paddingTop: 30 }}>
                <div>
                  <Avatar src={profileImageUrl} style={{ borderRadius: 5, objectFit: 'cover' }} size={180} />
                  <RaisedButton
                    style={{ border: 'solid 2px #4A90E2', borderRadius: 5, marginTop: 40 }}
                    labelColor="#06397A"
                    className="imageText"
                    label="Upload Picture"
                    labelPosition="before"
                    containerElement="label"
                  >
                    <FileUploader vendorId={vendorId} uploadFile={firebase.uploadFile} updateVendorProfile={updateVendorProfile} />
                  </RaisedButton>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', marginLeft: '25px' }}>
                  <div>
                    <form onSubmit={handleSubmit(values => updateVendorProfile(values, vendorId))}>
                      <div>
                        <Field
                          name="name"
                          component={renderTextField}
                          floatingLabelText="Name"
                          type="text"
                        />
                      </div>
                      <div>
                        <Field
                          name="addressLine1"
                          component={renderTextField}
                          floatingLabelText="Address Line 1"
                          type="text"
                        />
                      </div>
                      <div>
                        <Field
                          name="addressLine2"
                          component={renderTextField}
                          floatingLabelText="Address Line 2"
                          type="text"
                        />
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div style={{ marginRight: 5 }}>
                          <Field
                            name="city"
                            component={renderTextField}
                            floatingLabelText="City"
                            type="text"
                          />
                        </div>
                        <div style={{ marginRight: 5, marginTop: 16 }}>
                          <FormControl style={{ width: 60 }}>
                            <InputLabel htmlFor="state">State</InputLabel>
                            <Field
                              name="state"
                              component={RenderSelectField}
                            >
                              {States.map(state => (
                                <MenuItem key={state.abbreviation} value={state.abbreviation} >
                                  {state.abbreviation}
                                </MenuItem>
                              ))}
                            </Field>
                          </FormControl>
                        </div>
                        <div style={{ marginRight: 5 }}>
                          <Field
                            name="zip"
                            component={renderTextField}
                            floatingLabelText="Zip Code"
                            type="text"
                          />
                        </div>
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
                          floatingLabelText="Email Address"
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

          <div style={{ display: 'flex', marginTop: 30 }}>
            <Card className="profile-card">
              <CardTitle style={{ textAlign: 'left' }}title="Point of Contact" />
              <div style={{ display: 'flex', justifyContent: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', marginLeft: '25px' }}>
                  <div>
                    <form onSubmit={handleSubmit(values => updateVendorProfile(values, vendorId))}>
                      <div>
                        <Field
                          name="primaryContactName"
                          component={renderTextField}
                          floatingLabelText="Name"
                          type="text"
                        />
                      </div>
                      <div>
                        <Field
                          name="primaryContactAddressLine1"
                          component={renderTextField}
                          floatingLabelText="Address Line 1"
                          type="text"
                        />
                      </div>
                      <div>
                        <Field
                          name="primaryContactAddressLine2"
                          component={renderTextField}
                          floatingLabelText="Address Line 2"
                          type="text"
                        />
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div style={{ marginRight: 5 }}>
                          <Field
                            name="primaryContactCity"
                            component={renderTextField}
                            floatingLabelText="City"
                            type="text"
                          />
                        </div>
                        <div style={{ marginRight: 5, marginTop: 16 }}>
                          <FormControl style={{ width: 60 }}>
                            <InputLabel htmlFor="state">State</InputLabel>
                            <Field
                              name="primaryContactState"
                              component={RenderSelectField}
                            >
                              {States.map(state => (
                                <MenuItem key={state.abbreviation} value={state.abbreviation} >
                                  {state.abbreviation}
                                </MenuItem>
                              ))}
                            </Field>
                          </FormControl>
                        </div>
                        <div style={{ marginRight: 5 }}>
                          <Field
                            name="primaryContactZip"
                            component={renderTextField}
                            floatingLabelText="Zip Code"
                            type="text"
                          />
                        </div>
                      </div>
                      <div>
                        <Field
                          name="primaryContactPhone"
                          component={renderTextField}
                          floatingLabelText="Phone Number"
                          type="text"
                        />
                      </div>
                      <div>
                        <Field
                          name="primaryContactEmail"
                          component={renderTextField}
                          floatingLabelText="Email Address"
                          type="email"
                        />
                      </div>
                      <div>
                        <Field
                          name="primaryContactAboutUs"
                          component={renderTextField}
                          floatingLabelStyle={{ display: 'flex' }}
                          floatingLabelText="About Primary Contact"
                          type="text"
                          multiLine
                          rows={3}
                        />
                      </div>
                      <div style={{ marginTop: 10 }}>
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
            <Card className="profile-card">
              <CardTitle style={{ textAlign: 'left' }} title="About Us" />
              <form onSubmit={handleSubmit(values => updateVendorProfile(values, vendorId))}>
                <div>
                  <div>
                    <Field
                      name="aboutUs"
                      component={renderTextField}
                      floatingLabelStyle={{ display: 'flex' }}
                      floatingLabelText="About Us"
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
            <Card className="profile-card" >
              <CardTitle title="Links" style={{ textAlign: 'left' }} />
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingTop: 5 }}>
                {vendorLinks.map((link, i) => (
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
                          editVendorProfileLink(vendorLinks, i, values.title, values.url, vendorId)
                        }}
                        onDelete={() => {
                          removeVendorProfileLink(vendorLinks, i, vendorId)
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
                    <AddLinkForm userLinks={vendorLinks} onSubmit={values => addLinkToVendorProfile(vendorLinks, values.title, values.url, vendorId)} />
                  </Dialog>
                </RaisedButton>
              </div>
            </Card>
          </div>

          <div style={{ paddingTop: 30 }}>
            <Card className="profile-card" >
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
                        editVendorVideo(video, values.title, values.url, vendorId)
                      }}
                      onDelete={() => {
                        removeVendorVideo(video, videoType, vendorId)
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
                        <AddVideoForm onSubmit={values => addYoutubeToVendorProfile(video, values.title, values.url, vendorId)} />
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
                        <AddVideoForm onSubmit={values => addVimeoToVendorProfile(video, values.title, values.url, vendorId)} />
                      </Dialog>
                    </RaisedButton>
                  </div>
                </div>)
              }
            </Card>
          </div>

        </div>
      )
    }
    return null
  }
}

EditVendorProfile.propTypes = {
  vendorProfile: PropTypes.shape({
    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string
  }),
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  vendorId: PropTypes.string.isRequired,
  remoteSubmitForm: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  editVendorProfileLink: PropTypes.func.isRequired,
  removeVendorProfileLink: PropTypes.func.isRequired,
  addLinkToVendorProfile: PropTypes.func.isRequired,
  addYoutubeToVendorProfile: PropTypes.func.isRequired,
  addVimeoToVendorProfile: PropTypes.func.isRequired,
  removeVendorVideo: PropTypes.func.isRequired,
  editVendorVideo: PropTypes.func.isRequired,
  updateVendorProfile: PropTypes.func.isRequired,
  setVendorPublic: PropTypes.func.isRequired
}

EditVendorProfile.defaultProps = {
  vendorProfile: undefined
}

const EditVendorProfileFormEnriched = reduxForm({
  form: 'UpdateVendorProfile',
  enableReinitialize: true
})(EditVendorProfile)

export default EditVendorProfileFormEnriched
