const fs = require("fs");

// Module returns an array containing all user objects

module.exports = function (app, path) {
    app.post("/fetchUsers", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let users = {};

        console.log("Made it to Fetch Users Plural.. Roll a Doobskin.. ");
        fs.readFile("./data.json", "utf8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            users = allData.users;
            res.send(users);
        });
    });
}