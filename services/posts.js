const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT id, title, content, user_id FROM posts LIMIT ${offset}, ${config.listPerPage}`
    );
    
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

async function getByUsername(username) {
    const rows = await db.query (
        `SELECT posts.id, title, posts.text, user_id 
        FROM posts 
        INNER JOIN users 
        ON posts.user_id = users.id
        WHERE users.username = '${username}'`
    );

    const data = helper.emptyOrRows(rows);

    return data.length > 0 ? data[0]:null;
}

async function getByCategory(category) {
    const rows = await db.query (
        `SELECT posts.id, title, posts.text, user_id 
        FROM posts 
        INNER JOIN post_category
        ON posts.id = post_category.post_id
        INNER JOIN categories 
        ON categories.id = post_category.category_id
        WHERE category.cat_name = '${category}'`
    );

    const data = helper.emptyOrRows(rows);

    return data.length > 0 ? data[0]:null;
}

module.exports = {getByUsername, getByCategory, getMultiple}