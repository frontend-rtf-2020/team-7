import React from "react";
import "../styled/hrefs.css";
import "../styled/styles.css";
import { Link } from "react-router-dom";

export default () => (
  <>
    <div className="box">
      <span className="text-center">Начальная страница</span>
      <div className="home">
        <Link className="input-container" to="/signup">
          Регистрация
        </Link>
        <br />
        <Link className="input-container" to="/login">
          Авторизация
        </Link>
        <br />
        <Link className="input-container" to="/messenger">
          Перейти к чату
        </Link>
      </div>
    </div>
  </>
);
