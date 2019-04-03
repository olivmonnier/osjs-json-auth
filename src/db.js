const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('auth.json');
const dbAsync = low(adapter);

dbAsync.then(db => 
  db.defaults({ users: [] })
    .write()
)

module.exports = dbAsync;