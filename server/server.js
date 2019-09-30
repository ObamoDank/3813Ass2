const express = require("express");
const app = express();
const whitelist = ['http://localhost:4200'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}
const cors = require("cors");
const bodyparser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
const http = require("http").Server(app);
const io = require("socket.io")(http);
const sockets = require("./socket.js");
io.set('origins', 'http://localhost:4200');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header('Access-Control-Allow-Credentials', true);
    next(); 
}); 

// app.use(express.static(path.join(__dirname + '../weAreTree/dist/weAreTree')));
const url = "mongodb://localhost:27017";
MongoClient.connect(url, { poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err){
        return console.log(err);
    }

    const dbName = "tree";
    const db = client.db(dbName);

    sockets.connect(app, io, db);
    require("./listen.js")(http);
    require("./routes/checkUser.js")(app, db);
    require("./routes/newUser.js")(app, db);
    require("./routes/destroyUser.js")(app, db);
    require("./routes/promoteUser.js")(app, db);
    require("./routes/fetchUser.js")(app, db);
    require("./routes/fetchRole.js")(app, db);
    require("./routes/fetchUsers.js")(app, db);
    require("./routes/newGroup.js")(app, db);
    require("./routes/destroyGroup.js")(app, db);
    require("./routes/fetchGroups.js")(app, db);
    require("./routes/newChannel.js")(app, db);
    require("./routes/destroyChannel.js")(app, db);
    require("./routes/inviteGroup.js")(app, db);
    require("./routes/revokeGroup.js")(app, db);
    require("./routes/inviteChannel.js")(app, db);
    require("./routes/revokeChannel.js")(app, db);
    require("./routes/newAssis.js")(app, db);
    require("./routes/newAdmin.js")(app, db);
    require("./routes/fetchMessages.js")(app, db);

});