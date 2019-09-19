const fs = require("fs");

// Module removes specified value from database

module.exports = function (app, path) {
    app.post("/destroyUser", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let username = req.body.username;
        let users = [];

        console.log("Made it to Destroy User... Kick back..");
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.users.length; i++) {
                if (allData.users[i].username == username) {
                    allData.users.splice([i], 1);
                }
            }
            users = allData.users;
            let allDataJson = JSON.stringify(allData);
            fs.writeFile("./data.json", allDataJson, "utf-8", function (err) {
                if (err) {
                    throw err;
                }
            });
            res.send(users);
        });
    });
}