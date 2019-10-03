// Route handles image uploads

module.exports = function (app, formidable) {
    app.post('/uploadFile', function (req, res) {

        console.log("Welcome, give me your hentai");
        let form = new formidable.IncomingForm({ uploadDir: './images' });
        form.keepExtensions = true;

        form.on('error', function (err) {
            throw (err);
            res.send({
                result: "failed",
                data: {},
                numberOfImages: 0,
                message: "Cannot Upload Images. Error is:" + err
            });
        });

        form.on("fileBegin", function (name, file) {
            file.path = form.uploadDir + "/" + file.name;
        });

        form.on("file", function (field, file) {
            res.send({
                result: "OK",
                data: { filename: file.name, size: file.size },
                numberOfImages: 1,
                message: "Upload Successful"
            });
        });

        form.parse(req);
    });
}