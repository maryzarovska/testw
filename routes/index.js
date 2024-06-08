var express = require('express');
var router = express.Router();
const posts = require('../services/posts');
const categories = require('../services/categories');
const comments = require('../services/comments')
const passport = require('passport');

const users = require('../services/users');
const config = require('../config');
require('../config/passport-config')(passport, users.getByUsername, users.insertOne);

router.get("/get-posts-by-username/:username", async function (req, res, next) {
    const username = req.params.username;
    setTimeout(async () => {
        res.json(await posts.getByUsername(username));
    }, 1000);
});

router.get("/get-posts-by-username-foreign-user/:username", async function (req, res, next) {
    const username = req.params.username;
    setTimeout(async () => {
        res.json(await posts.getForeignUser(username));
    }, 1000);
});

router.delete("/posts/:id", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    res.json(await posts.deleteById(req.params.id, req.user));
})

router.post("/create-post", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const p = await posts.insertOne(req.body);
    console.log(p)
    res.json(p);
});

router.get("/categories/all", async (req, res, next) => {
    res.json(await categories.getAll())
})

router.post("/posts/list", async (req, res, next) => {
    console.log(req.body)
    res.json(await posts.searchByTextAndCategories(req.body.textSearchText, req.body.categories))
    //res.sendStatus(200)
})

router.get("/posts/:id", async (req, res, next) => {
    res.json(await posts.getById(req.params.id))
})

router.get("/posts/edit/:id", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    let post = await posts.getById(req.params.id);
    if (post && post.user_id === req.user.id) {
        res.json(post);
    } else {
        res.status(400).json({});
    }
})

router.put("/posts/edit/:id", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    let post = await posts.getById(req.params.id);
    if (post && post.user_id === req.user.id) {
        console.log(await posts.updatePost(req.params.id, req.body));
        res.sendStatus(200);
    } else {
        res.status(400).json({});
    }
})

router.get("/comments/:postId", async (req, res, next) => {
    res.json(await comments.getByPostId(req.params.postId))
})

router.post("/create-comment", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const p = await comments.insertOne(req.body);
    res.json(p);
})

module.exports = router;
