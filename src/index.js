import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import App from "./App";

const initialState = { currentUser: {} };

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      const { id, username } = action.user;
      return { ...state, currentUser: { id, username } };
    case "LOGOUT_USER":
      return { ...state, currentUser: {} };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  auth: authReducer
});

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(reduxThunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

const Root = ({ store }) => {
  return (
    <Router>
      <Provider store={store}>
        <Route path="/" component={App} />
      </Provider>
    </Router>
  );
};

ReactDOM.render(<Root store={store} />, document.getElementById("root"));
