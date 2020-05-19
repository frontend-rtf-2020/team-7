import { RECEIVE_MESSAGES } from "../../actions/session";

export default (state = [], { messages, type }) => {
  Object.freeze(state);
  switch (type) {
    case RECEIVE_MESSAGES:
      return messages;
    default:
      return state;
  }
};
