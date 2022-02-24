const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming string or array data
// Takes incoming POST data and converts to key/value pairing
// that is accessed in req.body object.
// ({extended:true}) option set inside method call informs server there 
// may be sub-array data nested in as well, so it will look deep into POST
// data as possible to parse data correctly.
// THIS MUST BE SETUP EVERY TIME YOU CREATE A SERVER THAT ACCEPTS POST DATA
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
// this method takes incoming POST data in the form of JSON and parses
// it into req.body JavaScript object.
// THIS MUST BE SETUP EVERY TIME YOU CREATE A SERVER THAT ACCEPTS POST DATA
app.use(express.json());

// this will use router set up in apiRoutes when client goes to host/api
// if / endpoint, then router will serve back HTML routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// this method will pull assets from public directory
app.use(express.static('public'));


// will listen for which port
// send will display a message on the front-end aka client
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});