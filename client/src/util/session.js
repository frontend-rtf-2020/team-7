import { socket } from "../index";

export const sendemail = (user) =>
  fetch("api/users/sendemail", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const login = (user) =>
  fetch("api/session/login", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const signup = (user) =>
  fetch("api/users/signup", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const saveMessage = async (mes) => {
  //вызываем действие на сервере, передав определенный параметр
  socket.emit("saveMessage", mes);
};

export const chatList = async (user) => {
  socket.emit("chatList", user);
};

export const messageList = async (user) => {
  socket.emit("messageList", user);
};

export const allUsers = async (user) => {
  socket.emit("allUsers", user);
};

export const deleteDialog = async (user) => {
  socket.emit("deleteDialog", user);
};

export const updateGroupChat = (user) => {
  socket.emit("updateGroupChat", user);
};

export const logout = () => fetch("api/session/logout", { method: "DELETE" });

export const checkLoggedIn = async () => {
  const response = await fetch("api/session/loadUser");
  const { user } = await response.json();
  let preloadedState = {};
  if (user) {
    preloadedState = {
      session: user,
    };
  }
  return preloadedState;
};
