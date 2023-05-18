const router = require('express').Router();


//test
router.get('/test',  async (req,res) => {

    res.send("test");
   

});

module.exports = router;