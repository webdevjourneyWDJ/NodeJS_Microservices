const express = require('express');

const service = express();

module.exports = (config) => {
  const log = config.log();
  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  service.get('/list', (req, res, next) => {
    return next('Not implemented');
  });

  service.get('/list-short', (req, res, next) => {
    return next('Not implemented');
  });

  service.get('/names', (req, res, next) => {
    return next('Not implemented');
  });

  service.get('/speaker/:shortname', (req, res, next) => {
    return next('Not implemented');
  });

  service.get('/artwork/:shortname', (req, res, next) => {
    return next('Not implemented');
  });

  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
  return service;
};
