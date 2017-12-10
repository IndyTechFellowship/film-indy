import React from 'react'
import { Route, Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import { InstantSearch, Index } from 'react-instantsearch/dom'
import { connectAutoComplete } from 'react-instantsearch/connectors'
import Autosuggest from 'react-autosuggest'
import QueryString from 'query-string'
import 'react-instantsearch-theme-algolia/style.css'

// Material UI Components
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import { Card } from 'material-ui/Card'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Popover from 'material-ui/Popover'
import Snackbar from 'material-ui/Snackbar'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { Tabs, Tab } from 'material-ui/Tabs'

// Material UI SVG Icons
import SearchIcon from 'material-ui/svg-icons/action/search'
import AccountCircle from 'material-ui/svg-icons/action/account-circle'
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app'
import EditIcon from 'material-ui/svg-icons/content/create'
import ViewIcon from 'material-ui/svg-icons/image/remove-red-eye'
import ArrowIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down'

// Page components
import Home from './containers/home'
import Account from './containers/account/account'
import EditProfile from './containers/profile/EditProfile'
import ViewProfile from './containers/profile/ViewProfile'
import VendorProfile from './containers/vendorProfile/VendorProfile'
import Search from './containers/search/Search'
import ForgotPassword from './containers/forgotPassword/forgotPassword'
import SignUpForm from './presentation/signup/SignUpForm'
import SignInForm from './presentation/login/SignInForm'

// Style and images
import './App.css'

import Logo from './film-indy-logo.png'

import * as accountActions from './redux/actions/creators/accountActions'

const styles = {
  container: {
    flexGrow: 1,
    position: 'relative',
    paddingTop: 3
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: 1,
    marginBottom: 1 * 3,
    left: 0,
    right: 0
  },
  sectionTitle: {
    backgroundColor: '#fff'
  },
  suggestion: {
    display: 'block'
  },
  suggestionHiglighted: {
    opacity: 1
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    backgroundColor: '#fff'
  },
  textField: {
    width: '100%'
  }
}

const ALGOLIA_SEARCH_KEY = process.env.REACT_APP_ALGOLIA_SEARCH_KEY
const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID

const AutoCompleteBar = connectAutoComplete(
  ({ hits, currentRefinement, refine, onUpdateInput, onSuggestionClicked, onEnterHit }) => {
    const subsetHits = hits.map(hit => ({ ...hit, hits: hit.hits.slice(0, 3) }))
    return (
      <Autosuggest
        theme={styles}
        suggestions={subsetHits}
        multiSection
        onSuggestionsFetchRequested={({ value }) => refine(value)}
        onSuggestionsClearRequested={() => refine('')}
        getSuggestionValue={hit => hit.roleName}
        onSuggestionSelected={(event, { suggestion, sectionIndex }) => {
          onSuggestionClicked(suggestion, sectionIndex)
        }}
        renderInputComponent={(inputProps) => {
          const onBlur = (event) => {
            inputProps.onBlur()
            refine(currentRefinement)
          }
          const moreInputProps = { ...inputProps, onBlur }
          return (
            <TextField
              id="autocomplete-text-field"
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  onEnterHit()
                }
              }}
              {...moreInputProps}
            />
          )
        }}
        renderSuggestion={(hit) => {
          if (hit.roleName) {
            return (
              <MenuItem
                style={{ whiteSpace: 'inital' }}
              >
                {hit.roleName}
              </MenuItem>
            )
          } else if (hit.firstName || hit.lastName) {
            return (
              <MenuItem style={{ whiteSpace: 'inital' }}>
                {`${get(hit, 'firstName', '')} ${get(hit, 'lastName', '')}`}
              </MenuItem>
            )
          } else if (hit.vendorName) {
            return (
              <MenuItem style={{ whiteSpace: 'inital' }}>
                {`${hit.vendorName}`}
              </MenuItem>
            )
          }
          return (null)
        }}
        renderSectionTitle={(section) => {
          if (section.hits.length > 0) {
            if (section.index === 'roles') {
              return (
                <strong>Roles</strong>
              )
            } else if (section.index === 'names') {
              return (
                <strong>Crew</strong>
              )
            } else if (section.index === 'vendors') {
              return (<strong>Vendors</strong>)
            }
          }
          return ''
        }}
        renderSuggestionsContainer={({ containerProps, children }) => (
          <Card {...containerProps}>
            {children}
          </Card>
        )}
        getSectionSuggestions={section => section.hits}
        inputProps={{
          placeholder: 'Search our database....',
          style: {
            height: 42,
            width: 256
          },
          value: currentRefinement,
          onChange: (event) => {
            onUpdateInput(event.target.value)
          }
        }}
      />
    )
  })

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      signedOut: false
    }
    this.handleAvatarTouch = this.handleAvatarTouch.bind(this)
    this.handleDropdownClose = this.handleDropdownClose.bind(this)
    this.handleSignOutClose = this.handleSignOutClose.bind(this)
    this.signOutMessage = this.signOutMessage.bind(this)
  }

  handleAvatarTouch(event) {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
      signedOut: false
    })
  }

  handleDropdownClose() {
    this.setState({
      open: false
    })
  }

  signOutMessage() {
    this.setState({
      signedOut: true,
      open: false
    })
  }

  handleSignOutClose() {
    this.setState({
      signedOut: false
    })
  }

  render() {
    const { cancelSignInUpForm, account, profile, auth, firebase, history, signUp, signUpWithGoogle, signUpWithFacebook, submitSignUp, signIn, signInWithFacebook, signInWithGoogle, submitSignIn, location } = this.props
    const photoURL = get(profile, 'photoURL', '')
    const uid = get(auth, 'uid')
    const parsed = QueryString.parse(location.search)
    const showOnly = get(parsed, 'show', 'all')
    const appBarStyle = location.pathname === '/search' ? { boxShadow: 'none' } : {}
    return (
      <div className="App">
        <AppBar
          style={{ ...appBarStyle }}
          iconElementLeft={
            <div className="dhjkaf"style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Link to="/"><img src={Logo} className="logo" alt="Film Indy Logo" /></Link>
                { location.pathname !== '/' &&
                <Card className="menuSearchCard" style={{ width: 420 }}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <SearchIcon className="searchIcon" />
                    <InstantSearch
                      appId={ALGOLIA_APP_ID}
                      apiKey={ALGOLIA_SEARCH_KEY}
                      indexName="roles"
                    >
                      <Index indexName="names" />
                      <Index indexName="vendors" />
                      <AutoCompleteBar
                        onUpdateInput={query => this.searchQuery = query}
                        onEnterHit={() => {
                          if (this.searchQuery) {
                            history.push({ pathname: '/search', search: `?query=${encodeURIComponent(this.searchQuery)}&show=all` })
                          }
                        }}
                        onSuggestionClicked={(suggestion, index) => {
                          if (index === 0) {
                            history.push({ pathname: '/search', search: `?query=${encodeURIComponent(suggestion.roleName)}&show=all` })
                          } else if (index === 1) {
                            history.push({ pathname: '/profile', search: `?query=${encodeURIComponent(suggestion.objectID)}` })
                          }
                        }}
                      />
                    </InstantSearch>
                    <RaisedButton
                      label="Search"
                      labelColor="#fff"
                      backgroundColor={'#38b5e6'}
                      style={{ height: 30, marginTop: 10, marginLeft: 30 }}
                      onClick={() => {
                        if (this.searchQuery) {
                          history.push({ pathname: '/search', search: `?query=${encodeURIComponent(this.searchQuery)}&show=all` })
                        }
                      }}
                    />
                  </div>
                </Card>
                }
              </div>
              {location.pathname === '/search' ?
                (<Tabs tabItemContainerStyle={{ width: '55%' }} style={{ marginLeft: 200 }} value={showOnly}>
                  <Tab
                    style={{ zIndex: 0 }}
                    label="All"
                    value="all"
                    onActive={() => {
                      const query = get(parsed, 'query', ' ')
                      history.push({ pathname: '/search', search: `?query=${encodeURIComponent(query)}&show=all` })
                    }}
                  />
                  <Tab
                    style={{ zIndex: 0 }}
                    label="Crew"
                    value="crew"
                    onActive={() => {
                      const query = get(parsed, 'query', ' ')
                      history.push({ pathname: '/search', search: `?query=${encodeURIComponent(query)}&show=crew` })
                    }}
                  />
                  <Tab
                    style={{ zIndex: 0 }}
                    label="Vendors"
                    value="vendors"
                    onActive={() => {
                      const query = get(parsed, 'query', ' ')
                      history.push({ pathname: '/search', search: `?query=${encodeURIComponent(query)}&show=vendors` })
                    }}
                  />
                </Tabs>) : null}
            </div>
          }
          iconElementRight={uid ? (
            <div className="avatar-wrapper" onClick={this.handleAvatarTouch}>
              <Avatar className="accountIcon avatar" src={photoURL} size={60} />
              <ArrowIcon className="arrowIcon" />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 35 }}>
              <SignUpForm
                onSubmit={(values) => {
                  signUp(values.firstName, values.lastName, values.photoFile, values.email, values.password)
                }}
                account={account}
                cancelSignInUpForm={cancelSignInUpForm}
                signUpWithGoogle={signUpWithGoogle}
                signUpWithFacebook={signUpWithFacebook}
                sendSubmit={submitSignUp}
              />
              <SignInForm
                onSubmit={(values) => {
                  signIn(values.email, values.password)
                }}
                account={account}
                cancelSignInUpForm={cancelSignInUpForm}
                signInWithFacebook={signInWithFacebook}
                signInWithGoogle={signInWithGoogle}
                sendSubmit={submitSignIn}
              />
            </div>
          )}
          zDepth={2}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleDropdownClose}
        >
          <Menu>
            { uid ? ( // renders dropdown items depending on if logged in
              <div>
                <Link to="/account"><MenuItem primaryText="Account Settings" leftIcon={<AccountCircle />} /></Link>
                <Link to="/profile/edit"><MenuItem primaryText="Edit Profile" leftIcon={<EditIcon />} /></Link>
                <Link to={{ pathname: '/profile', search: `?query=${uid}` }}><MenuItem primaryText="View Profile" leftIcon={<ViewIcon />} /></Link>
                <MenuItem primaryText="Log Out" leftIcon={<LogoutIcon />} onClick={(e) => { firebase.logout(); this.signOutMessage() }} />
              </div>
            ) : (
              <div />
            )}
          </Menu>
        </Popover>
        <Snackbar
          bodyStyle={{ backgroundColor: '#00C853' }}
          open={this.state.signedOut}
          message={'Successfully Logged Out.'}
          autoHideDuration={4000}
          onRequestClose={this.handleSignOutClose}
        />
        <Route exact path="/" component={Home} />
        <Route exact path="/account" component={Account} />
        <Route path="/search" component={Search} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <Route exact path="/profile/edit" component={EditProfile} />
        <Route exact path="/profile" component={ViewProfile} />
        <Route eact path="/vendor/:vendorId" component={VendorProfile} />
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
  cancelSignInUpForm: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  signUpWithGoogle: PropTypes.func.isRequired,
  signUpWithFacebook: PropTypes.func.isRequired,
  submitSignUp: PropTypes.func.isRequired,
  signIn: PropTypes.func.isRequired,
  signInWithFacebook: PropTypes.func.isRequired,
  signInWithGoogle: PropTypes.func.isRequired,
  submitSignIn: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
}

const wrappedApp = firebaseConnect()(App)

export default withRouter(connect(
  state => ({ account: state.account, firebase: state.firebase, profile: state.firebase.profile, auth: state.firebase.auth }),
  { ...accountActions },
)(wrappedApp))
