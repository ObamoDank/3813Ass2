const fs = require("fs");

// module returns role of current user

module.exports = function (app, path) {
    app.post("/fetchRole", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let username = req.body.username;
        let role = ""

        console.log("Made it to Fetch Role.. Come in, kick back..");
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.users.length; i++) {
                if (allData.users[i].username == username) {
                    role = allData.users[i].role;
                }
            }
            let sendObj = { "role": role };
            res.send(sendObj);
        })

    });
}