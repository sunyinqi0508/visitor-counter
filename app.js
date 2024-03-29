var express = require("express");
var parser = require("body-parser");
var fs = require("fs");
var time = require('time');

var app = express();
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.get('/', function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('Statistic Interface.');
    response.end();
});
var cnt = 0;
var firstrun = 1;
app.post('/', function (request, response) {
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    if (firstrun) {
	try{
        	var buffer = fs.readFileSync('counter.txt',encoding = 'utf8', flag = 'r');
	        var _cnt = cnt;
	        try {
	          //  console.log(buffer.toString());
        	    _cnt = parseInt(buffer.toString('utf-8'));
	        } catch (error) {
        	}
	        if (!isNaN(_cnt))
        	    cnt = _cnt;
	}catch(error){}
        firstrun = 0;
    }
    ++cnt;
    var infwrite = function () {
        fs.writeFile('counter.txt', cnt, function (err) {
            if (err) {
                console.log('write counter error! ' + err.message);
                infwrite();
            }
        });
    };
    infwrite();
    var curr_time = new time.Date(Date.now());
    curr_time.setTimezone('America/New_York');
    
    fs.appendFile('stats.txt', ip + '\t' + curr_time.toString() + 
	    '\t' + request.get('User-Agent') + '\n', function (err) {
        if (err)
            console.log('write stats error! ' + err.message);
    });

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.send()
});
app.listen(50895);
