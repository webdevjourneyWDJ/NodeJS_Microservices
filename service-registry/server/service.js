const express = require('express');
const ServiceRegistry = require('./lib/ServiceRegistry');

const service = express();

module.exports = (config) => {
  const log = config.log();
  const serviceRegisrty = new ServiceRegistry(log);

  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  service.put('/register/:servicename/:serviceversion/:serviceport', (req, res) => {
    const {servicename, serviceversion, serviceport} = req.params;

    const serviceip = req.connection.remoteAddress.includes('::') ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

    const serviceKey = serviceRegisrty.register(servicename, serviceversion, serviceip, serviceport);

    return res.json({result: serviceKey})
  })

  service.delete('/unregister/:servicename/:serviceversion/:serviceport', (req, res) => {
    const {servicename, serviceversion, serviceport} = req.params;

    const serviceip = req.connection.remoteAddress.includes('::') ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

    const serviceKey = serviceRegisrty.unregister(servicename, serviceversion, serviceip, serviceport);

    return res.json({result: `Deleted ${serviceKey}`})
  })

  service.get('/find/:servicename/:serviceversion', (req, res) => {
    const {servicename, serviceversion} = req.params;
    const svc = serviceRegisrty.get(servicename, serviceversion);
    if(!svc) return res.status(404).json({result: "Service not found"});
    return res.json(svc);
  })

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
