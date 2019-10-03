const express = require("express");
const app = express();
const formidable = require("formidable");
const path = require("path");


const whitelist = ['http://localhost:4200']; // Set a whitelist of routes
const corsOptions = {   // Create Object with options to change within Cors
  credentials: true,
  origin: (origin, callback) => {
    if(whitelist.includes(origin)) // <----------- Whitelist
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}
const cors = require("cors");
const bodyparser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
const http = require("http").Server(app);
const io = require("socket.io")(http); //<----------- Socket Standard require
const sockets = require("./socket.js");
app.use('./images', express.static(path.join(__dirname, './images')));
app.use(express.static(path.join(__dirname, '../weAreTree/dist/weAreTree')))
io.set('origins', 'http://localhost:4200'); // <-------------- Set io origin

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());  // <---------------- Use Cors
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
    require("./routes/other/checkUser.js")(app, db);
    require("./routes/create/newUser.js")(app, db);
    require("./routes/destroy/destroyUser.js")(app, db);
    require("./routes/changeRole/promoteUser.js")(app, db);
    require("./routes/fetch/fetchUser.js")(app, db);
    require("./routes/fetch/fetchRole.js")(app, db);
    require("./routes/fetch/fetchUsers.js")(app, db);
    require("./routes/create/newGroup.js")(app, db);
    require("./routes/destroy/destroyGroup.js")(app, db);
    require("./routes/fetch/fetchGroups.js")(app, db);
    require("./routes/create/newChannel.js")(app, db);
    require("./routes/destroy/destroyChannel.js")(app, db);
    require("./routes/invite/inviteGroup.js")(app, db);
    require("./routes/revoke/revokeGroup.js")(app, db);
    require("./routes/invite/inviteChannel.js")(app, db);
    require("./routes/revoke/revokeChannel.js")(app, db);
    require("./routes/changeRole/newAssis.js")(app, db);
    require("./routes/changeRole/newAdmin.js")(app, db);
    require("./routes/fetch/fetchMessages.js")(app, db);
    require("./routes/other/uploadFile.js")(app, formidable);

});