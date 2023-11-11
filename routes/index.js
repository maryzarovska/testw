var express = require('express');
var router = express.Router();
const posts = require('../services/posts');
const passport = require('passport');

const users = require('../services/users');
const config = require('../config');
require('../config/passport-config')(passport, users.getByUsername, users.insertOne);

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get("/get-posts-by-username/:username", async function(req, res, next) {
    const username = req.params.username;
    setTimeout(async () => {
        res.json(await posts.getByUsername(username));
    }, 3000);
    
    // setTimeout(() => {
    //     res.json([
    //         {
    //             id: 1,
    //             title: "Excepteur anim ea ea laboris aliqua elit cupidatat.",
    //             text: "Reprehenderit non officia reprehenderit Lorem Lorem consequat. Nulla qui elit esse culpa proident aliqua pariatur officia commodo cupidatat. Nisi sint aute magna occaecat qui.",
    //             userId: 1
    //         },
    //         {
    //             id: 2,
    //             title: "Velit ad ipsum anim voluptate duis dolor labore proident culpa pariatur enim aliqua.",
    //             text: "Incididunt pariatur nostrud exercitation ullamco consequat occaecat aliqua et tempor est. Aute officia id duis do est laboris. Ad enim culpa culpa pariatur ex adipisicing eu qui officia irure Lorem occaecat dolore excepteur. Labore dolor reprehenderit sint et voluptate cillum. Velit aliquip est amet excepteur amet laborum adipisicing consectetur ut tempor veniam dolore fugiat. Magna duis nulla cupidatat magna qui ipsum.",
    //             userId: 1
    //         },
    //         {
    //             id: 3,
    //             title: "Elit id est esse sunt anim fugiat ipsum.",
    //             text: "Ad reprehenderit elit elit nulla ea qui esse minim aute. Irure excepteur nostrud laboris nisi aute. Elit incididunt ea est sit laborum sit laborum excepteur aliquip est irure do aliquip. Anim tempor voluptate qui enim nulla dolor. Occaecat incididunt fugiat adipisicing anim nulla dolore id.",
    //             userId: 1
    //         },
    //     ]);
    // }, 2000);
});

router.delete("/posts/:id", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    res.json(await posts.deleteById(req.params.id, req.user));
})

router.post("/create-post", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    console.log(req.body)
    res.json(await posts.insertOne(req.body));
  });

module.exports = router;
