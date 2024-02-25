// app.js
const express = require('express');
const bodyParser = require('body-parser');
// const participantRoutes = require('./routes/participantRoutes');
const instructeurRoutes = require('./routes/instructeurRoutes')
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/instructeur', instructeurRoutes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);      
});