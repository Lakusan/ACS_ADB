const router = require('express').Router();

//test
router.get('/test',  async (req,res) => {
   var test = "out"
    res.send(test);
   

});

module.exports = router;