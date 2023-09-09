var express = require('express');
var router = express.Router();
const posts = require('../services/posts');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get("/test-db/:username", function(req, res, next) {
    const username = req.params.username;
    res.json(posts.getByUsername(username));
})

module.exports = router;
