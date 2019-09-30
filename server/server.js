const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
let http = require("http").Server(app);
const io = require("socket.io")(http);
const sockets = require("./socket.js");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

// app.use(express.static(path.join(__dirname + '../weAreTree/dist/weAreTree')));
const url = "mongodb://localhost:27017";
MongoClient.connect(url, { poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err){
        return console.log(err);
    }

    const dbName = "tree";
    const db = client.db(dbName);

    sockets.connect(app, io, db);

    require("./listen.js")(app, db);
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
});