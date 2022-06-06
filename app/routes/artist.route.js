module.exports = app => {
    const artists = require("../controllers/artist.controller");
    var router = require("express").Router();
    // Create a new Artist
    router.post("/", artists.create);
    // Retrieve all artists
  router.get("/", artists.findAll);
    app.use('/api/artists', router);
  };