const router = require('express').Router();

//test
router.get('/flights/radar', async (req, res) => {
    var test = "TEST"
    res.send(test);
});

module.exports = router;