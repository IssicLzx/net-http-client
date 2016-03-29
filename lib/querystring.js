var eq = '=';
var and = '&';
function decode(key, item){
    var str = '';

    switch (typeof item) {

        case 'string' :
            str =  key + eq + item + and;
            break;

        case 'number':
            str =  key + eq + item.toString() + and;
            break;

        case 'object':

            if (Array.isArray(item)) {

                for(var i = 0 ; i < item.length ; i++){
                    str += decode(key+ '[' + i + ']',item[i]);
                }

            } else {
                for(var k in item){
                    str += decode(key+ '['+k +']',item[k]);
                }
            }

            break;
        default :
            ;
    }
    return str

}


module.exports.stringify = function(obj){

    var str = '';
    if (typeof obj == 'object'){

        for(var key in obj){
            str += decode(key, obj[key]);
        }

        return str;
    }else {
        return null;
    }

};