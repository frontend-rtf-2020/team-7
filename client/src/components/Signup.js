import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { sendemail, signup } from "../actions/session";

const mapStateToProps = ({ errors }) => ({
  errors,
});

const mapDispatchToProps = (dispatch) => ({
  sendemail: (user) => dispatch(sendemail(user)),
  signup: (user) => dispatch(signup(user)),
});

const Signup = ({ errors, signup, sendemail }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      email: e.target.email.value,
      username: e.target.username.value,
      password: e.target.password.value,
      code: e.target.code.value,
    };
    signup(user);
    sendemail(user);
  };

  return (
    <div className="box">
      <form onSubmit={handleSubmit}>
        <span className="text-center">signup</span>
        <span className="eror-text">{errors}</span>
        <div className="input-container">
          <input type="email" name="email" />
          <label>Email:</label>
        </div>
        <div className="input-container">
          <input type="text" name="username" />
          <label>Username:</label>
        </div>
        <div className="input-container">
          <input type="password" name="password" />
          <label>Password:</label>
        </div>
        <input type="submit" value="Отправить код" />
        <br></br>
        <br></br>
        <br></br>
        <div className="input-container">
          <input type="text" name="code" />
          <label>Проверочный код:</label>
        </div>
        <input type="submit" value="Зарегистрироваться" />
      </form>
      <br></br>
      <label className="label-text">Уже существует аккаунт ?</label>
      <Link to="/login">Авторизоваться</Link>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
