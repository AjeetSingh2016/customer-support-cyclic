const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
    },
    password:{
        type: String,
    },
    isAgent: {type: Boolean, required: false},
    status:{type: String},
    Messages:{type: Array}
},{
    timeStamp: true,
})

const User = mongoose.model("User", userModel);

module.exports = User;