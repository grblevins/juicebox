const express = require('express');
const usersRouter = express.Router();

const { getAllUsers} = require('../db');
const { getUserByUsername } = require('../db');
const jwt = require('jsonwebtoken');

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


usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
  
    // request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }
  
    try {
      const user = await getUserByUsername(username);
      const token = jwt.sign((user.id, user.username), process.env.JWT_SECRET)
  
      if (user && user.password == password) {
        // create token & return to user
        res.send({ message: "you're logged in!", token: token});
      } else {
        next({ 
          name: 'IncorrectCredentialsError', 
          message: 'Username or password is incorrect'
        });
      }
    } catch(error) {
      console.log(error);
      next(error);
    }
  });

module.exports = usersRouter;