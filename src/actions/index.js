import { adapter } from "../services";
import * as types from "./types";

export const fetchUser = () => dispatch => {
  dispatch({ type: types.ASYNC_START });
  adapter.auth.getCurrentUser().then(user => {
    console.log(user);
    dispatch({ type: types.SET_CURRENT_USER, user });
  });
};

export const loginUser = (username, password, history) => dispatch => {
  dispatch({ type: types.ASYNC_START });
  console.log("Actions are being sent:", username, password);

  adapter.auth.login({ username, password }).then(user => {
    localStorage.setItem("token", user.jwt);
    dispatch({ type: types.SET_CURRENT_USER, user });
    history.push("/chatroom");
  });
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  return { type: types.LOGOUT_USER };
};
