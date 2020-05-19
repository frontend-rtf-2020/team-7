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

export const saveMessage = (mes) =>
  fetch("api/chat/saveMessage", {
    method: "POST",
    body: JSON.stringify(mes),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const chatList = (user) =>
  fetch("api/chat/chatList", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const messageList = (user) =>
  fetch("api/chat/messageList", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const allUsers = (user) =>
  fetch("api/chat/allUsers", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

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
