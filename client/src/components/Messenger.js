import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { ReactMic } from "react-mic";
import {
  logout,
  saveMessage,
  chatList,
  messageList,
  allUsers,
  deleteDialog,
  updateGroupChat,
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
  updateGroupChat: (user) => dispatch(updateGroupChat(user)),
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
  updateGroupChat,
}) => {
  const [sendingToCustomer, setSendingToCustomer] = useState("");
  const [messageField, setMessageField] = useState("");
  const [listOfAllUsers, setListOfAllUsers] = useState([]); //никнеймы подходящие под поле поиска
  const [
    listOfUsersForCreateGroupChat,
    setListOfUsersForCreateGroupChat,
  ] = useState([]); //никнеймы подходящие под поле поиска
  const [listOfUsersForAddingInChat, setListOfUsersForAddingInChat] = useState(
    []
  ); //никнеймы подходящие под поле поиска
  const [room, setRoom] = useState(""); //групповой чат
  const [openCreating, setOpenCreating] = useState(""); //переменная для создания группового чата
  const [groupChat, setGroupChat] = useState([]); //переменная для выбранных пользователей группового чата
  const [openAddingUsers, setOpenAddingUsers] = useState(""); //переменная для добавления пользователей в групповой чат
  const [openDeletingUsers, setOpenDeletingUsers] = useState(""); //переменная для удаления пользователей из группового чата
  const [record, setRecord] = useState(false); //начало и остановка записи аудио

  const handleSearch = (e) => {
    let list = [];
    if (e.target.value !== "") {
      for (let i = 0; i < getAllUsers.length; i++) {
        if (getAllUsers[i].toLowerCase().includes(e.target.value.toLowerCase()))
          list.push(getAllUsers[i]);
      }
      setListOfAllUsers(list);
    } else setListOfAllUsers(list);
  };

  const handleClick = (e) => {
    let changeStr;
    if (e.target.value !== undefined)
      changeStr = e.target.value.split("\n\n")[0];
    else changeStr = e.target.getAttribute("data-key").split("\n\n")[0];
    setSendingToCustomer(changeStr);
    updateMessages(changeStr);
    if (changeStr.split(", ").length > 1) {
      setRoom(changeStr);
    } else setRoom("");
    zeroing();
    setMessageField("");
  };

  const handleMessageField = (e) => {
    setMessageField(e.target.value);
  };

  const handleChosen = (e) => {
    let list = [];
    if (groupChat.length !== 0) {
      for (let i = 0; i < groupChat.length; i++) list.push(groupChat[i]);
    }
    if (!list.includes(e.target.value) && e.target.value !== undefined)
      list.push(e.target.value);
    setGroupChat(list);
  };

  //отправка сообщения на нажатие enter
  const pressEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const mes = {
        fromUser: session.username,
        toUser: sendingToCustomer,
        message: messageField,
      };
      saveMessage(mes);
      setMessageField("");
      updateMessages(sendingToCustomer);
      updateDialogs();
    }
  };

  //отправка сообщения
  const handleSubmit = (e) => {
    e.preventDefault();
    const mes = {
      fromUser: session.username,
      toUser: sendingToCustomer,
      message: messageField,
    };
    saveMessage(mes);
    setMessageField("");
    updateMessages(sendingToCustomer);
    updateDialogs();
  };

  //удаление диалога
  const handleDeleteDialog = (e) => {
    e.preventDefault();
    const dialog = {
      fromUser: session.username,
      toUser: sendingToCustomer,
    };
    deleteDialog(dialog);
    setMessageField("");
  };

  //открытие окна для создания группового чата
  const handleCreateGroupChat = (e) => {
    e.preventDefault();
    setOpenAddingUsers("");
    setOpenDeletingUsers("");
    setOpenCreating("true");
    setGroupChat([]);
    setMessageField("");
    setListOfUsersForCreateGroupChat(getAllUsers);
  };

  //подтверждение изменений внесенных в групповой чат
  const createGroupChat = (e) => {
    e.preventDefault();
    if (openAddingUsers === "" && openDeletingUsers === "") {
      let str = groupChat;
      str.unshift(session.username);
      str = str.toString().replace(/,/g, ", ");
      setSendingToCustomer(str);
      setRoom(str);
    } else if (openAddingUsers === "true") {
      let str;
      if (
        sendingToCustomer.split(", ")[
          sendingToCustomer.split(", ").length - 1
        ] !== ""
      )
        str =
          sendingToCustomer + ", " + groupChat.toString().replace(/,/g, ", ");
      else str = sendingToCustomer + groupChat.toString().replace(/,/g, ", ");
      const update = {
        toUser: sendingToCustomer,
        room: str,
      };
      updateGroupChat(update);
      setSendingToCustomer(str);
      setRoom(str);
    } else if (openDeletingUsers === "true") {
      let str = sendingToCustomer;
      for (let i = 0; i < groupChat.length; i++)
        str = str.replace(", " + groupChat[i], "");
      if (str.split(", ").length === 1) str = str + ", ";
      const update = {
        toUser: sendingToCustomer,
        room: str,
      };
      updateGroupChat(update);
      setSendingToCustomer(str);
      setRoom(str);
    }
    zeroing();
  };

  //отмена создания чата или добавления нового пользователя
  const cancellation = (e) => {
    e.preventDefault();
    zeroing();
  };

  function zeroing() {
    setGroupChat([]);
    setOpenCreating("");
    setOpenAddingUsers("");
    setOpenDeletingUsers("");
  }

  //добавление новых пользователей в чат
  const addUsersInChat = (e) => {
    e.preventDefault();
    setMessageField("");
    setOpenCreating("true");
    setOpenAddingUsers("true");
    let usersForAdding = getAllUsers.toString().split(",");
    for (let i = 0; i < sendingToCustomer.split(", ").length; i++) {
      let index = usersForAdding.indexOf(sendingToCustomer.split(", ")[i]);
      usersForAdding.splice(index, 1);
    }
    setListOfUsersForAddingInChat(usersForAdding);
  };

  //удаление пользователей из группового чата
  const deleteUsersFromChat = (e) => {
    e.preventDefault();
    setMessageField("");
    setOpenCreating("true");
    setOpenDeletingUsers("true");
  };

  const leaveFromChat = (e) => {
    e.preventDefault();
    setMessageField("");
    let str = sendingToCustomer;
    if (str.includes(session.username + ", "))
      str = str.replace(session.username + ", ", "");
    else str = str.replace(", " + session.username, "");
    if (str.split(", ").length === 1 && str.split(", ")[0].trim() !== "")
      str = str + ", ";
    const update = {
      toUser: sendingToCustomer,
      room: str,
    };
    updateGroupChat(update);
    setSendingToCustomer("");
    setRoom("");
  };

  //список активных диалогов
  const updateDialogs = useCallback(() => {
    const currentUser = {
      fromUser: session.username,
    };
    chatList(currentUser);
  }, [chatList, session.username]);

  function Dialogs() {
    const listMessages = usersList.map((user) => {
      return (
        <ul key={user}>
          {user.split("\n\n")[0] === sendingToCustomer && (
            <button
              className="current-user-btn"
              key="0"
              value={user}
              onClick={handleClick}
            >
              <div data-key={user} className="name-time">
                <h1 key="1" data-key={user}>
                  {user.split("\n\n")[0]}
                </h1>
                <h2 key="2" data-key={user}>
                  {user.split("\n\n")[2]}
                </h2>
              </div>
              <h3 key="3" data-key={user}>
                {user.split("\n\n")[1]}
              </h3>
            </button>
          )}
          {user.split("\n\n")[0] !== sendingToCustomer && (
            <button
              className="user-btn"
              key="0"
              value={user}
              onClick={handleClick}
            >
              <div data-key={user} className="name-time">
                <h1 key="1" data-key={user}>
                  {user.split("\n\n")[0]}
                </h1>
                <h2 key="2" data-key={user}>
                  {user.split("\n\n")[2]}
                </h2>
              </div>
              <h3 key="3" data-key={user}>
                {user.split("\n\n")[1]}
              </h3>
            </button>
          )}
        </ul>
      );
    });
    return <div>{listMessages}</div>;
  }

  //все пользователи чата
  const updateListOfUsers = useCallback(() => {
    const currentUser = {
      username: session.username,
    };
    allUsers(currentUser);
  }, [allUsers, session.username]);

  function ListOfUsers() {
    const listAllUsers = listOfAllUsers.map((user) => (
      <ul key={user}>
        {user === sendingToCustomer && (
          <button className="current-user-btn" key={user} value={user}>
            {user}
          </button>
        )}
        {user !== sendingToCustomer && (
          <button className="user-btn" key={user} value={user}>
            {user}
          </button>
        )}
      </ul>
    ));
    return <div onClick={handleClick}>{listAllUsers}</div>;
  }

  //поиск пользователей для создания группового чата или добавления в него
  const handleSearchForGroupChat = (e) => {
    let list = [];
    if (openAddingUsers === "") {
      for (let i = 0; i < getAllUsers.length; i++) {
        if (getAllUsers[i].toLowerCase().includes(e.target.value.toLowerCase()))
          list.push(getAllUsers[i]);
        setListOfUsersForCreateGroupChat(list);
      }
    } else {
      let usersForAdding = getAllUsers.toString().split(",");
      for (let i = 0; i < sendingToCustomer.split(", ").length; i++) {
        let index = usersForAdding.indexOf(sendingToCustomer.split(", ")[i]);
        usersForAdding.splice(index, 1);
      }
      for (let i = 0; i < usersForAdding.length; i++) {
        if (
          usersForAdding[i].toLowerCase().includes(e.target.value.toLowerCase())
        )
          list.push(usersForAdding[i]);
        setListOfUsersForAddingInChat(list);
      }
    }
  };

  //список пользователей для создания группового чата или изменения его
  function ChooseUsersForGroupChat() {
    if (openAddingUsers === "" && openDeletingUsers === "")
      return (
        <div onClick={handleChosen}>
          {outputForGroupChat(listOfUsersForCreateGroupChat)}
        </div>
      );
    else if (openAddingUsers === "true") {
      return (
        <div onClick={handleChosen}>
          {outputForGroupChat(listOfUsersForAddingInChat)}
        </div>
      );
    } else if (openDeletingUsers === "true") {
      return (
        <div onClick={handleChosen}>
          {outputForGroupChat(sendingToCustomer.split(", ").splice(1))}
        </div>
      );
    }
  }

  //список выбранных пользователей
  function ChosenUsers() {
    return <div onClick={handleChosen}>{outputForGroupChat(groupChat)}</div>;
  }

  //участники группового чата
  function GroupChat() {
    let users = sendingToCustomer.split(", ");
    for (let i = 0; i < users.length; i++)
      if (users[i] === session.username) users.splice(i, 1);
    if (users[users.length - 1] === "") users.splice(users.length - 1, 1);
    return <div onClick={handleClick}>{outputForGroupChat(users)}</div>;
  }

  //вывод элементов
  function outputForGroupChat(element) {
    return element.map((user) => {
      if (user !== "")
        return (
          <ul key={Math.random()}>
            <button className="user-btn" key={user} value={user}>
              {user}
            </button>
          </ul>
        );
      else return <h2>Пусто</h2>;
    });
  }

  //список сообщений
  const updateMessages = useCallback(
    (element) => {
      const dialog = {
        fromUser: session.username,
        toUser: element,
      };
      messageList(dialog);
    },
    [messageList, session.username]
  );

  const ref = React.createRef();

  const handleScroll = () => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  function Messages() {
    const listMessages = chatShow.map((message) => {
      if (message.includes("data:audio/webm;codecs=opus;base64,")) {
        const byteCharacters = atob(
          message
            .split("\n")[1]
            .replace("data:audio/webm;codecs=opus;base64,", "")
        );
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/webm;codecs=opus" });
        const blobURL = URL.createObjectURL(blob);
        if (message.split("\n")[0] === session.username) {
          return (
            <div key={Math.random()} className="current-voice">
              <audio key={Math.random()} src={blobURL} controls="controls" />
            </div>
          );
        } else {
          return (
            <div key={Math.random()} className="voice">
              <audio key={Math.random()} src={blobURL} controls="controls" />
            </div>
          );
        }
      } else if (message.split("\n").length > 1) {
        if (message.split("\n")[0] === session.username) {
          return (
            <div key={Math.random()} className="current-msg-frame">
              <div className="name-time">
                <h1 key={Math.random()}>{message.split("\n")[0]}</h1>
                <h2 key={Math.random()}>{message.split("\n")[2]}</h2>
              </div>
              <h3 key={Math.random()}>{message.split("\n")[1]}</h3>
            </div>
          );
        } else {
          return (
            <div key={Math.random()} className="msg-frame">
              <div className="name-time">
                <h1 key={Math.random()}>{message.split("\n")[0]}</h1>
                <h2 key={Math.random()}>{message.split("\n")[2]}</h2>
              </div>
              <h3 key={Math.random()}>{message.split("\n")[1]}</h3>
            </div>
          );
        }
      } else {
        return (
          <h1 className="msg-date" key={Math.random()}>
            {message}
          </h1>
        );
      }
    });
    return (
      <div ref={ref} onClick={handleScroll}>
        {listMessages}
      </div>
    );
  }

  //начальное обновление блоков
  if (getAllUsers.length === 0) {
    setTimeout(() => {
      updateDialogs() || updateListOfUsers();
    }, 100);
  }

  //автоматическое обновление блоков каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      updateListOfUsers() ||
      updateDialogs() ||
      updateMessages(sendingToCustomer);
    }, 1000);
    return () => clearInterval(interval);
  }, [
    usersList,
    chatShow,
    getAllUsers,
    sendingToCustomer,
    updateDialogs,
    updateListOfUsers,
    updateMessages,
  ]);

  const recording = (e) => {
    e.preventDefault();
    if (record === false) setRecord(true);
    else setRecord(false);
  };

  const blobToBase64 = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  function onStop(recordedBlob) {
    blobToBase64(recordedBlob.blob).then((res) => {
      const mes = {
        fromUser: session.username,
        toUser: sendingToCustomer,
        message: res,
      };
      saveMessage(mes);
    });
    updateMessages(sendingToCustomer);
    updateDialogs();
  }

  return (
    <form className="inline-block">
      <div className="logout">
        <h1 className="inline">{session.username}</h1>
        <button onClick={logout}>Logout</button>
        <br />
      </div>
      <div className="messenger">
        <div className="usersForm">
          <div className="list-of-users">
            <input
              type="text"
              placeholder="Поиск пользователей..."
              onChange={handleSearch}
            />
            <ListOfUsers />
          </div>
          <button className="create-btn" onClick={handleCreateGroupChat}>
            Создать беседу
          </button>
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
              <div className="msg">
                <ReactMic
                  record={record}
                  className="invisible"
                  onStop={onStop}
                  strokeColor="#000000"
                  backgroundColor="#FF4081"
                />
                {record === false && (
                    <input
                        className="msginput"
                        type="text"
                        name="message"
                        placeholder="Сообщение"
                        value={messageField}
                        onChange={handleMessageField}
                        onKeyPress={pressEnter}
                    />
                )}
                {record === true && (
                    <input
                        className="msginput"
                        type="readonly"
                        name="message"
                        placeholder="Идет запись голоса!"
                    />
                )}
                <input
                  className="msgbtn"
                  type="submit"
                  onClick={handleSubmit}
                  value=""
                />
                <input
                  onClick={recording}
                  className="record-btn"
                  type="submit"
                  value=""
                />
              </div>
            </div>
            <div className="blankGroupChatForm">
              <h1 className="participants">Участники чата</h1>
              <div className="chosen-users">
                <GroupChat />
              </div>
              <button onClick={addUsersInChat}>
                Добавить пользователя в чат
              </button>
              {sendingToCustomer.split(", ")[0] === session.username && (
                <button onClick={deleteUsersFromChat}>
                  Удалить пользователя из чата
                </button>
              )}
              <button onClick={leaveFromChat}>Выйти из чата</button>
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
            <div className="msg">
              <ReactMic
                record={record}
                className="invisible"
                onStop={onStop}
                strokeColor="#000000"
                backgroundColor="#FF4081"
              />
              {record === false && (
                <input
                    className="msginput"
                    type="text"
                    name="message"
                    placeholder="Сообщение"
                    value={messageField}
                    onChange={handleMessageField}
                    onKeyPress={pressEnter}
                />
              )}
              {record === true && (
                  <input
                      className="msginput"
                      type="readonly"
                      name="message"
                      placeholder="Идет запись голоса!"
                  />
              )}
              <input
                className="msgbtn"
                type="submit"
                onClick={handleSubmit}
                value=""
              />
              <input
                onClick={recording}
                className="record-btn"
                type="submit"
                value=""
              />
            </div>
          </div>
        )}
        {openCreating === "true" && (
          <div className="blankGroupChatForm">
            {openDeletingUsers === "true" && <h1>Удалить пользователей</h1>}
            {openDeletingUsers === "" && <h1>Добавить пользователей</h1>}
            <div className="form-for-choose">
              <div className="all-users">
                {openDeletingUsers === "" && (
                  <input
                    type="text"
                    placeholder="Поиск пользователей..."
                    onChange={handleSearchForGroupChat}
                  />
                )}
                <ChooseUsersForGroupChat />
              </div>
              <img alt="Arrow." src={"/arrow.png"} height="50px" width="65px" />
              <div className="chosen-users">
                <ChosenUsers />
              </div>
            </div>
            <div className="btn-success">
              <button className="cancel" onClick={cancellation}>
                Отмена
              </button>
              <button className="success" onClick={createGroupChat}>
                Подтвердить выбор
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);
