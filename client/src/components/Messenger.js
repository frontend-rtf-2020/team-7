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
  const [messageField, setMessageField] = useState("");
  const [searchField, setSearchField] = useState("");
  const [tempForSearchField, setTempForSearchField] = useState(""); //переменная для обновления поля
  const [listOfAllUsers, setListOfAllUsers] = useState([]); //никнеймы подходящие под поле поиска
  const [room, setRoom] = useState(""); //групповой чат
  const [openCreating, setOpenCreating] = useState(""); //переменная для создания группового чата
  const [groupChat, setGroupChat] = useState([]); //переменная для выбранных пользователей группового чата

  const handleSearch = (e) => {
    setSearchField(e.target.value);
  };

  const handleClick = (e) => {
    let changeStr = e.target.value.split('\n\n')[0];
    setSendingToCustomer(changeStr);
    setOpenCreating("");
  };

  const handleMessageField = (e) => {
    setMessageField(e.target.value);
  };

  const handleChosen = (e) => {
    let list = [];
    if (groupChat.length !== 0) {
      for (let i = 0; i < groupChat.length; i++) list.push(groupChat[i]);
    }
    list.push(e.target.value);
    setGroupChat(list);
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
      message: messageField,
    };
    saveMessage(mes);
    setMessageField("");
  };

  //удаление диалога
  const handleDeleteDialog = (e) => {
    e.preventDefault();
    const dialog = {
      fromUser: session.username,
      toUser: sendingToCustomer,
    };
    deleteDialog(dialog);
  };

  const handleCreateGroupChat = (e) => {
    e.preventDefault();
    setOpenCreating("true");
  };

  const createGroupChat = (e) => {
    e.preventDefault();
    let str = groupChat;
    str.unshift(session.username);
    str = str.toString().replace(/,/g, ", ");
    setSendingToCustomer(str);
    setOpenCreating("");
  };

  const cancellation = (e) => {
    e.preventDefault();
    setGroupChat([]);
    setOpenCreating("");
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
    return <div onClick={handleClick}>{listAllUsers}</div>;
  }

  function ChooseUsersForGroupChat() {
    const listAllUsers = getAllUsers.map((user) => (
      <ul key={user}>
        <button className="user-btn" key={user} value={user}>
          {user}
        </button>
      </ul>
    ));
    return <div onClick={handleChosen}>{listAllUsers}</div>;
  }

  function ChosenUsers() {
    const listAllUsers = groupChat.map((user) => (
      <ul key={user}>
        <button className="user-btn" key={user} value={user}>
          {user}
        </button>
      </ul>
    ));
    return <div onClick={handleChosen}>{listAllUsers}</div>;
  }

  function GroupChat() {
    let element = sendingToCustomer.split(", ");
    for (let i = 0; i < element.length; i++)
      if (element[i] === session.username) element.splice(i, 1);
    const listAllUsers = element.map((user) => (
      <ul key={user}>
        <button className="user-btn" key={user} value={user}>
          {user}
        </button>
      </ul>
    ));
    return <div onClick={handleClick}>{listAllUsers}</div>;
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
    if (sendingToCustomer.split(", ").length > 1) {
      setRoom(sendingToCustomer);
    } else setRoom("");
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
          <button onClick={handleCreateGroupChat}>Создать груповой чат</button>
          <h3>Активные диалоги</h3>
          <Dialogs />
        </div>
        {sendingToCustomer === "" && openCreating === "" && (
          <div className="blankChatForm">
            <h3>Выберите, кому хотели бы написать</h3>
          </div>
        )}
        {room !== "" && openCreating === "" && (
          <div className="right-pos">
            <div className="chatForm">
              <h2>{sendingToCustomer}</h2>
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
                  value={messageField}
                  onChange={handleMessageField}
                  onKeyPress={pressEnter}
                />
                <input
                  className="msgbtn"
                  type="submit"
                  onClick={handleSubmit}
                  value=""
                />
              </div>
            </div>
            <div className="usersForm">
              <h3>Участники чата</h3>
              <GroupChat />
            </div>
          </div>
        )}
        {room === "" && sendingToCustomer !== "" && openCreating === "" && (
          <div className="chatForm">
            <h2>
              {sendingToCustomer}
              <button onClick={handleDeleteDialog}>Удалить диалог</button>
            </h2>
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
                value={messageField}
                onChange={handleMessageField}
                onKeyPress={pressEnter}
              />
              <input
                className="msgbtn"
                type="submit"
                onClick={handleSubmit}
                value=""
              />
            </div>
          </div>
        )}
        {openCreating === "true" && (
          <div className="blankChatForm">
            <div className="usersForm">
              <ChooseUsersForGroupChat />
            </div>
            <div className="usersForm">
              <ChosenUsers />
            </div>
            <button onClick={createGroupChat}>Подтвердить выбор</button>
            <button onClick={cancellation}>Отмена</button>
          </div>
        )}
      </div>
    </form>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);
