const db = require("../models");
const Song = db.songs;
const Op = db.Sequelize.Op;
// Create and Save a new Song
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Song
  const song = {
    albumId: req.params.albumId,
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  };
  // Save Song in the database
  Song.create(song)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the song."
      });
    });
};

//search songs.
exports.searchSong = (req, res) => {
  const title = req.query.title;
  var condition = title ? {
    title: {
      [Op.like]: `%${title}%`
    }
  } : null;

  Song.findAll(
    { where: condition,albumId:req.params.albumId }
    )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while searching songs."
      });
    });
};
// Find a single song with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Song.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find song with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving song with id=" + id
      });
    });
};
// Update a Lesson by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Song.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Song was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Song with id=${id}. Maybe Song was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Song with id=" + id
      });
    });
};
// Delete a Song with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Song.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Song was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Song  with id=${id}. Maybe song was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Song wongith id=" + id
      });
    });
};
// Delete all Lessons from the database.
exports.deleteAll = (req, res) => {
  console.log("req",req.params.albumId)
  Song.destroy({
    where: {albumId:req.params.albumId},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `All Songs were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all songs."
      });
    });
};
// Find all published Lessons
exports.findAllPublished = (req, res) => {
  const lessonId = req.query.lessonId;

  Lesson.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving lessons."
      });
    });
};