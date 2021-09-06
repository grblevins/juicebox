const express = require('express');
const usersRouter = express.Router();

const { getAllUsers} = require('../db');

usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();

    res.send({
        users
    });
});

usersRouter.get('/', (req, res) => {
    res.send({
        users: []
    });
});

module.exports = usersRouter;