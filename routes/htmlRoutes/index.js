const path = require("path");
const router = require("express").Router();

// this route creates homepage for the server
// path module will find correct location of html file(any file)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// this router will fetch animals.html
router.get('/animals', (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// this route will fetch zookkeepers.html
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// this wildcard * will allow other requests to receive the homepage
// /about, /contact, or /membership are all the same now
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

module.exports = router;