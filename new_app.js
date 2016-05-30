"use strict";

const Boundary = require('./lib/boundary');
const net = require('net');
const urlRegex =  /^(\w+):\/\/([^/:]+):?(\d*)?([^# ]*)$/;
const querystring = require('querystring');

module.exports = (opts) => {

    let url = opts.url,
        qs = opts.qs,
        form = opts.form,
        headers = opts.headers,
        method = opts.method;

    if ( ! (url && typeof url === 'string') ){
        return Promise.reject(new Error('url is error'));
    }

    let urlParamsArray = urlRegex.exec(url),
        protocol = urlParamsArray[1],
        host = urlParamsArray[2],
        port = urlParamsArray[3],
        path = urlParamsArray[4];

    let client = net.connect( {host: host , port: port || 80}, () => {

        var head = '';
        var body = '';
        var qsParams = '';

        if (qs){
            qsParams = querystring.stringify(qs);
        }

        head += opts.method + ' ' + path + '?' + qsParams + ' HTTP/1.1\r\n';
        var boundary = Boundary();
        head += 'Content-Type: multipart/form-data; boundary=' + boundary +'\r\n';

        for (var key in headers ){
            head += key +': ' + headers[key] + '\r\n';
        }

        if(form){
            for(var key in form){
                body += '--' + boundary + '\r\n';
                body += 'Content-Disposition: form-data; name="'+ key +'"\r\n';
                body += '\r\n';
                body += form[key] + '\r\n';

            }
            body += '--' + boundary + '--\r\n';
        }
        var body_buffer = new Buffer(body, 'utf-8');
        console.log( body_buffer.length , body_buffer);

        head += 'Content-Length: ' + body_buffer.length +'\r\n';
        head += '\r\n';



        var head_buffer = new Buffer(head, 'utf-8');
        console.log(head_buffer.length);
        console.log(Buffer.concat([head_buffer,body_buffer]).length);

        client.write(Buffer.concat([head_buffer,body_buffer]));

    })


    return new Promise( ( resolve, reject) => {

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

            var ret = {
                statusCode : statusCode,
                headerObject : headerObject,
                bodyBuf : bodyBuf
            };
            client.end();
            resolve(ret);

        });

        client.on('error', err => {
            reject(err);
        })
    });

};

