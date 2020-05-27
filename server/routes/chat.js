const express = require('express');
const Chat = require('../models/chat');
const User = require('../models/user-model');
const chatRouter = express.Router();

chatRouter.post('/saveMessage', async (req, res) => {
  const { fromUser, toUser, message } = req.body;
  const newMessage = new Chat({ fromUser, toUser, message });
  if (message.trim() !== '') await newMessage.save();
});

chatRouter.post('/chatList', async (req, res) => {
  const { fromUser } = req.body;
  let users = await Chat.find({ fromUser: fromUser }, 'toUser -_id');
  let toCurrentUsers = await Chat.find({ toUser: fromUser }, 'fromUser -_id');
  let list = [];
  for (let element of users) {
    let str = element.toString();
    str = str.replace("{ toUser: '", '');
    str = str.replace("' }", '');
    if (!list.includes(str)) list.push(str);
  }
  for (let element of toCurrentUsers) {
    let str = element.toString();
    str = str.replace("{ fromUser: '", '');
    str = str.replace("' }", '');
    if (!list.includes(str)) list.push(str);
  }
  res.send(JSON.stringify(list));
});

chatRouter.post('/messageList', async (req, res) => {
  const { fromUser, toUser } = req.body;
  if (toUser !== null) {
    let messages = await Chat.find(
      {
        $or: [
          { fromUser: fromUser, toUser: toUser },
          { fromUser: toUser, toUser: fromUser },
        ],
      },
      'fromUser message -_id',
    ).sort('time');
    let list = [];
    for (let element of messages) {
      let str = element.toString();
      if (str.includes("{ fromUser: \'" + fromUser)) {
        str = str.replace("{ fromUser: \'" + fromUser + "\', message: '", 'F ');
        str = str.replace("{ fromUser: \'" + fromUser + "\'," + "\n" + "  message: '", 'F ');
        str = str.replace("{ fromUser: \'" + fromUser + "\'," + "\n" + "  message:" + "\n   '", 'F ');
      }
      else {
        str = str.replace("{ fromUser: \'" + toUser + "\', message: '", 'T ');
        str = str.replace("{ fromUser: \'" + toUser + "\'," + "\n" + "  message: '", 'F ');
        str = str.replace("{ fromUser: \'" + toUser + "\'," + "\n" + "  message:" + "\n   '", 'F ');
      }
      str = str.replace("' }", '');
      list.push(str);
    }
    if (list.length === 0)
      list.push('Список сообщений пуст');
    res.send(JSON.stringify(list));
  }
});

chatRouter.post('/allUsers', async (req, res) => {
  const { username } = req.body;
  let users = await User.find({}, 'username -_id');
  let list = [];
  list.push('Список пользователей')
  for (let element of users) {
    let str = element.toString();
    str = str.replace("{ username: '", '');
    str = str.replace("' }", '');
    if (str !== username) list.push(str);
  }
  res.send(JSON.stringify(list));
});

module.exports = chatRouter;
