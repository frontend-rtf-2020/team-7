const express = require('express');
const cors = require('cors');
const session = require('./data/db/session');


(async () => {
    try {
        const app = express();
        const db = require('./data/db/usersDatabase');
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(session);
        app.use(
            cors({
                credentials: true
            })
        );
        const apiRouter = express.Router();
        app.use('/api', apiRouter);
        const userRoutes = require('./routes/user');
        const sessionRoutes = require('./routes/session');
        apiRouter.use('/users', userRoutes);
        apiRouter.use('/session', sessionRoutes);
        const path = require('path');
        app.use(express.static(path.join(__dirname, 'client')));
        app.get('/*', function (req, res) {
            res.sendFile(path.join(__dirname, 'client', 'index.html'))
        });
        app.listen(process.env.PORT || 5000);
    } catch (err) {
        console.log(err);
    }
})();