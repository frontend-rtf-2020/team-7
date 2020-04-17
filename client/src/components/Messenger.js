import React from "react";
import { connect } from "react-redux";
import { logout } from "../actions/session";

const mapStateToProps = ({ session }) => ({
  session
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

const Messenger = ({ logout, session }) => (
  <>
    <h1>{session.username}</h1>
    <p>Вы авторизованы</p>
    <button onClick={logout}>Logout</button>
  </>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messenger);
