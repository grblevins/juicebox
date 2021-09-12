const { Client } = require('pg') // imports the pg module

const client = new Client('postgres://localhost:5432/juicebox-dev');


async function createUser({ 
    username, 
    password,
    name,
    location
  }) {
    try {
      const { user } = await client.query(`
        INSERT INTO users(username, password, name, location) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password, name, location]);
  
      return user;
    } catch (error) {
      throw error;
    }
  }
  

async function getAllUsers() {
  const { rows } = await client.query(`SELECT id, username, name, location, active FROM users;`);

  return rows;
}

async function updateUser(id, fields = {}) {
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ user ] } = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function createPost({
    authorId,
    title,
    content
  }) {
    try {
        const { rows: [ post ] } = await client.query(`
        INSERT INTO posts("authorId", title, content) 
        VALUES($1, $2, $3) 
 
        RETURNING *;
      `, [authorId, title, content]);
  
      return post;
    } catch (error) {
      throw error;
    }
  }

  async function updatePost(id, fields = {}) {

    delete fields.tags;

    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
    try {
        if (setString.length) {
            const {rows: [post] } = await client.query(`
            UPDATE posts
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
            `, Object.values(fields));
  
            return post;
        }
    } catch (error) {
      throw error;
    }
  }

  async function getAllPosts() {
    try {
        const { rows } = await client.query(`SELECT id, "authorId", title, content FROM posts;`);
        return rows;

    } catch (error) {
      throw error;
    }
  }

  async function getPostsByUser(userId) {
    try {
      const { rows } = client.query(`
        SELECT * FROM posts
        WHERE "authorId"=${ userId };
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async function getUserById(userId) {
    try {
        const queryString = `
        SELECT * FROM users
        WHERE id=${userId};
        `;
        console.log(queryString);
        const {rows: [user]} = await client.query(queryString);
        return user;
          
    } catch(error) {
        console.error(error)
      }
  }

  async function getUserByUsername(username) {
    try {
      const { rows: [user] } = await client.query(`
        SELECT *
        FROM users
        WHERE username=$1;
      `, [username]);
  
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function getAllTags() {
    try {
      const { rows } = await client.query(`SELECT * FROM tags;`);

      return rows;
    } catch (error) {
        console.error(error);
    }
  }

module.exports = {  
  client,
  createUser,
  getAllUsers,
  updateUser,
  createPost,
  updatePost,
  getPostsByUser,
  getUserById,
  getAllPosts,
  getAllTags,
  getUserByUsername
}