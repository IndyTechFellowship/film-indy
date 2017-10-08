import React from 'react'
import { Route, Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import * as accountActions from './redux/actions/creators/accountActions'

// Material UI Components
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import { Card } from 'material-ui/Card'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Popover from 'material-ui/Popover'
import Snackbar from 'material-ui/Snackbar'
import TextField from 'material-ui/TextField'

// Material UI SVG Icons
import SearchIcon from 'material-ui/svg-icons/action/search'
import AccountCircle from 'material-ui/svg-icons/action/account-circle'
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app'
import CreateIcon from 'material-ui/svg-icons/social/person-add'
import EditIcon from 'material-ui/svg-icons/content/create'

// Page components
import Home from './containers/home'
import Login from './containers/login/login'
import SignUp from './containers/signUp'
import Account from './containers/account/account'
import ForgotPassword from './containers/forgotPassword/forgotPassword'
import EditProfile from './containers/profile/EditProfile'

// Style and images
import './App.css'

import Logo from './film-indy-logo.png'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      signedOut: false
    }
    this.handleTouchTap = this.handleTouchTap.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }

  handleTouchTap(event) {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
      signedOut: false
    })
  }

  handleRequestClose() {
    this.setState({
      open: false
    })
  }

  signOutMessage() {
    this.setState({
      signedOut: true
    })
  }

  render() {
    const { profile, auth, signOut } = this.props
    const photoURL = get(profile, 'photoURL', '')
    const uid = get(auth, 'uid')
    return (
      <div className="App">
        <AppBar
          iconElementLeft={
            <div>
              <Link to="/"><img src={Logo} className="logo" alt="Film Indy Logo" /></Link>
              <Card className="searchCard" style={{ width: 400 }}>
                <SearchIcon className="searchIcon" />
                <TextField
                  className="searchField"
                  hintText="Search FilmIndy"
                  underlineFocusStyle={{ borderColor: '#38b5e6' }}
                  floatingLabelFocusStyle={{ color: '#38b5e6' }}
                />
              </Card>
            </div>
          }
          iconElementRight={<Avatar className="accountIcon" src={photoURL} size={60} onClick={this.handleTouchTap} />}
          zDepth={2}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            { uid ? ( // renders dropdown items depending on if logged in
              <div>
                <Link to="/account"><MenuItem primaryText="Account Settings" leftIcon={<AccountCircle />} /></Link>
                <Link to="/profile/edit"><MenuItem primaryText="Edit Profile" leftIcon={<EditIcon />} /></Link>
                <MenuItem primaryText="Log Out" leftIcon={<LogoutIcon />} onClick={(e) => { signOut(); this.handleRequestClose(); this.signOutMessage() }} />
              </div>
            ) : (
              <div>
                <Link to="/login"><MenuItem primaryText="Log In" leftIcon={<AccountCircle />} /></Link>
                <Link to="/signup"><MenuItem primaryText="Create Account" leftIcon={<CreateIcon />} /></Link>
              </div>
            )}
          </Menu>
        </Popover>
        <Snackbar
          bodyStyle={{ backgroundColor: '#F44336' }}
          open={this.state.signedOut}
          message={'Successfully Logged Out.'}
          autoHideDuration={4000}
        />
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/account" component={Account} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <Route exact path="/profile/edit" component={EditProfile} />
      </div>
    )
  }
}

App.propTypes = {
  profile: PropTypes.shape({
    photoURL: PropTypes.string
  }).isRequired,
  auth: PropTypes.shape({
    uid: PropTypes.string
  }).isRequired,
  signOut: PropTypes.func.isRequired
}

const wrappedApp = firebaseConnect()(App)

export default withRouter(connect(
  state => ({ firebase: state.firebase, profile: state.firebase.profile, auth: state.firebase.auth }),
  { ...accountActions },
)(wrappedApp))
