const Chat = require('../models/chat');
const User = require('../models/user-model');

async function saveMessage(mes) {
  const { fromUser, toUser, message } = mes;
  let newMessage;
  if (toUser.split(', ').length === 1)
    newMessage = new Chat({ fromUser: fromUser, toUser: toUser, message: message });
  else newMessage = new Chat({ room: toUser, fromUser: fromUser, message: message });
  if (message.trim() !== '') await newMessage.save();
}

async function chatList(user, socket) {
  //обрабатываем информацию
  const {fromUser} = user;
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
      }, 'message time -_id').sort({time: -1}).limit(1);
    else
      lastMessage = await Chat.find({room: list[i]}, 'message time -_id').sort({time: -1}).limit(1);
    lastMessage = lastMessage.toString().replace(/{[\w\s,:']*message:\s*'/i, '\n\n');
    lastMessage = lastMessage.replace(/'[\s,]*[\s]*time:\s(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}.\d{3}Z\s*}/i, '\n\n$4:$5');
    if (lastMessage.includes(fromUser + ':'))
      lastMessage = lastMessage.replace(fromUser + ':', 'Вы:');
    list[i] += lastMessage
  }
  //отправляем вызываем на клиенте действие по событию 'returnChatList'
  return socket.emit('returnChatList', list);
}

async function messageList(user, socket) {
  const { fromUser, toUser } = user;
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
    return socket.emit('returnMessageList', parseStr(messages));
  } else {
    let messages = await Chat.find({ room: toUser }, 'time fromUser message -_id').sort('time');
    return socket.emit('returnMessageList', parseStr(messages));
  }
}

function parseStr(messages) {
  let list = [];
  for (let element of messages) {
    let str = element.toString();
    str = str.replace(/{[\w\s,:']*fromUser:\s*'/i, '');
    str = str.replace(/'[\w\s,:']*message:\s*'/i, '\n');
    str = str.replace(/'[\s,]*[\s]*time:\s(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}.\d{3}Z\s*}/i, '\n$4:$5\t$3-$2-$1');
    list.push(str);
  }
  if (list.length === 0) list.push('Список сообщений пуст');
  return list;
}
async function allUsers(user, socket) {
  const { username } = user;
  let users = await User.find({}, 'username -_id').sort('username');
  let list = [];
  for (let element of users) {
    let str = element.toString();
    str = str.replace("{ username: '", '');
    str = str.replace("' }", '');
    if (str !== username) list.push(str);
  }
  return socket.emit('returnAllUsers', list);
}

async function deleteDialog(user){
  const { fromUser, toUser } = user;
  await Chat.deleteMany({
    $or: [
      { fromUser: fromUser, toUser: toUser },
      { fromUser: toUser, toUser: fromUser },
    ],
  });
}

async function updateGroupChat(data){
  const {toUser, room} = data;
  await Chat.updateMany({room: toUser}, {room: room})
}

const chatHub = { saveMessage, chatList, messageList, allUsers, deleteDialog, updateGroupChat };

module.exports = chatHub;
