/**
 * Created by harrylang on 16/5/18.
 */
var express = require('express');
var path = require('path');
var formidable = require('formidable');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/upload', function (req, res, next) {

    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'upload';
    form.keepExtensions = true;
    form.maxFieldsSize = 2 * 1024 * 1024; // 2M

    form.parse(req, function (err, fields, files) {
        if (err) {
            return next(err);
        }

        console.log(files);

        res.json(fields);


    });
});

app.listen(3000);