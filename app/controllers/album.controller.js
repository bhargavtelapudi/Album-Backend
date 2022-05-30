const db = require("../models");
const Album = db.albums;
const Artist = db.artists
const Song = db.songs
const Op = db.Sequelize.Op;


// Create and Save a new Albuml
exports.create = async(req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  //artist name mandatory
  if (!req.body.artist) {
    res.status(400).send({
      message: "artist name cannot not be empty!"
    });
    return;
  }
  // Create a album
  const album = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  };

  

  let response;
  // Save Album in the database
  await Album.create(album)
    .then(data => {
      response = data.dataValues
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Album."
      });
    });

    //create Artist
  const artist = {
    artist : req.body.artist,
     albumId:response.id
  }
      // Save Atist in the database
     await Artist.create(artist)
    .then(data => {
      response.artist = data.artist
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Album."
      });
    });
    
res.send(response)
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
exports.findOne = async(req, res) => {
  const id = req.params.id;
  Album.findAll({
    where:{id:id},
    include:[
    { model: db.songs, as: 'song' }]
  })
    .then(async data => {
      if (data) {
        let artist = await Artist.findOne({
          where:{albumId:id}
         })
        return res.send({
          data,
          artist:artist.artist
        })
        
      } else {
        res.status(404).send({
          message: `Cannot find Album with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Album with id=" + id
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
// Delete all Albums from the database.
exports.deleteAll = (req, res) => {
  Album.destroy({
    where: {},
    truncate: false
  })
    .then(async nums => {
      //delete all songs
     await Song.destroy({
        where:{},
        truncate:false
      })
      //delete all artists
      await Artist.destroy({
        where:{},
        truncate:false
      })
      res.send({ message: `${nums} Albums were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Albums."
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