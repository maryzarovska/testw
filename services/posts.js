const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT id, title, summary, text, user_id FROM posts LIMIT ${offset}, ${config.listPerPage}`
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
        `select posts.id, title, summary, posts.text, user_id, rating, relationship,
        group_concat(cat_name separator ',') as categories_list
        from posts
        inner join users on posts.user_id = users.id
        left join post_category on posts.id = post_category.post_id
        left join categories on post_category.category_id = categories.id
        where users.username = '${username}'
        group by posts.id
        limit ${offset}, ${config.listPerPage}`
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
        `SELECT posts.id, title, summary, posts.text, user_id 
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

async function insertOne(post) {
    const result = await db.query(
        `INSERT INTO posts (title, summary, text, user_id, rating, relationship)
        VALUES ('${post.title}', '${post.summary}', "${post.text}", '${post.user_id}', '${post.rating}', '${post.relationship}')`
    );

    const post_id = result.insertId;
    const pairs = [];
    for (let category of post.categories) {
        pairs.push(`(${post_id}, ${category.id})`);
    }

    await db.query(
        `INSERT INTO post_category (post_id, category_id)
        VALUES ${pairs.join(', ')}`
    );

    return result;
}

async function deleteById(id, user) {
    const remove = await db.query(
        `DELETE FROM posts WHERE id = ${id} AND user_id = ${user.id}`
    );

    return remove;
}

module.exports = {getByUsername, getByCategory, getMultiple, insertOne, deleteById}