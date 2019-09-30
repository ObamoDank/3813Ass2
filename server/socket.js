const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

module.exports = {
    connect: function (app, io, db) {
        MongoClient.connect(url, { poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
            if (err) {
                return console.log(err);
            }

            const dbName = "tree";
            const db = client.db(dbName);

            // Start Sockets

            io.on("connection", (socket) => {
                console.log("user connection on port " + PORT + " : " + socket.id);

            });
        });
    }
}