import { socket } from "../index";


//кастомный миддл варе, необходимый для использования socket.io на клиенте
export default function socketMiddleware() {
  return ({ dispatch }) => (next) => (action) => {
    if (typeof action === "function") {
      return next(action);
    }

    const { event, leave, handle, ...rest } = action;

    if (!event) {
      return next(action);
    }

    if (leave) {
      socket.removeListener(event);
    }

    let handleEvent = handle;

    if (typeof handleEvent === "string") {
      handleEvent = (result) => {
        return dispatch({ type: handle, result, ...rest });
      };
    }

    return socket.on(event, handleEvent);
  };
}
