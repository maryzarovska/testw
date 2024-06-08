const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT id, title, summary, text, user_id, publication_date, is_draft
        FROM posts
        WHERE is_draft = 0
        LIMIT ${offset}, ${config.listPerPage}`
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
    const rows = await db.query(
        `select posts.id, title, summary, posts.text, user_id, username, rating, relationship, publication_date, is_draft,
        group_concat(cat_name separator ',') as categories_list
        from posts
        inner join users on posts.user_id = users.id
        left join post_category on posts.id = post_category.post_id
        left join categories on post_category.category_id = categories.id
        where users.username = '${username}'
        group by posts.id
        order by publication_date desc
        limit ${offset}, ${config.listPerPage}`
    );

    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

async function getForeignUser(username, page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `select posts.id, title, summary, posts.text, user_id, username, rating, relationship, publication_date,
        group_concat(cat_name separator ',') as categories_list
        from posts
        inner join users on posts.user_id = users.id
        left join post_category on posts.id = post_category.post_id
        left join categories on post_category.category_id = categories.id
        where users.username = '${username}' AND posts.is_draft = 0
        group by posts.id
        order by publication_date desc
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
        `SELECT posts.id, title, summary, posts.text, user_id, publication_date 
        FROM posts 
        INNER JOIN post_category
        ON posts.id = post_category.post_id
        INNER JOIN categories 
        ON categories.id = post_category.category_id
        WHERE categories.cat_name = '${category}' AND posts.is_draft = 0
        ORDER BY publication_date DESC
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
        `INSERT INTO posts (title, summary, text, user_id, rating, relationship, is_draft)
        VALUES ('${post.title}', '${post.summary}', "${post.text}", '${post.user_id}', '${post.rating}', '${post.relationship}', ${post.is_draft})`
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

async function getById(id) {
    const post = await db.query(
        `SELECT * FROM posts WHERE id = ${id}`
    );
    if (post) {
        const post_id = post[0].id;
        const categories = await db.query(
            `SELECT categories.id, categories.cat_name FROM categories
            INNER JOIN post_category
            ON categories.id = post_category.category_id
            WHERE post_category.post_id = ${post_id}`
        );
        post[0].categories = categories;
    }
    if (post) {
        return post[0];
    } else return null;
}

async function searchByTextAndCategories(text, categories_list) {
    // const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `select posts.id, title, posts.text, user_id, username, rating, relationship, publication_date, group_concat(cat_name separator ',') as categories_list from posts
        inner join users on posts.user_id = users.id
        left join post_category on posts.id = post_category.post_id
        left join categories on post_category.category_id = categories.id
        where (LOWER(posts.title) LIKE LOWER('%${text}%'))` + (categories_list.length > 0 ? `and (post_category.category_id in (${categories_list.map(cat => cat.id).join(',')}))` : "") +
        ` and posts.is_draft = 0
        group by posts.id 
        order by publication_date desc;`
    );

    const data = helper.emptyOrRows(rows);

    return data;
}

async function updatePost(id, post) {
    const update = await db.query(
        `UPDATE posts 
        SET title = ${post.title}, summary = ${post.summary}, text = ${post.text}, rating = ${post.rating}, relationship = ${post.relationship}
        WHERE posts.id = ${id};`
    )
}

module.exports = { getByUsername, getByCategory, getMultiple, insertOne, deleteById, getById, searchByTextAndCategories, getForeignUser, updatePost }