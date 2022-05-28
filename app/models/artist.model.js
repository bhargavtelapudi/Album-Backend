module.exports = (sequelize, Sequelize) => {
  const Artist = sequelize.define("artist", {
    artist: {
      type: Sequelize.STRING
    },
    
  });
  return Artist;
};
