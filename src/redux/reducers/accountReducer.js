import { SIGN_IN } from '../actions/types/accountActionTypes'
import { SIGN_UP } from '../actions/types/accountActionTypes'

const initalState = {

};

export default (state = initalState, action) => {
  switch (action.type) {
    case `${SIGN_IN}_ERROR`:
      return {
        ...state,
        signInError: action.payload,
      };
    case `${SIGN_UP}_ERROR`:
      return {
        ...state,
        signUpError: action.payload,
    };
    default:
      return state
  }
}
