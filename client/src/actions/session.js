import * as apiUtil from "../util/session";
import { receiveErrors } from "./error";

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const LOGOUT_CURRENT_USER = "LOGOUT_CURRENT_USER";
export const RECEIVE_USERS_LIST = "RECEIVE_USERS_LIST";
export const RECEIVE_MESSAGES = "RECEIVE_MESSAGES";
export const RECEIVE_ALL_USERS = "RECEIVE_ALL_USERS";

const receiveCurrentUser = (user) => ({
  type: RECEIVE_CURRENT_USER,
  user,
});

const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER,
});

const receiveUsersList = (users) => ({
  type: RECEIVE_USERS_LIST,
  users,
});

const receiveMessages = (messages) => ({
  type: RECEIVE_MESSAGES,
  messages,
});

const receiveAllUsers = (users) => ({
  type: RECEIVE_ALL_USERS,
  users,
});

export const login = (user) => async (dispatch) => {
  const response = await apiUtil.login(user);
  const data = await response.json();

  if (response.ok) {
    return dispatch(receiveCurrentUser(data));
  }
  return dispatch(receiveErrors(data));
};

export const signup = (user) => async (dispatch) => {
  const response = await apiUtil.signup(user);
  const data = await response.json();

  if (response.ok) {
    return dispatch(receiveCurrentUser(data));
  }
  return dispatch(receiveErrors(data));
};

export const sendemail = (user) => async (dispatch) => {
  const response = await apiUtil.sendemail(user);
  const data = await response.json();

  if (response.ok) {
    return dispatch(receiveCurrentUser(data));
  }
  return dispatch(receiveErrors(data));
};

export const logout = () => async (dispatch) => {
  const response = await apiUtil.logout();
  const data = await response.json();

  if (response.ok) {
    return dispatch(logoutCurrentUser());
  }
  return dispatch(receiveErrors(data));
};

export const saveMessage = (mes) => async () => {
  apiUtil.saveMessage(mes);
};

export function chatList(user) {
  apiUtil.chatList(user);
  //так как мы определили event и handle, то кастомный миддл варе поймет это и выполнит необходимые действия
  //не уверен что это все сделано по канону, но это работает
  return (dispatch) =>
    dispatch({
      event: "returnChatList",
      handle: (data) => dispatch(receiveUsersList(data)),
    });
}

export function messageList(user) {
  apiUtil.messageList(user);
  return (dispatch) =>
    dispatch({
      event: "returnMessageList",
      handle: (data) => dispatch(receiveMessages(data)),
    });
}

export function allUsers(user) {
  apiUtil.allUsers(user);
  return (dispatch) =>
    dispatch({
      event: "returnAllUsers",
      handle: (user) => dispatch(receiveAllUsers(user)),
    });
}

export const deleteDialog = (user) => async () => {
  await apiUtil.deleteDialog(user);
};

export const updateGroupChat = (user) => async () => {
  apiUtil.updateGroupChat(user);
};
