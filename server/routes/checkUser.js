const fs = require("fs");

// Module Checks username for login. If Username exists, data returned is true and user may access App.

module.exports = function (app, path) {
    app.post("/checkUser", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let username = req.body.username;
        let users = [];
        let userValid = false;

        console.log("Made it to Check User.. Enjoy a cold Brew...");
        fs.readFile("./data.json", "utf8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            users = allData.users;
            for (let i = 0; i < users.length; i++) {

                if (username == users[i].username) {
                    userValid = true
                }
            }
            res.send(userValid);
        });
    });
}