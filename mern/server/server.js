const express = require('express');
const cors = require('cors');
const records = require('./routes/record.js');
const connection = require('./db/connection.js');
const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

// start the Express server
const server = app.listen(PORT, async () => {
  await connection.setupDB();
  console.log(`Server listening on port ${PORT}`);
});

module.exports = server;
