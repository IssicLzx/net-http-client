var querystring = require('./lib/querystring');
const net = require('net');

var request = function(opts){

    var url = opts.url;
    var qs = opts.qs;
    var form = opts.form;
    var headers = opts.headers;

    if ( !(opts.method == 'GET' || opts.method == 'POST') ){
        return console.error('method is error');
    }
    var urlRegex = /^(\w+):\/\/([^/:]+):?(\d*)?([^# ]*)$/;
    var urlParamsArr = urlRegex.exec(url);

    if (urlParamsArr[0] == undefined || urlParamsArr[0] == ''){
        return console.error('url is error');
    }

    var protocol = urlParamsArr[1];
    var host = urlParamsArr[2];
    var port = parseInt( urlParamsArr[3]);
    var path = urlParamsArr[4];


    var client = net.connect( {host: host , port: port || 80}, () => {

        console.log('connect');
        var head = '';
        var body = '';
        var qsParams = '';

        if (qs){
           qsParams = querystring.stringify(qs);
        }

        head += opts.method + ' ' + path + '?' + qsParams + ' HTTP/1.1\r\n';

        for (var key in headers ){
            head += key +': ' + headers[key] + '\r\n';
        }


        if(form){
            head += 'Content-Length: ' + ( JSON.stringify(form).length + 1)+'\r\n';
            body +=  JSON.stringify(form);
        }

        head += '\r\n';
        body += '\n';

        client.write(head + body);
    });

    client.on('data', (data) => {

        var headerIndex = 0;
        for(var i = 0 ; i < data.length ; i++){

            if (data[i] == 0x0d && data[i +1 ]== 0x0a && data[i + 2] == 0x0d && data[i + 3 ]== 0x0a   ){
                headerIndex = i;
                break;
            }
        }

        var headerBuf = new Buffer(headerIndex);
        data.copy(headerBuf, 0, 0, headerIndex);
        var headersArray = headerBuf.toString().split('\r\n');
        var headerObject = new Object(),
            statusCode;

        for(var i = 0; i < headersArray.length ; i++){
            if (i == 0){
                statusCode = headersArray[i].split(' ')[1];
            } else {
                var headerParams =  headersArray[i].split(': ');
                headerObject[headerParams[0]] = headerParams[1];
            }
        }

        var bodyBuf = new Buffer(parseInt(headerObject['Content-Length']));

        data.copy(bodyBuf, 0, headerIndex + 4, data.length);

        console.log(statusCode);
        console.log(headerObject);
        console.log(bodyBuf);

        client.end();
    });

    client.on('error', function(err){
        console.log('err : ', err);
    })
};

//var url = 'http://tool.oschina.net';

request({

    url: 'http://127.0.0.1:3001/common/token',
    method: 'GET',
    qs : {abc : 'abc'},
    form : {
        a: 'a'
    },
    headers : {
        "Content-Type" : 'application/json'
    }
});