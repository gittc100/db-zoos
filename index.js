const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const knexConfig = require("./knexfile.js");
const server = express();

server.use(express.json());
server.use(helmet());

// Connect to the Configured DataBase

const db = knex(knexConfig.development);

// endpoints here
server.get("/", (req, res) => {
  res.send("api working");
});

// get all zoos
server.get("/api/zoos", (req, res) => {
  db("zoos")
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
// post to zoos
server.post("/api/zoos", (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ Error_Message: "Provide Zoo Name" });
  } else {
    db("zoos")
      .insert(req.body)
      .then(id => {
        res.status(201).json(id);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
});
// get specific zoo
server.get("/api/zoos/:zooID", (req, res) => {
  db("zoos")
    .where({ id: req.params.zooID })
    .then(zoo => {
      if (zoo.length > 0) {
        res.status(200).json(zoo);
      } else {
        res
          .status(404)
          .json({ Error_Message: "Zoo with this id does not exist!" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
// delete zoo by id
server.delete("/api/zoos/:zooID", (req, res) => {
  db("zoos")
    .where({ id: req.params.zooID })
    .del()
    .then(count => {
      if (count === 1) {
        res.status(200).json(count);
      } else {
        res
          .status(404)
          .json({ Error_Message: "Zoo with this id does not exist!" });
      }
    })
    .catch(err => res.status(500).json(err));
});
// update zoo by id
server.put("/api/zoos/:zooID", (req, res) => {
  db("zoos")
    .where({ id: req.params.zooID })
    .update(req.body)
    .then(count=>{
      console.log(isInt(count));
      if (count) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: 'Zoo not found' });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.get('/api/bears', (req, res) => {
  db('bears')
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(err => res.status(500).json(err));
});

server.get('/api/bears/:id', (req, res) => {
  db('bears')
    .where({ id: req.params.id })
    .then(bear => {
      if (bear) {
        res.status(200).json(bear);
      } else {
        res.status(404).json({ message: 'bear not found' });
      }
    });
});

// add panda
server.post('/api/bears', (req, res) => {
  // db.insert(req.body).into('bears').then().catch()
  db('bears')
    .insert(req.body)
    .then(ids => {
      db('bears')
        .where({ id: ids[0] })
        .then(bear => {
          res.status(201).json(bear);
        });
    })
    .catch(err => res.status(500).json(err));
});

// delete panda
server.delete('/api/bears/:id', (req, res) => {
  db('bears')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      res.status(200).json(count);
    })
    .catch(err => res.status(500).json(err));
});

server.put('/api/bears/:id', (req, res) => {
  const changes = req.body;

  db('bears')
    .where({ id: req.params.id })
    .update(changes)
    .then(count => {
      if (count) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: 'Bear not found' });
      }
    })
    .catch(err => res.status(500).json(err));
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
