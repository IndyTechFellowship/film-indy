import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as exampleActions from '../redux/actions/creators/exampleActions'
import * as accountActions from '../redux/actions/creators/accountActions'
import SignUpHome from '../presentation/signup/signUpHome'

class signUp extends React.Component {
  render() {
    return (
      <SignUpHome {...this.props} />
    )
  }
}

signUp.propTypes = {
  signUp: PropTypes.func.isRequired,
  firebase: PropTypes.shape({
    uploadFile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
  }).isRequired
}
// signUp.propTypes = {
//   signUp: PropTypes.func.isRequired,
//
// };

export default withRouter(connect(
  state => ({ home: state.home, account: state.account }),
  { ...exampleActions, ...accountActions },
)(signUp))
