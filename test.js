"use strict";
let request = require('./new_app');

request({

    url: 'http://127.0.0.1:3000/upload',
    method: 'GET',
    qs : {abc : 'abc'},
    form : {
        a: 'a',
        b: '中文测试啊啊啊'
    },
    headers : {
    }
}).then(function(ret){
    console.log(ret);
}).catch(err => {
    console.log(err.stack);
});