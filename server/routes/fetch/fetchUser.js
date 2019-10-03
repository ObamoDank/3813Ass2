// Module returns data object for current user

module.exports = function (app, db) {
    app.post("/fetchUser", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let username = req.body.username;
        console.log(username);
        let user = {};

        console.log("Made it to Fetch User Singular.. Put your feet Up..");
        const userData = db.collection("users");
        userData.find({}).toArray((err, users) => {
            for (let i = 0; i < users.length; i++) {
                if (username == users[i].username) {
                    user = users[i];
                    res.send(user);
                }
            }
        });
    });
}