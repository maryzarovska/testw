const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT id, username, password FROM users LIMIT ${offset}, ${config.listPerPage}`
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
        `SELECT id, username, password FROM users WHERE username='${username}'`
    );

    const data = helper.emptyOrRows(rows);

    return data.length > 0 ? data[0] : null;
}

async function insertOne(user) {
    const result = await db.query(
        `INSERT INTO users (username, password)
        VALUES ('${user.username}', '${user.password}')`
    );

    return result;
}

module.exports = {
    getMultiple,
    getByUsername,
    insertOne
}