var http = require('http');
var url = require('url');

var PORT = 3000;

http.createServer(function (req, res) {

    var params = url.parse(req.url, true);
    var callback = params.query && params.query.callback;
    console.log(callback);
    if (callback) {
        res.end(callback + '({"msg":"this is jsonp callback!"})');
    }

    res.end('ok');
}).listen(PORT, function () {
    console.log('server is listening on port ' + PORT);
});

