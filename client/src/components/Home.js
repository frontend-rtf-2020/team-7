import React from "react";
import "../styled/hrefs.css";
import "../styled/styles.css";

export default () => (
  <>
    <h1>Начальная страница</h1>
    <a className="btn btn-primary" href={"/signup"}>
      Регистрация
    </a>
    <a className="btn btn-primary" href={"/login"}>
      Авторизация
    </a>
    <a className="btn btn-primary" href={"/messenger"}>
      Перейти к чату
    </a>
  </>
);
