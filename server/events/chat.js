const Chat = require('../models/chat');
const User = require('../models/user-model');
const moment = require('moment-timezone');

async function saveMessage(mes) {
  const {fromUser, toUser, message} = mes;
  let newMessage;
  if (typeof message === "object") {
    if (toUser.split(', ').length === 1)
      newMessage = new Chat({
        fromUser: fromUser,
        toUser: toUser,
        message: 'Голосовое сообщение',
        voice: message,
      });
    else
      newMessage = new Chat({
        room: toUser,
        fromUser: fromUser,
        message: 'Голосовое сообщение',
        voice: message,
      });
    await newMessage.save();
  } else {
    if (toUser.split(', ').length === 1)
      newMessage = new Chat({
        fromUser: fromUser,
        toUser: toUser,
        message: message,
      });
    else
      newMessage = new Chat({
        room: toUser,
        fromUser: fromUser,
        message: message,
      });
    if (message.trim() !== '') await newMessage.save();
  }
}

async function chatList(user, socket) {
  const { fromUser } = user;
  let users = await Chat.find({ fromUser: fromUser }, 'toUser -_id');
  let toCurrentUsers = await Chat.find({ toUser: fromUser }, 'fromUser -_id');
  let groupChat = await Chat.find({ room: /[\w\s\d,]*/ }, 'room -_id');
  let list = [];
  for (let element of users) {
    let str = element.toString();
    str = str.replace(/{[\w\s]*toUser:\s*'/i, '');
    str = str.replace(/'\s*}/, '');
    if (!list.includes(str) && str !== '{}') list.push(str);
  }
  for (let element of toCurrentUsers) {
    let str = element.toString();
    str = str.replace(/{[\w\s]*fromUser:\s*'/i, '');
    str = str.replace(/'\s*}/, '');
    if (!list.includes(str) && str !== '{}') list.push(str);
  }
  for (let element of groupChat) {
    let str = element.toString();
    str = str.replace(/{[\w\s]*room:\s*'/i, '');
    str = str.replace(/'\s*}/, '');
    if (!list.includes(str) && str.includes(fromUser)) list.push(str);
  }
  for (let i = 0; i < list.length; i++) {
    let lastMessage;
    if (list[i].split(', ').length === 1)
      lastMessage = await Chat.find(
        {
          $or: [
            { fromUser: fromUser, toUser: list[i] },
            { fromUser: list[i], toUser: fromUser },
          ],
        },
        'fromUser message time -_id',
      )
        .sort({ time: -1 })
        .limit(1);
    else
      lastMessage = await Chat.find(
        { room: list[i] },
        'fromUser message time -_id',
      )
        .sort({ time: -1 })
        .limit(1);
    lastMessage = lastMessage
      .toString()
      .replace(/{[\w\s,:']*fromUser:\s*'/i, '\n\n');
    lastMessage = lastMessage.replace(/'[\w\s,:']*message:\s*'/i, ': ');
    if (lastMessage.includes(fromUser + ':'))
      lastMessage = lastMessage.replace(fromUser + ':', 'Вы:');
    list[i] += lastMessage;
  }
  list
    .sort(
      (a, b) =>
        new moment(a.split(/'[\s,]*time:\s/i)[1].replace(/\s*}/i, '')) -
        new moment(b.split(/'[\s,]*time:\s/i)[1].replace(/\s*}/i, '')),
    )
    .reverse();
  for (let i = 0; i < list.length; i++) {
    moment.locale('ru');
    let date = moment(list[i].split(/'[\s,]*time:\s/i)[1].replace(/\s*}/i, ''))
      .tz('Asia/Yekaterinburg')
      .format('LT');
    list[i] = list[i].replace(/'[\s,]*time:[\s\d\w-:.]*}/i, '\n\n' + date);
  }
  return socket.emit('returnChatList', list);
}

async function messageList(user, socket) {
  try {
    const {fromUser, toUser} = user;
    if (toUser.split(', ').length === 1) {
      let messages = await Chat.find(
          {
            $or: [
              {fromUser: fromUser, toUser: toUser},
              {fromUser: toUser, toUser: fromUser},
            ],
          },
          'time fromUser message voice -_id',
      ).sort('time');
      return socket.emit('returnMessageList', parseStr(messages));
    } else {
      let messages = await Chat.find(
          {room: toUser},
          'time fromUser message voice -_id',
      ).sort('time');
      return socket.emit('returnMessageList', parseStr(messages));
    }
  } catch (err) {
    console.log(err);
  }
}

function parseStr(messages) {
  let list = [];
  let dmyArray = []; //day-month-year
  for (let element of messages) {
    if (element.message === 'Голосовое сообщение') {
      list.push(element.voice)
    } else {
      let str = element.toString();
      str = str.replace(/{[\w\s,:']*fromUser:\s*'/i, '');
      str = str.replace(/'[\w\s,:']*message:\s*'/i, '\n');
      moment.locale('ru');
      let date = moment(str.split(/'[\s,]*time:\s/i)[1].replace(/\s*}/i, ''))
          .tz('Asia/Yekaterinburg')
          .format('LLL');
      let dmy = date.split(',')[0];
      if (!dmyArray.includes(dmy)) {
        dmyArray.push(dmy);
        list.push(dmy);
      }
      str = str.replace(/'[\s,]*time:[\s\d\w-:.]*}/i, '\n' + date.split(',')[1]);
      list.push(str);
    }
  }
  if (list.length === 0) list.push('Список сообщений пуст');
  return list;
}

async function allUsers(user, socket) {
  const { username } = user;
  let users = await User.find({}, 'username -_id')
    .collation({ locale: 'en' })
    .sort('username');
  let list = [];
  for (let element of users) {
    let str = element.toString();
    str = str.replace(/{[\w\s,:']*username:\s*'/i, '');
    str = str.replace(/'\s*}/, '');
    if (str !== username && str.trim() !== '' && str !== '{}') list.push(str);
  }
  return socket.emit('returnAllUsers', list);
}

async function deleteDialog(user) {
  const { fromUser, toUser } = user;
  await Chat.deleteMany({
    $or: [
      { fromUser: fromUser, toUser: toUser },
      { fromUser: toUser, toUser: fromUser },
    ],
  });
}

async function updateGroupChat(data) {
  const { toUser, room } = data;
  if (toUser !== room && room.trim() !== '')
    await Chat.updateMany({ room: toUser }, { room: room });
  else await Chat.deleteMany({ room: toUser });
}

const chatHub = {
  saveMessage,
  chatList,
  messageList,
  allUsers,
  deleteDialog,
  updateGroupChat,
};

module.exports = chatHub;
