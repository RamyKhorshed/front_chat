import * as types from "../actions/types";
const initialState = { currentUser: {} };

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_CURRENT_USER:
      const { id, username } = action.user;
      return { ...state, currentUser: { id, username } };
    case types.LOGOUT_USER:
      return { ...state, currentUser: {} };
    default:
      return state;
  }
};
