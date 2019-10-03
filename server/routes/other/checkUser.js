// Module Checks username for login. If Username exists, data returned is true and user may access App.

module.exports = function (app, db) {
    app.post("/checkUser", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let username = req.body.username;
        let password = req.body.password;
        let userValid = {
            exists: false,
            pass: false
        }

        console.log("Made it to Check User.. Enjoy a cold Brew...");
        const userData = db.collection("users");
        userData.find({}).toArray((err, users) => {
            for (let i = 0; i < users.length; i++) {
                if (username == users[i].username) {
                    userValid.exists = true;
                }
                if (username == users[i].username && password == users[i].password) {
                    userValid.exists = true;
                    userValid.pass = true;
                }
            }
            res.send(userValid);

        }); 
    });
}