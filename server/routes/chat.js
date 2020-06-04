const express = require('express');
const Chat = require('../models/chat');
const User = require('../models/user-model');
const chatRouter = express.Router();

chatRouter.post('/saveMessage', async (req, res) => {
  const { fromUser, toUser, message } = req.body;
  let newMessage;
  if (toUser.split(', ').length === 1)
    newMessage = new Chat({ fromUser: fromUser, toUser: toUser, message: message });
  else newMessage = new Chat({ room: toUser, fromUser: fromUser, message: message });
  if (message.trim() !== '') await newMessage.save();
});

chatRouter.post('/chatList', async (req, res) => {
  const {fromUser} = req.body;
  let users = await Chat.find({fromUser: fromUser}, 'toUser -_id');
  let toCurrentUsers = await Chat.find({toUser: fromUser}, 'fromUser -_id');
  let groupChat = await Chat.find({room: /[\w\s]*,/}, 'room -_id');
  let list = [];
  for (let element of users) {
    let str = element.toString();
    str = str.replace("{ toUser: '", '');
    str = str.replace("' }", '');
    if (!list.includes(str) && str !== '{}') list.push(str);
  }
  for (let element of toCurrentUsers) {
    let str = element.toString();
    str = str.replace("{ fromUser: '", '');
    str = str.replace("' }", '');
    if (!list.includes(str) && str !== '{}') list.push(str);
  }
  for (let element of groupChat) {
    let str = element.toString();
    str = str.replace("{ room: '", '');
    str = str.replace("' }", '');
    if (!list.includes(str) && str.includes(fromUser)) list.push(str);
  }
  for (let i = 0; i < list.length; i++) {
    let lastMessage;
    if (list[i].split(", ").length === 1)
      lastMessage = await Chat.find({
        $or: [
          {fromUser: fromUser, toUser: list[i]},
          {fromUser: list[i], toUser: fromUser},
        ],
      }, 'fromUser message time -_id').sort({time: -1}).limit(1);
    else
      lastMessage = await Chat.find({room: list[i]}, 'fromUser message time -_id').sort({time: -1}).limit(1);
    lastMessage = lastMessage.toString().replace(/{[\w\s,:']*fromUser:\s*'/i, '\n\n');
    lastMessage = lastMessage.replace(/'[\w\s,:']*message:\s*'/i, ': ');
    lastMessage = lastMessage.replace(/'[\s,]*[\s]*time:\s(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}.\d{3}Z\s*}/i, '\n$4:$5');
    if (lastMessage.includes(fromUser + ':'))
      lastMessage = lastMessage.replace(fromUser + ':', 'Вы:');
    list[i] += lastMessage
  }
  res.send(JSON.stringify(list));
});

chatRouter.post('/messageList', async (req, res) => {
  const { fromUser, toUser } = req.body;
  if (toUser.split(', ').length === 1) {
    let messages = await Chat.find(
      {
        $or: [
          { fromUser: fromUser, toUser: toUser },
          { fromUser: toUser, toUser: fromUser },
        ],
      },
      'time fromUser message -_id',
    ).sort('time');
    res.send(JSON.stringify(parseStr(messages)));
  } else {
    let messages = await Chat.find({ room: toUser }, 'time fromUser message -_id').sort('time');
    res.send(JSON.stringify(parseStr(messages)));
  }
});

function parseStr(messages) {
  let list = [];
  for (let element of messages) {
    let str = element.toString();
    str = str.replace(/{[\w\s,:']*fromUser:\s*'/i, '');
    str = str.replace(/'[\w\s,:']*message:\s*'/i, ': ');
    str = str.replace(/'[\s,]*[\s]*time:\s(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}.\d{3}Z\s*}/i, '\n$4:$5\t$3-$2-$1');
    list.push(str);
  }
  if (list.length === 0) list.push('Список сообщений пуст');
  return list;
}

chatRouter.post('/allUsers', async (req, res) => {
  const { username } = req.body;
  let users = await User.find({}, 'username -_id').sort('username');
  let list = [];
  for (let element of users) {
    let str = element.toString();
    str = str.replace("{ username: '", '');
    str = str.replace("' }", '');
    if (str !== username) list.push(str);
  }
  res.send(JSON.stringify(list));
});

chatRouter.post('/deleteDialog', async (req, res) => {
  const { fromUser, toUser } = req.body;
  await Chat.deleteMany({
    $or: [
      { fromUser: fromUser, toUser: toUser },
      { fromUser: toUser, toUser: fromUser },
    ],
  });
});

module.exports = chatRouter;
