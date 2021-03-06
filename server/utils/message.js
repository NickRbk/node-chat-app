const moment = require('moment');

// generate different messages
let generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

let generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  };
};

let generateMediaMessage = (from, base64) => {
  return {
    from,
    media: base64,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMessage, generateLocationMessage, generateMediaMessage};
