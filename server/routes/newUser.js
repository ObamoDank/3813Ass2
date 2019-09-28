// Module adds new user object to database if user does not already exist.

module.exports = function (app, db) {
    app.post("/newUser", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let newUser = {
            "username": req.body.newUser,
            "password": req.body.newPass,
            "email": req.body.newEmail,
            "role": req.body.newRole,
            "img": 'not yet'
        }

        let userExists = false;

        console.log("Made it to New User.. Get comfortable..");
        const userData = db.collection("users");
        userData.find({}).toArray(async (err, users) => {
            for (let i = 0; i < users.length; i++) {
                if (users[i].username == newUser.username) {
                    userExists = true;
                }
            }
            if (!userExists) {
                await userData.insertOne(newUser);
                res.send({ msg: "New User Created" })
            }
            else {
                res.send({ error: "User exists breh" });
            }
        });
    });
}