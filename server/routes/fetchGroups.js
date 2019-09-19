let fs = require("fs");

// Module returns list of all groups in database

module.exports = function (app, path) {
    app.post("/fetchGroups", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }
        msg = req.body.message;
        groups = []

        console.log("Made it to Fetch Groups.. Put your feet up..")
        console.log(msg);
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            groups = allData.groups;
            res.send(groups);
        });
    });
}
