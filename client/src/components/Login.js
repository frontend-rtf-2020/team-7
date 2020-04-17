import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../actions/session";
import "../styled/form.css"

const mapStateToProps = ({ errors }) => ({
  errors
});

const mapDispatchToProps = dispatch => ({
  login: user => dispatch(login(user))
});

const Login = ({ errors, login }) => {

  const handleSubmit = e => {
    e.preventDefault();
    const user = {
      emailOrUsername: e.target[0].value,
      password: e.target[1].value,
    };

    login(user);
  }

  return (
      <div className="box">
        <form onSubmit={handleSubmit}>
          <span className="text-center">login</span>
          <span className="eror-text">{errors}</span>
          <div className="input-container">
            <input type="text" name="emailOrUsername"/>
            <label>Email или username:</label>
          </div>
          <div className="input-container">
            <input type="password" name="password"/>
            <label>Password:</label>
          </div>
          <input type="submit" value="Авторизоваться"/>
        </form>
        <br></br>
        <label className="label-text">Еще не создали аккаунт ?</label>
        <Link to="/signup">Зарегистрироваться</Link>
      </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);