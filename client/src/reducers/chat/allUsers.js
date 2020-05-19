import { RECEIVE_ALL_USERS } from "../../actions/session";

export default (state = [], { users, type }) => {
  Object.freeze(state);
  switch (type) {
    case RECEIVE_ALL_USERS:
      return users;
    default:
      return state;
  }
};
