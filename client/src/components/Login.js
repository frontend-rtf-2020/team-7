import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../actions/session";
import "../styled/form.css";

const mapStateToProps = ({ errors }) => ({
  errors,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(login(user)),
});

const Login = ({ errors, login }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      emailOrUsername: e.target.emailOrUsername.value,
      password: e.target.password.value,
    };
    login(user);
  };

  return (
    <div className="box">
      <form onSubmit={handleSubmit}>
        <span className="text-center">авторизация</span>
        <span className="error-text">{errors}</span>
        <div className="input-container">
          <input type="text" name="emailOrUsername" />
          <label>Email или username:</label>
        </div>
        <div className="input-container">
          <input type="password" name="password" />
          <label>Password:</label>
        </div>
        <input type="submit" value="Авторизоваться" />
      </form>
      <br></br>
      <label className="label-text">
        Впервые у нас?
        <Link to="/signup">Зарегистрироваться</Link>
      </label>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
