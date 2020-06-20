import React, { useState } from "react";
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
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const sendCode = (e) => {
    e.preventDefault();
    const user = {
      email: email,
      username: username,
      password: password,
    };
    sendemail(user);
  };

  const signUp = (e) => {
    e.preventDefault();
    const user = {
      email: email,
      username: username,
      password: password,
      code: code,
    };
    signup(user);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeCode = (e) => {
    setCode(e.target.value);
  };

  return (
    <div className="box">
      <form>
        <span className="text-center">регистрация</span>
        <div className="input-container">
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChangeEmail}
          />
          <label>Email:</label>
        </div>
        <div className="input-container">
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChangeUsername}
          />
          <label>Username:</label>
        </div>
        <div className="input-container">
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChangePassword}
          />
          <label>Password:</label>
        </div>
        <input type="submit" value="Отправить код" onClick={sendCode} />
        <span className="error-text">{errors}</span>
        <div className="input-container">
          <input
            type="text"
            name="code"
            value={code}
            onChange={handleChangeCode}
          />
          <label>Проверочный код:</label>
        </div>
        <input type="submit" value="Зарегистрироваться" onClick={signUp} />
      </form>
      <br />
      <label className="label-text">
        Уже существует аккаунт?
        <Link to="/login">Авторизоваться</Link>
      </label>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
