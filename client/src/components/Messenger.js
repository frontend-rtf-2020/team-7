import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  logout,
  saveMessage,
  chatList,
  messageList,
  allUsers,
  deleteDialog,
} from "../actions/session";
import "../styled/chat.css";

const mapStateToProps = ({ session, usersList, chatShow, getAllUsers }) => ({
  session,
  usersList,
  chatShow,
  getAllUsers,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  saveMessage: (mes) => dispatch(saveMessage(mes)),
  chatList: (user) => dispatch(chatList(user)),
  messageList: (user) => dispatch(messageList(user)),
  allUsers: (user) => dispatch(allUsers(user)),
  deleteDialog: (user) => dispatch(deleteDialog(user)),
});

const Messenger = ({
                     logout,
                     session,
                     saveMessage,
                     chatList,
                     usersList,
                     messageList,
                     chatShow,
                     allUsers,
                     getAllUsers,
                     deleteDialog,
                   }) => {
  const [sendingToCustomer, setSendingToCustomer] = useState("");
  const [tempForSendToCustomer, setTempForSendToCustomer] = useState(""); //переменная для обновления поля
  const [searchField, setSearchField] = useState("");
  const [tempForSearchField, setTempForSearchField] = useState(""); //переменная для обновления поля
  const [listOfAllUsers, setListOfAllUsers] = useState([]);

  const handleSearch = (e) => {
    setSearchField(e.target.value);
  };

  const handleChange = (e) => {
    setSendingToCustomer(e.target.value);
  };

  //отключение кнопки enter
  const pressEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mes = {
      fromUser: session.username,
      toUser: sendingToCustomer,
      message: e.target.message.value,
    };
    saveMessage(mes);
    e.target.message.value = "";
  };

  //удаление диалога
  function handleDeleteDialog() {
    const dialog = {
      fromUser: session.username,
      toUser: sendingToCustomer,
    };
    deleteDialog(dialog);
  };

  //список активных диалогов
  function updateDialogs() {
    const currentUser = {
      fromUser: session.username,
    };
    chatList(currentUser);
  }

  function Dialogs() {
    return usersOutput(usersList);
  }

  //все пользователи чата
  function updateListOfUsers() {
    const currentUser = {
      username: session.username,
    };
    allUsers(currentUser);
  }

  function ListOfUsers() {
    return usersOutput(listOfAllUsers);
  }

  function usersOutput(element) {
    const listAllUsers = element.map((user) => {
      if (user === sendingToCustomer)
        return (
          <ul key={user}>
            <button className="current-user-btn" key={user} value={user}>
              {user}
            </button>
          </ul>
        );
      else
        return (
          <ul key={user}>
            <button className="user-btn" key={user} value={user}>
              {user}
            </button>
          </ul>
        );
    });
    return <div onClick={handleChange}>{listAllUsers}</div>;
  }

  //список сообщений
  function updateMessages() {
    const dialog = {
      fromUser: session.username,
      toUser: sendingToCustomer,
    };
    messageList(dialog);
  }

  function Messages() {
    const listMessages = chatShow.map((message) => (
      <ul key={Math.random()}>{message}</ul>
    ));
    return <div>{listMessages}</div>;
  }

  //начальное обновление блоков
  if (getAllUsers.length === 0) {
    setTimeout(() => {
      updateDialogs() || updateListOfUsers();
    }, 100);
  }

  //обновление чата при выборе диалога
  if (tempForSendToCustomer !== sendingToCustomer) {
    updateMessages();
    setTempForSendToCustomer(sendingToCustomer);
  }

  //обновление поиска при вводе
  if (tempForSearchField !== searchField) {
    let list = [];
    if (searchField !== "") {
      for (let i = 0; i < getAllUsers.length; i++) {
        if (getAllUsers[i].toLowerCase().includes(searchField.toLowerCase()))
          list.push(getAllUsers[i]);
      }
      setListOfAllUsers(list);
    } else setListOfAllUsers(list);
    setTempForSearchField(searchField);
  }

  //автоматическое обновление блоков каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      updateListOfUsers() || updateDialogs() || updateMessages();
    }, 1000);
    return () => clearInterval(interval);
  });

  if (sendingToCustomer === "") {
    return (
      <form>
        <h1 className="inline">{session.username}</h1>
        <button onClick={logout}>Logout</button>
        <br />
        <div className="inline-block">
          <div className="usersForm">
            <div className="list-of-users">
              <h3>Поиск пользователей чата</h3>
              <input type="text" onChange={handleSearch} />
              <ListOfUsers />
            </div>
            <h3>Активные диалоги</h3>
            <Dialogs />
          </div>
          <div className="blankChatForm">
            <h3>Выберите, кому хотели бы написать</h3>
          </div>
        </div>
      </form>
    );
  } else {
    return (
      <form onSubmit={handleSubmit}>
        <h1 className="inline">{session.username}</h1>
        <button onClick={logout}>Logout</button>
        <br />
        <div className="inline-block">
          <div className="usersForm">
            <div className="list-of-users">
              <h3>Поиск пользователей чата</h3>
              <input type="text" onChange={handleSearch} />
              <ListOfUsers />
            </div>
            <h3>Активные диалоги</h3>
            <Dialogs />
          </div>
          <div className="chatForm">
            <h2>{sendingToCustomer}<button onClick={handleDeleteDialog}>Удалить диалог</button></h2>
            <div className="messagesForm">
              <Messages />
            </div>
            <br />
            <div className="msg">
              <input
                className="msginput"
                type="text"
                name="message"
                placeholder="Сообщение"
                onKeyPress={pressEnter}
              />
              <input className="msgbtn" type="submit" value="" />
            </div>
          </div>
        </div>
      </form>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);
