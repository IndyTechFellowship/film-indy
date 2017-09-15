import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as exampleActions from '../redux/actions/creators/exampleActions'
import * as accountActions from '../redux/actions/creators/accountActions'
import HomePage from '../presentation/home/homePage'

class Home extends React.Component {
  render() {
    return (
      <HomePage {...this.props} />
    )
  }
}

Home.propTypes = {
  signIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired
};

export default withRouter(connect(
  state => ({ home: state.home, account: state.account }),
  { ...exampleActions, ...accountActions },
)(Home))
