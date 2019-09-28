// Module returns an array containing all user objects

module.exports = function (app, db) {
    app.post("/fetchUsers", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        console.log("Made it to Fetch Users Plural.. Roll a Doobskin.. ");
        const userData = db.collection("users");
        userData.find({}).toArray((err, users) => {
            res.send(users);
        })
    });
}