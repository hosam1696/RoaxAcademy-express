let express = require('express');
let router  = express.Router();

let feedback    = require("../data/feedback.json");


router.get('/api/feedback', (request, response)=>{
	response.json(feedback);
});

module.exports = router;
