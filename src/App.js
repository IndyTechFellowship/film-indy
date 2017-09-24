import React from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import { get } from 'lodash'

import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import { Card } from 'material-ui/Card'
import TextField from 'material-ui/TextField'

import SearchIcon from 'material-ui/svg-icons/action/search'

import Home from './containers/home'
import Login from './containers/login/login'
import Dashboard from './containers/dashboard/dashboard'
import SignUp from './containers/signUp'

import './App.css'
import Logo from './film-indy-logo.png'

const App = (props) => {
    const { profile } = props
    const photoURL = get(profile, 'photoURL', '')
    return (
        <div className="App">
            <AppBar
                iconElementLeft={
                    <div>
                        <img src={Logo} className="logo" alt="Film Indy Logo" />
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
                iconElementRight={<Avatar className="accountIcon" src={photoURL} size={60} />}
                zDepth={2}
            />
            <Route exact path="/" component={Home} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
        </div>
    )
}

const wrappedApp = firebaseConnect()(App)

export default connect(
    state => ({ firebase: state.firebase, profile: state.firebase.profile }),
    {},
)(wrappedApp)