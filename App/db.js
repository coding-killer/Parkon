var sqlite3 = require('sqlite3').verbose();
var userDB = new sqlite3.Database("./db/userDB.db", 
sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
function(err) { 
  if(!err){
  console.log('Connected to the User database.');
  }
  if (err) throw err;
});
module.exports = userDB;