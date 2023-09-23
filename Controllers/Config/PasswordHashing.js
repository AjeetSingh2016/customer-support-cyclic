const bcrypt = require("bcrypt");
const salt = 10;

const hashPassword = async (plainPassword) => {
  try {
    const hash = await bcrypt.hash(plainPassword, salt);
    return hash;
  } catch (error) {
    throw new Error("Password hashing error");
  }
};

const comparePasswords = async (password, hashedPassword) => {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        throw new Error("Password comparing error");
    }
};


module.exports = {
    hashPassword,
    comparePasswords,
  };