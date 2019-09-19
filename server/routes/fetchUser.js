const fs = require("fs");

// Module returns data object for current user

module.exports = function (app, path) {
    app.post("/fetchUser", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let username = req.body.username;
        let user = {};

        console.log("Made it to Fetch User Singular.. Put your feet Up..");
        fs.readFile("./data.json", "utf8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.users.length; i++) {
                if (allData.users[i].username == username) {
                    user = allData.users[i];
                }
            }
            res.send(user);
        });
    });
}