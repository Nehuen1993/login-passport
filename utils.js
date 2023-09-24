const bcrypt = require('bcrypt');

const createHash = (password) => 
bcrypt.hashSync(password, bcryot.genSaltSync(10))

async function isValidatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}



module.exports = {
    createHash,
    isValidatePassword
}