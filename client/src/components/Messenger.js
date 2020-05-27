import React, {useEffect, useState} from "react";
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
    const [temp, setTemp] = useState("");

    const handleChange = (event) => {
        setSendingToCustomer(event.target.value);
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
        const listDialogs = usersList.map((user) => <ul key={user}>
            <button key={user} value={user}>{user}</button>
        </ul>);
        return <div onClick={handleChange}>{listDialogs}</div>;
    }

    function updateMessages() {
        const dialog = {
            fromUser: session.username,
            toUser: sendingToCustomer,
        };
        messageList(dialog);
    }

    function Messages() {
        let listMessages;
        if (sendingToCustomer !== '') {
            listMessages = chatShow.map((message) => (
                <ul key={Math.random()}>{message}</ul>
            ));
        }
        else
            listMessages = '';
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
            <option key={user} value={user}>{user}</option>
        ));
        return <select onChange={handleChange}>{listAllUsers}</select>;
    }

    //начальное обновление блоков
    if (getAllUsers.length === 0 || usersList.length === 0) {
        setTimeout(() => {
            updateDialogs() || updateListOfUsers()
        }, 100);
    }

    //автоматическое обновление блоков каждые 4 сек
    useEffect(() => {
        const interval = setInterval(() => {
            updateListOfUsers() || updateDialogs() || updateMessages()
        }, 4000);
        return () => clearInterval(interval);
    });

    //обновление чата при выборе диалога
    if (temp !== sendingToCustomer) {
        updateMessages();
        setTemp(sendingToCustomer)
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="inline">{session.username}</h1>
            <button onClick={logout}>Logout</button>
            <br/>
            <div className="inline-block">
                <div className="chatForm">
                    <input
                        type="hidden"
                        readOnly="readonly"
                        name="toUser"
                        value={sendingToCustomer}
                    />
                    <h2>Диалог с {sendingToCustomer}</h2>
                    <div className='messagesForm'>
                        <Messages/>
                    </div>
                    <br/>
                    <input type="text" name="message" placeholder="Сообщение"/>
                    <input type="submit" value="Отправить сообщение"/>
                </div>
                <div className='usersForm'>
                    <ListOfUsers/>
                    <Dialogs/>
                </div>
            </div>
        </form>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);
