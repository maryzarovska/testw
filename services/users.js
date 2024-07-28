const db = require('./db');
const helper = require('../helper');
const config = require('../config');

const genRandHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT id, username, password, name, image_path FROM users LIMIT ${offset}, ${config.listPerPage}`
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
        `SELECT id, username, password, name, image_path FROM users WHERE username='${username}'`
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

async function getUserData(username) {
    const rows = await db.query (
        `SELECT id, username, name, image_path FROM users WHERE username='${username}'`
    );

    const data = helper.emptyOrRows(rows);

    return data.length > 0 ? data[0] : null;
}

async function updateImage(id, imagePath) {
    const rows = await db.query (
        `UPDATE users SET image_path = ? WHERE id = ?`, [imagePath, id]
    );

    const data = helper.emptyOrRows(rows);

    return data.length > 0 ? data[0] : null;
}

async function updateUser(id, username, name) {
    const rows = await db.query (
        `UPDATE users SET username = ?, name = ? WHERE id = ?`, [username, name, id]
    );

    const data = helper.emptyOrRows(rows);

    return data.length > 0 ? data[0] : null;
}

async function createQueryToResetPassword(id) {
    let randHex = genRandHex(32);

    await db.query (
        `UPDATE users SET password_change_url = ?, password_change_url_datetime = ? WHERE id = ?`, [randHex, new Date().toISOString().slice(0, 19).replace('T', ' '), id]
    );

    return randHex;
}

module.exports = {
    getMultiple,
    getByUsername,
    insertOne,
    getUserData,
    updateImage,
    updateUser,
    createQueryToResetPassword
}