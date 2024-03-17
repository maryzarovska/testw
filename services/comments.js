const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getByPostId(postId, page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT t1.id, t2.username, t1.text, t1.publication_date 
        FROM comments t1
        JOIN users t2 ON t1.user_id = t2.id
        WHERE post_id = ${postId}
        ORDER BY t1.publication_date DESC
        LIMIT ${offset}, ${config.listPerPage}`
    );

    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

async function insertOne(comment) {
    const result = await db.query(
        `INSERT INTO comments (user_id, post_id, text)
        VALUES ('${comment.user_id}', '${comment.post_id}', "${comment.text}")`
    );

    return result;
}

module.exports = {getByPostId, insertOne};