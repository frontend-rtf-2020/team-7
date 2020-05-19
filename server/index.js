const express = require('express');
const cors = require('cors');

(async () => {
  try {
    const app = express();
    const session = require('./data/db/session');
    const usersDB = require('./data/db/usersDatabase');
    const messagesDb = require('./data/db/messages');
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
    const chatRoutes = require('./routes/chat');
    apiRouter.use('/users', userRoutes);
    apiRouter.use('/session', sessionRoutes);
    apiRouter.use('/chat', chatRoutes);
    const path = require('path');
    app.use(express.static(path.join(__dirname, 'client')));
    app.get('/*', function (req, res) {
      res.sendFile(path.join(__dirname, 'client', 'index.html'));
    });
    app.listen(process.env.PORT || 5000);
  } catch (err) {
    console.log(err);
  }
})();
