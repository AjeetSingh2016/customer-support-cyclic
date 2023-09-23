const express = require('express');
const mongoose = require('mongoose');

const { loginController, registerController,fetchUsersExceptUser, fetchOneUser, fetchalluser, updateUser} = require('../Controllers/userController');

const app = express();

const Router = express.Router();


Router.post('/login', loginController);
Router.post('/register', registerController);
Router.get('/fetchusers', fetchUsersExceptUser);
Router.get('/fetchoneuser', fetchOneUser);
Router.patch('/update/:userId', updateUser);



module.exports = Router;