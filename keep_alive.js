var http = require('http');

http.createServer(function (req, res) {
  res.write("BFLxMusic - I'm up baby!");
  res.end();
}).listen(8080);
