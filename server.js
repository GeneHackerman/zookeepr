const fs = require('fs');
const path = require('path');

const { animals } = require('./data/animals');


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

// this method will pull assets from public directory
app.use(express.static('public'));

// this route will fetch animals.html
app.get('/animals', (req,res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// this route will fetch zookkeepers.html
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// this wildcard * will allow other requests to receive the homepage
// /about, /contact, or /membership are all the same now
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// filters array by category via filteredResults
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];

    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        
        // Save personalityTraits as a dedicated array
        // If personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        
        // loop through each trait in the personailityTraits array:
        personalityTraitsArray.forEach(trait => {
            // check the trait against each animal in the filteredResults array
            // remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop
            // for each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one
            // of the traits when the .forEach() loop is finished
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    console.log(body);
    
    // our function's main code will go here!
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    return animal;

    // return finished code to post route for response
    // return body;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

// get allows for request and response
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // console.log(req.query)
    res.json(results);
});

// will request one animal by ID
// param route comes after initial GET
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }

    // add animal to json file and animals array in this function
    // const animal = createNewAnimal(req.body, animals);

    // req.body is where our incoming content will be
    console.log(req.body);
    // res.json(animal);
});

// this route creates homepage for the server
// path module will find correct location of html file(any file)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// will listen for which port
// send will display a message on the front-end aka client
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});