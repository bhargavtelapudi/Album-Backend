module.exports = app => {
    const artists = require("../controllers/artist.controller");
    var router = require("express").Router();
    // Create a new Artist
    router.post("/", artists.create);
    // Retrieve all artists
  router.get("/", artists.findAll);
    // Retrieve a single Tutorial with id
    router.get("/:artist", artists.findOne);
  // Delete a Lesson with id
  router.delete("/:artist", artists.delete);
    app.use('/api/artists', router);
  };