const router = require('express').Router();

//test
router.get('/test',  async (req,res) => {
   var test = "out";
    res.send(test);
});

router.get('/flight/search', async (req, res) => {
    res.send(data);
})

module.exports = router;