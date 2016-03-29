const net = require('net');
const client = net.connect({port: 3000}, () => {

client.write('GET / HTTP/1.1\r\n'+
    //'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\n' +
    'Host:127.0.0.1:3000\r\n' +
    //'Connection: keep-alive\r\n'+
    //'Cache-Control: max-age=0\r\n'+
    '\r\n');
    });



client.on('data', (data) => {


    //var str =  data.toString();
    //var arr = str.split('\r\n\r\n');
    //var headers = arr[0];
    //var body = arr[1];
    //var headerObject = new Object();
    //var headersArray = headers.split('\r\n');
    //var statusCode;
    //
    //for(var i = 0; i < headersArray.length ; i++){
    //    if (i == 0){
    //        statusCode = headersArray[i].split(' ')[1];
    //    } else {
    //        var headerParams =  headersArray[i].split(': ');
    //        headerObject[headerParams[0]] = headerParams[1];
    //    }
    //}

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


client.on('end', () => {
    console.log('disconnected from server');
});