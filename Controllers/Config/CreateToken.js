const jwt = require('jsonwebtoken');


const createToken = (id) => {

    return jwt.sign({id}, process.env.JWT_KEY, {
        expiresIn: "15d"
    })
}

module.exports = createToken;