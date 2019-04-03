const bcrypt = require('bcrypt-nodejs');
const readline = require('readline');
const dbAsync = require('./db');

const findUser = async username => {
  const db = await dbAsync;
  
  return db.get('users')
    .find({ username })
    .value();
}

const encryptPassword = password => new Promise((resolve, reject) => {
  bcrypt.hash(password, null, null, (err, hash) => err ? reject(err) : resolve(hash))
});

const promptPassword = q => new Promise((resolve, reject) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(q, answer => {
    resolve(answer);
    rl.close();
  });

  rl._writeToOutput = s => rl.output.write('*');
});

const createPasswordPrompt = () => promptPassword('Password: ')
  .then(pwd => encryptPassword(pwd));

const comparePassword = (password, hash) => new Promise((resolve, reject) => {
  bcrypt.compare(password, hash, (err,res) => resolve(res === true));
});

module.exports = {
  createPasswordPrompt,
  comparePassword,
  encryptPassword,
  findUser
}