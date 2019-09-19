const fs = require("fs");

// Module adds new user object to database if user does not already exist.

module.exports = function (app, path) {
    app.post("/newUser", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let newUser = {
            "username": req.body.newUser,
            "email": req.body.newEmail,
            "role": req.body.newRole
        }

        let userExists = false;
        let users = [];

        console.log("Made it to New User.. Get comfortable..");
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.users.length; i++) {
                if (allData.users[i].username == newUser.username) {
                    userExists = true;
                }
            }
            if (!userExists) {
                allData.users.push(newUser);
                users = allData.users;
                allDataJson = JSON.stringify(allData);
                fs.writeFile("./data.json", allDataJson, "utf-8", function (err) {
                    if (err) {
                        throw err;
                    }
                });
                res.send(users);
            } else {
                res.send({ error: "User exists breh" });
            }
        });
    });
}