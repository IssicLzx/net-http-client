var querystring = require('./lib/querystring');

var request = function(opts){

    var head = '';
    var url = opts.url;
    if (opts.method == 'GET' || opts.method == 'POST'){
        return console.error('method is error');
    }
    var urlRegex = /^(\w+):\/\/([^/:]+)(:\d*)?([^# ]*)$/;
    var urlParamsArr = urlRegex.exec(url);

    if (urlParamsArr[0] == undefined || urlParamsArr[0] == ''){
        return console.error('url is error');
    }

    var protocol = urlParamsArr[1];
    var host = urlParamsArr[2];
    var port = urlParamsArr[3];
    var path = urlParamsArr[4];


    head += opts.method + ' ' + path + ' HTTP/1.1\r\n'
};

var urlRegex = /^([a-zA-z]+):\/\/([^/:]+)(:\d*)?([^# ]*)$/;
//var urlRegex= new RegExp('[a-zA-z]+\/[a-zA-z\/]*');
//var url ='http://www.w3cschool.cc:80/html/html-tutorial.html';
var url = 'http://tool.oschina.net';

console.log( urlRegex.exec(url));