
//Module provides server port at 3000

module.exports = function (http) {

    http.listen(3000, function (req, res) {
        console.log("Server up...");
    })
}