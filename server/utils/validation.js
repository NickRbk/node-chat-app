// validate input data
let isRealString = string => typeof string === 'string' && string.trim().length > 0;

module.exports = {isRealString};
