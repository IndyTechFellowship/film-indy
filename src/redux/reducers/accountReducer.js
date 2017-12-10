import {
  SIGN_IN, SIGN_UP, SIGN_OUT, SEND_PASSWORD_RESET_EMAIL, RESET_PASSWORD
} from '../actions/types/accountActionTypes'

const initalState = {

}

export default (state = initalState, action) => {
  switch (action.type) {
    case `${SIGN_IN}_ERROR`:
      return {
        ...state,
        signInError: action.payload
      }
    case `${SIGN_UP}_ERROR`:
      return {
        ...state,
        signUpError: action.payload
      }
    case `${SEND_PASSWORD_RESET_EMAIL}_ERROR`:
      return {
        ...state,
        sendPasswordResetEmailError: action.payload
      }
    case `${SIGN_OUT}_ERROR`:
      return {
        ...state,
        signOutError: action.payload
      }
    case `${RESET_PASSWORD}_ERROR`:
      return {
        ...state,
        resetPasswordError: action.payload
      }
    case 'SIGN_IN_GOOGLE_ERROR':
      return {
        ...state,
        socialSignInError: action.payload
      }
    case 'SIGN_UP_GOOGLE_ERROR':
      return {
        ...state,
        socialSignInError: action.payload
      }
    case 'SIGN_IN_FACEBOOK_ERROR':
      return {
        ...state,
        socialSignInError: action.payload
      }
    case 'SIGN_UP_FACEBOOK_ERROR':
      return {
        ...state,
        socialSignInError: action.payload
      }
    case 'Cancel_Sign_In_Up_Form':
      return initalState
    default:
      return state
  }
}
