const express = require('express');

const router = express.Router();

module.exports = (param) => {
  const { speakers } = param;

  router.get('/', async (req, res) => {
    try {
      const promises = [];
      promises.push(speakers.getList());
      promises.push(speakers.getAllArtwork());

      const results = await Promise.all(promises);

      return res.render('speakers', {
        page: 'All Speakers',
        speakerslist: results[0],
        artwork: results[1],
      });
    } catch (err) {
      return err;
    }
  });

  router.get('/:name', async (req, res, next) => {
    try {
      const promises = [];
      promises.push(speakers.getSpeaker(req.params.name));
      promises.push(speakers.getArtworkForSpeaker(req.params.name));
      const results = await Promise.all(promises);

      if (!results[0]) {
        return next();
      }

      return res.render('speakers/detail', {
        page: req.params.name,
        speaker: results[0],
        artwork: results[1],
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
