const path = require('path');

module.exports = {
  development: {
    sitename: 'Art Meetups [Development]',
    serviceRegisrtyUrl: "http://localhost:3000",
    serviceVersion: "1.x.x",
    data: {
      feedback: path.join(__dirname, '../data/feedback.json'),
    },
  },
  production: {
    sitename: 'Art Meetups',
    serviceRegisrtyUrl: "http://localhost:3000",
    serviceVersion: "1.x.x",
    data: {
      feedback: path.join(__dirname, '../data/feedback.json'),
    },
  },
};
