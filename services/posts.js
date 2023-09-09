const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT id, title, text, user_id FROM posts LIMIT ${offset}, ${config.listPerPage}`
    );
    
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

async function getByUsername(username, page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query (
        `SELECT posts.id, title, posts.text, user_id 
        FROM posts 
        INNER JOIN users 
        ON posts.user_id = users.id
        WHERE users.username = '${username}'
        LIMIT ${offset}, ${config.listPerPage}`
    );

    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

async function getByCategory(category, page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT posts.id, title, posts.text, user_id 
        FROM posts 
        INNER JOIN post_category
        ON posts.id = post_category.post_id
        INNER JOIN categories 
        ON categories.id = post_category.category_id
        WHERE categories.cat_name = '${category}'
        LIMIT ${offset}, ${config.listPerPage}`
    );

    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

module.exports = {getByUsername, getByCategory, getMultiple}