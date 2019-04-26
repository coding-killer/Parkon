const express = require('express');
const router = express.Router();

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAIueeUHxHX0YxrneOPbwhu2l21kV7L2s8'
  });

//Get all active topics
router.get('/', (req, res) => {
  // Geocode an address.
    googleMapsClient.geocode({
        address: '1600 Amphitheatre Parkway, Mountain View, CA'
    }, function(err, response) {
        if (!err) {
        //console.log(response.json.results);
        res.send(response.json.results);
        }
    })
});
module.exports = router;