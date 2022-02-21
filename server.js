const { animals } = require('./data/animals');


const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// filters array by category via filteredResults
// continue 11.1.6
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

// get allows for request and response
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // console.log(req.query)
    res.json(results);
});

// will listen for which port
// send will display a message on the front-end aka client
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});