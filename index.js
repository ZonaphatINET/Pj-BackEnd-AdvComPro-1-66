const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

const db = new sqlite3.Database('./Database/Player.sqlite');

app.use(express.json());
// app.use(express.static(__dirname + '/Myproject'));

// สร้างตาราง Club of Player
db.run(`CREATE TABLE IF NOT EXISTS ClubOfPlayer (
    ID INTEGER PRIMARY KEY,
    PlayerID TEXT,
    ClubID TEXT
)`);

// สร้างตาราง Player
db.run(`CREATE TABLE IF NOT EXISTS Player (
    ID INTEGER PRIMARY KEY,
    Name TEXT,
    Data TEXT,
    Pic TEXT
)`);

// สร้างตาราง Club
db.run(`CREATE TABLE IF NOT EXISTS Club (
    ID INTEGER PRIMARY KEY,
    Name TEXT,
    Data TEXT,
    Pic TEXT
)`);

// CRUD สำหรับ ClubOfPlayer ///////////////////////////////////////////////////////////////////////////////////////////
app.get('/ClubOfPlayer', (req, res) => {
    db.all('SELECT * FROM ClubOfPlayer', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

app.get('/ClubOfPlayer/:id', (req, res) => {
    db.get('SELECT * FROM ClubOfPlayer WHERE ID = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('ClubOfPlayer Not found');
            } else {
                res.json(row);
            }
        }
    });
});

app.post('/ClubOfPlayer', (req, res) => {
    const ClubOfPlayer = req.body;
    const ID = ClubOfPlayer.ID;
    const playerID = ClubOfPlayer.PlayerID;
    const clubID = ClubOfPlayer.ClubID;

    db.get('SELECT * FROM Player WHERE ID = ?', playerID, (err, player) => {
        if (err) {
            res.status(500).send(err);
        } else if (!player) {
            res.status(400).send('ไม่พบข้อมูล Player');
        } else {
            db.get('SELECT * FROM Club WHERE ID = ?', clubID, (err, club) => {
                if (err) {
                    res.status(500).send(err);
                } else if (!club) {
                    res.status(400).send('ไม่พบข้อมูล Club');
                } else {
                    db.run('INSERT INTO ClubOfPlayer (PlayerID, ClubID) VALUES (?, ?)', playerID, clubID, function (err) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            ClubOfPlayer.PlayerID = this.lastID;
                            res.send(ClubOfPlayer);
                        }
                    });
                }
            });
        }
    });
});

app.put('/ClubOfPlayer/:id', (req, res) => {
    const ClubOfPlayer = req.body;
    db.run('UPDATE ClubOfPlayer SET PlayerID = ?, ClubID = ? WHERE PlayerID = ?', ClubOfPlayer.PlayerID, ClubOfPlayer.ClubID, req.params.id, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(ClubOfPlayer);
        }
    });
});

app.delete('/ClubOfPlayer/:id', (req, res) => {
    db.run('DELETE FROM ClubOfPlayer WHERE PlayerID = ?', req.params.id, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({});
        }
    });
});

// CRUD สำหรับ Player ///////////////////////////////////////////////////////////////////////////////////////////
app.get('/Player', (req, res) => {
    db.all('SELECT * FROM Player', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

app.get('/Player/:id', (req, res) => {
    db.get('SELECT * FROM Player WHERE ID = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('Player Not found');
            } else {
                res.json(row);
            }
        }
    });
});

app.post('/Player', (req, res) => {
    const player = req.body;
    db.run('INSERT INTO Player (Name, Data, Pic) VALUES (?, ?, ?)', player.Name, player.Data, player.Pic, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            player.ID = this.lastID;
            res.send(player);
        }
    });

});

app.put('/Player/:id', (req, res) => {
    const player = req.body;
    db.run('UPDATE Player SET Name = ?, Data = ?, Pic = ? WHERE ID = ?', player.Name, player.Data, player.Pic, req.params.id, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(player);
        }
    });
});

app.delete('/Player/:id', (req, res) => {
    db.run('DELETE FROM Player WHERE ID = ?', req.params.id, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({});
        }
    });
});

// CRUD สำหรับ Club ///////////////////////////////////////////////////////////////////////////////////////////
app.get('/Club', (req, res) => {
    db.all('SELECT * FROM Club', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

app.get('/Club/:id', (req, res) => {
    db.get('SELECT * FROM Club WHERE ID = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('Club Not found');
            } else {
                res.json(row);
            }
        }
    });
});

app.post('/Club', (req, res) => {
    const habitat = req.body;
    db.run('INSERT INTO Club (Name, Data, Pic) VALUES (?, ?, ?)', habitat.Name, habitat.Data, habitat.Pic, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            habitat.ID = this.lastID;
            res.send(habitat);
        }
    });
});

app.put('/Club/:id', (req, res) => {
    const habitat = req.body;
    db.run('UPDATE Club SET Name = ?, Data = ?, Pic = ? WHERE ID = ?', habitat.Name, habitat.Data, habitat.Pic, req.params.id, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(habitat);
        }
    });
});

app.delete('/Club/:id', (req, res) => {
    db.run('DELETE FROM Club WHERE ID = ?', req.params.id, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({});
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

