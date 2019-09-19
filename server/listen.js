
//Module provides server port at 3000

module.exports = function (app, path) {
    const http = require("http").Server(app);

    let server = http.listen(3000, function (req, res) {
        console.log("Server up...");
    })
}