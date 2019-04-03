const { comparePassword, findUser } = require('./utils');

module.exports = (core, options = {}) => {
  return {
    logout: () => Promise.resolve(true),
    login: async (req, res) => {
      try {
        const { username, password } = req.body;
        const user = await findUser(username);

        if (user) {
          return comparePassword(password, user.password)
            .then(result => result ? user : false);
        } else return false;
      } catch (err) {
        return err;
      }
    }
  }
}