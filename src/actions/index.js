import { adapter } from "../services";

export const fetchUser = () => dispatch => {
  dispatch({ type: "ASYNC_START" });
  adapter.auth.getCurrentUser().then(user => {
    dispatch({ type: "SET_CURRENT_USER", user });
  });
};

export const loginUser = (username, password, history) => dispatch => {
  dispatch({ type: "ASYNC_START" });
  console.log("Actions are being sent:", username, password);

  adapter.auth.login({ username, password }).then(user => {
    localStorage.setItem("token", user.jwt);
    dispatch({ type: "SET_CURRENT_USER", user });
    history.push("/chat");
  });
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  return { type: "LOGOUT_USER" };
};