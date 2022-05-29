const db = require("../models");
const Album = db.albums;
const Artist = db.artists
const Song = db.songs
const Op = db.Sequelize.Op;
// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  
  // Create a Tutorial
  const tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  };
  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};
// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  //const title = req.query.title;
  //var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  Album.findAll({
    include: [
      { model: db.artists, as: 'artist' },]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving albums."
      });
    });
};
// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Tutorial.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tutorial with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};
// Update a Album by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  if (req.body.artist) {
    Artist.update({ artist: req.body.artist }, {
      where: { albumId: id }
    })
      .then(num => {
        console.log("ss",num)
        if (num == 1) {
          console.log("artist name updated successfully")
        return  res.send({
          message: "artist name updated successfully"
        })
        
        } else {
          console.log("Error updating Artist name ")
          return res.send({
          message:  'Error updating Artist name'
          })
        }
        //update artist name

      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Album with id=" + id
        });

      });
  }else{
    Album.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Album was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Album with id=${id}. Maybe Album was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Album with id=" + id
        });
      });
  }
 
};

// Delete a Album with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Album.destroy({
    where: { id: id }
  })
    .then(async num => {
      if (num == 1) {
        //delete artist 
      await  Artist.destroy({
          where:{albumId:id}
        })
        //destroy songs with this albumId
      await  Song.destroy({
          where:{albumId:id}
        })
      await  res.send({
          message: "Album was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Album with id=${id}. Maybe Album was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};
// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};
// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Tutorial.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};