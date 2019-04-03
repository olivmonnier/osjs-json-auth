const shortid = require('shortid');
const dbAsync = require('./db');
const { findUser, createPasswordPrompt } = require('./utils');

module.exports = cli => {
  const listUsers = async () => {
    const db = await dbAsync;
    const users = db.get('users')
      .value();

    users.forEach(user => console.log(`id: ${user.id} username: ${user.username}`))
  }

  const addUser = async ({ options, args }) => {
    if (!args) {
      throw new Error('You need to specify --username');
    }

    const user = await findUser(args);

    if (user) throw new Error('User already exists');

    const db = await dbAsync;
    const password = await createPasswordPrompt();
    const newUser = {
      id: shortid.generate(),
      groups: args.groups || 'admin',
      username: args,
      name: args,
      password
    }

    db.get('users')
      .push(newUser)
      .write();
  }

  const pwdUser = async ({ options, args }) => {
    if (!args) {
      throw new Error('You need to specify --username');
    }

    const user = await findUser(args);

    if (!user) throw new Error('User not found');

    const db = await dbAsync;
    const password = await createPasswordPrompt();

    db.get('users')
      .find({ username: args })
      .assign({ password })
      .write();
  }

  const removeUser = async ({ options, args }) => {
    if (!args) {
      throw new Error('You need to specify --username');
    }

    const user = await findUser(args);

    if (user) {
      const db = await dbAsync;

      db.get('users')
        .remove({ username: args })
        .write();
    }
  }

  return {
    'user:list': listUsers,
    'user:add': {
      options: {
        '--username': 'user name'
      },
      action: addUser
    },
    'user:pwd': {
      options: {
        '--username': 'user name'
      },
      action: pwdUser
    },
    'user:remove': {
      options: {
        '--username': 'user name'
      },
      action: removeUser
    }
  }
}