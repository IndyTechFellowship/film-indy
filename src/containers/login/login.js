import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as exampleActions from '../../redux/actions/creators/exampleActions'
import * as accountActions from '../../redux/actions/creators/accountActions'
import LoginPage from '../../presentation/login/loginPage'

class Login extends React.Component {
  render() {
    return (
      <LoginPage {...this.props} />
    )
  }
}

Login.propTypes = {
  signIn: PropTypes.func.isRequired,
};

export default withRouter(connect(
  state => ({ home: state.home, account: state.account }),
  { ...exampleActions, ...accountActions },
)(Login))
