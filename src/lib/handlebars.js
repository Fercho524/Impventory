const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp);
};

helpers.multiply=(a,b)=>{
    return a*b;
}

module.exports = helpers;