import { RECEIVE_USERS_LIST } from "../../actions/session";

export default (state = [], { users, type }) => {
  Object.freeze(state);
  switch (type) {
    case RECEIVE_USERS_LIST:
      return users;
    default:
      return state;
  }
};
