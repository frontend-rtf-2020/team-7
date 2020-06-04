import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "../reducers/root";
import socketMiddleware from '../middleware/socketMiddleware';

export default (preloadedState) =>
  createStore(reducer, preloadedState, applyMiddleware(thunk, socketMiddleware()));
