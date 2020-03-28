const User = require('../models/user-model');
const crypto = require('crypto');

function hash(text) {
    return crypto.createHash('sha1')
        .update(text).digest('base64')
}

createUser = (req, res) => {
    const body = {
            email: req.body.email,
            username: req.body.username,
            password: hash(req.body.password)
        };

    const user = new User(body);

    if (!user) {
        return res.status(400).json({ success: false, error: err })
    }

    user
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: user._id,
                message: 'Пользователь создан!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Пользователь не создан!',
            })
        })
};

updateUser = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Не все поля заполнены',
        })
    }

    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Пользователь не найден!',
            })
        }
        user.email = body.email;
        user.username = body.username;
        user.password = hash(body.password);
        user
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: user._id,
                    message: 'Данные о пользователе изменены!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Данные о пользователе не изменены!',
                })
            })
    })
};


login = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Не все поля заполнены',
        })
    }

    const email = body.email;
    const password = hash(body.password);
    User.findOne({email: email, password: password}, (err, user) => {
            if (err) {
                return res.status(400).json({success: false, error: err})
            }
            if (user)
                return res.status(201).json({
                    success: true,
                    id: user._id,
                    message: 'Пользователь найден!',
                });
            else
                return res
                    .status(404)
                    .json({
                        success: false, error: `Пользователь не найден`
                    })
        }
    )
};

logout = async (req, res, next) => {
    if (req.session.user) {
        delete req.session.user;
    }
};

getUserById = async (req, res) => {
    await User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `Пользователь не найден` })
        }
        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
};

getUsersByUsername = async (req, res) => {
    await User.find({username: req.params.username}, (err, users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!users.length) {
            return res
                .status(404)
                .json({ success: false, error: `Пользователи не найдены` })
        }
        return res.status(200).json({ success: true, data: users })
    }).catch(err => console.log(err))
};

module.exports = {
    createUser,
    updateUser,
    login,
    logout,
    getUsersByUsername,
    getUserById,
};