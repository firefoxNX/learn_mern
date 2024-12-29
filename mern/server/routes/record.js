const express = require('express');

// This will help us connect to the database
const connection = require('../db/connection');

// This helps convert the id from string to ObjectId for the _id.
const { ObjectId } = require('mongodb');

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let db = await connection.getDB();
  let collection = await db.collection("records");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// search by all fields using $search
router.get("/search", async (req, res) => {
  let db = await connection.getDB();
  let collection = await db.collection("records");
  const query = req.query.q;
  if (!query) {
    return res.status(400).send({ error: '"query" parameter is required' });
  }
  const results = await collection.aggregate([
    {
      '$search': {
        'index': 'default2',
        'compound': {
          'should': [
            {
              'autocomplete': {
                'query': query,
                'path': 'name'
              }
            },
            {
              'autocomplete': {
                'query': query,
                'path': 'position'
              }
            }
          ],
          'minimumShouldMatch': 1
        }
      }
    }
  ]).toArray();

  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let db = await connection.getDB();
  let collection = await db.collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let db = await connection.getDB();
    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };
    let db = await connection.getDB();
    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    let db = await connection.getDB();
    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

module.exports = router;
