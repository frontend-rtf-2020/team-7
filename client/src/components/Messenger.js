import React, { useState } from "react";
import { connect } from "react-redux";
import {
  logout,
  saveMessage,
  chatList,
  messageList,
  allUsers,
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
}) => {
  const [sendingToCustomer, setSendingToCustomer] = useState("");

  const handleToUserInputChanges = (e) => {
    setSendingToCustomer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mes = {
      fromUser: session.username,
      toUser: e.target.toUser.value,
      message: e.target.message.value,
    };
    saveMessage(mes);
    e.target.message.value = "";
  };

  function updateDialogs() {
    const currentUser = {
      fromUser: session.username,
    };
    chatList(currentUser);
  }
  function Dialogs() {
    const listDialogs = usersList.map((user) => <ul key={user}>{user}</ul>);
    return <div>{listDialogs}</div>;
  }

  function updateMessages() {
    const dialog = {
      fromUser: session.username,
      toUser: sendingToCustomer,
    };
    messageList(dialog);
  }
  function Messages() {
    const listMessages = chatShow.map((message) => (
      <ul>{message}</ul>
    ));
    return <div>{listMessages}</div>;
  }

  function updateListOfUsers() {
    const currentUser = {
      username: session.username,
    };
    allUsers(currentUser);
  }
  function ListOfUsers() {
    const listAllUsers = getAllUsers.map((user) => (
      <option key={user}>{user}</option>
    ));
    return <select>{listAllUsers}</select>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="inline">{session.username}</h1>
      <button onClick={logout}>Logout</button>
      <br />
      <ListOfUsers />
      <button onClick={updateListOfUsers}>
        Обновить список всех пользователей
      </button>
      <input
        type="text"
        name="toUser"
        value={sendingToCustomer}
        onChange={handleToUserInputChanges}
        placeholder="Кому отправить"
      />
      <Dialogs />
      <button onClick={updateDialogs}>
          Обновить список активных диалогов
      </button>
      <br />
      <Messages />
      <button onClick={updateMessages}>
          Обновить список сообщений
      </button>
      <input type="text" name="message" placeholder="Сообщение" />
      <br />
      <input type="submit" value="Отправить сообщение" />
    </form>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);
