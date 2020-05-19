import { combineReducers } from "redux";
import errors from "./errors/errors";
import session from "./session/session";
import usersList from "./chat/usersList";
import chatShow from "./chat/chatShow";
import getAllUsers from "./chat/allUsers";

export default combineReducers({
  session,
  errors,
  usersList,
  chatShow,
  getAllUsers,
});
