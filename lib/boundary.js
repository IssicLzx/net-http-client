var getBoundary = function(){
    var max = 9007199254740992;
    var dec = Math.random() * max;
    var hex = dec.toString(36);
    var boundary = hex;
    return boundary;
};

module.exports = getBoundary;