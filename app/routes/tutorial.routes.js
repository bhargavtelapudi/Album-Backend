module.exports = app => {
  const albums = require("../controllers/tutorial.controller.js");
  var router = require("express").Router();
  // Create a new Tutorial
  router.post("/", albums.create);
  // Retrieve all albums
  router.get("/", albums.findAll);
  // Retrieve all published albums
  router.get("/published", albums.findAllPublished);
  // Retrieve a single Tutorial with id
  router.get("/:id", albums.findOne);
  // Update a Tutorial with id
  router.put("/:id", albums.update);
  // Delete a Tutorial with id
  router.delete("/:id", albums.delete);
  // Delete all albums
  router.delete("/", albums.deleteAll);
  app.use('/api/albums', router);
};