// module returns role of current user

module.exports = function (app, db) {
    app.post("/fetchRole", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let username = req.body.username;
        let role = ""

        console.log("Made it to Fetch Role.. Come in, kick back..");
        const collection = db.collection("users");
        collection.find({}).toArray((err, users) => {
            for (let i = 0; i < users.length; i++) {
                if (username == users[i].username) {
                    role = users[i].role;
                    res.send({ "role": role });
                }
            }
        });

    });
}