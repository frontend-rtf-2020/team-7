const express = require('express');
const cors = require('cors');

(async () => {
  try {
    const app = express();
    const http = require('http').createServer(app);
    const io = require('socket.io')(http);
    const session = require('./data/db/session');
    const usersDB = require('./data/db/usersDatabase');
    const messagesDb = require('./data/db/messages');
    const chatHub = require('./events/chat'); //необходимый функционал, выполняющий определенные задачи)))))))))) да, написал, как гений

    // используем сессии для socket.io
    io.use(function (socket, next) {
      session(socket.request, socket.request.res, next);
    });

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(session);
    app.use(
      cors({
        credentials: true,
      }),
    );
    const apiRouter = express.Router();
    app.use('/api', apiRouter);

    const userRoutes = require('./routes/user');
    const sessionRoutes = require('./routes/session');
    apiRouter.use('/users', userRoutes);
    apiRouter.use('/session', sessionRoutes);
    const path = require('path');
    let staticPath = path.join(__dirname, '../client/build');
    app.use(express.static(staticPath));
    app.get('/*', function (req, res) {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });

    //определяем действие при подключении
    io.on('connection', (socket) => {
      console.log("New client connected");
      socket.on('saveMessage', (message) => chatHub.saveMessage(message));
      socket.on('chatList', (user) => chatHub.chatList(user, socket));
      socket.on('messageList', (user) => chatHub.messageList(user, socket));
      socket.on('allUsers', (user) => chatHub.allUsers(user, socket));
      socket.on('deleteDialog', (user) => chatHub.deleteDialog(user));
      socket.on('updateGroupChat', (data) => chatHub.updateGroupChat(data));
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    http.listen(process.env.PORT || 5000);
  } catch (err) {
    console.log(err);
  }
})();
