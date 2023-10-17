const express = require("express");
const Sequelize = require("sequelize");
const app = express();

// parse incoming requests
app.use(express.json());

// connect to the database
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: './Database/Project.sqlite'
});

// Define the 'clubs' model
const Clubs = sequelize.define('clubs', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Define the 'players' model
const Players = sequelize.define('players', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Playerdata = sequelize.define('playerdata', {
  idclubs: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  idplayer: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

Clubs.hasMany(Playerdata, { foreignKey: 'idclubs' });
Players.hasMany(Playerdata, { foreignKey: 'idplayer' });

// Create the tables if they don't exist
sequelize.sync();

// start the server
const port = process.env.PORT || 5300;
app.listen(port, () => { console.log(`Listening on port ${port}...`); });

app.get("/clubs", (req, res) => {
  Players.findAll().then(players => {
    res.json(players);
  }).catch(err => {
    res.status(500).send(err);
  });
});

// Define routes and database operations as needed
app.post("/clubs", (req, res) => {
  Clubs.create(req.body).then(club => {
    res.send(club);
  }).catch(err => {
    res.status(500).send(err);
  });
});

app.put("/clubs/:id", (req, res) => {
  Clubs.findByPk(req.params.id).then(club => {
    if (!club) {
      res.status(404).send('Club not found');
    } else {
      club.update(req.body).then(() => {
        res.send(club);
      }).catch(err => {
        res.status(500).send(err);
      });
    }
  }).catch(err => {
    res.status(500).send(err);
  });
});

app.delete("/clubs/:id", (req, res) => {
  Clubs.findByPk(req.params.id).then(club => {
    if (!club) {
      res.status(404).send('Club not found');
    } else {
      club.destroy().then(() => {
        res.send({});
      }).catch(err => {
        res.status(500).send(err);
      });
    }
  }).catch(err => {
    res.status(500).send(err);
  });
});

app.get("/players", (req, res) => {
  Players.findAll().then(players => {
    res.json(players);
  }).catch(err => {
    res.status(500).send(err);
  });
});

app.post("/players", (req, res) => {
  Players.create(req.body).then(player => {
    res.send(player);
  }).catch(err => {
    res.status(500).send(err);
  });
});

app.put("/players/:id", (req, res) => {
  Players.findByPk(req.params.id).then(player => {
    if (!player) {
      res.status(404).send('Player not found');
    } else {
      player.update(req.body).then(() => {
        res.send(player);
      }).catch(err => {
        res.status(500).send(err);
      });
    }
  }).catch(err => {
    res.status(500).send(err);
  });
});

app.delete("/players/:id", (req, res) => {
  Players.findByPk(req.params.id).then(player => {
    if (!player) {
      res.status(404).send('Player not found');
    } else {
      player.destroy().then(() => {
        res.send({});
      }).catch(err => {
        res.status(500).send(err);
      });
    }
  }).catch(err => {
    res.status(500).send(err);
  });
});

app.get("/playerdata", (req, res) => {
  Playerdata.findAll({
    include: [
      {
        model: Clubs,
        as: 'clubs',
        attributes: ['id', 'name']
      },
      {
        model: Players,
        as: 'players',
        attributes: ['id', 'name']
      }
    ]
  }).then(data => {
    res.json(data);
  }).catch(err => {
    res.status(500).send(err);
  });
});

// ... (Add other necessary routes and operations here)
