const db = require("../models");
const Album = db.albums;
const Artist = db.artists
const Song = db.songs
const Op = db.Sequelize.Op;

// Create and Save a new Artist
exports.create = async(req, res) => {
   
    //artist name mandatory
    if (!req.body.artist) {
      res.status(400).send({
        message: "artist name cannot not be empty!"
      });
      return;
    }
      //create Artist
    const artist = {
      artist : req.body.artist
    }
        // Save Atist in the database
       await Artist.create(artist)
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the artist."
        });
      }); 
  };

  // Retrieve all Artist data from the database.
exports.findAll = (req, res) => {
    //const artist = req.query.artist;
   // var condition = artist ? { artist: { [Op.like]: `%${artist}%` } } : null;
    Artist.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving artists."
        });
      });
  };

 // Find a single artist and his albums with an id
exports.findOne = async(req, res) => {
  const artist = req.params.artist;
  let artist_details ={
    artist:artist
  };
  Artist.findAll({
    where:{artist:artist}
  })
    .then(async data => {
      if (data) {
        artist_details.albums =[]
        for(let i=0;i<data.length;i++){
          await Album.findOne({
            where:{id:data[i].dataValues.albumId}
          }).then((data)=>{
            if (data == null) {
              artist_details.albums = []
            } else {
              artist_details.albums.push(data.dataValues)
            }
          })

       }
       return res.send(artist_details)
      } else {
        res.status(404).send({
          message: `Cannot find Album with id=.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Album with id="
      });
    });

    };