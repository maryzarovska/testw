const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getByPostId(postId, page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT id, user_id, post_id, text FROM comments WHERE post_id = ${postId} LIMIT ${offset}, ${config.listPerPage}`
    );

    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

module.exports = {getByPostId};