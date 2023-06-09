const mysql = require('mysql2/promise');
require('dotenv').config();

async function connect() {
    if (global.connection && global.connection.state !== 'disconnected') {
        return global.connection
    }

    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        connectTimeout: 5000,
        ssl: {
            rejectUnauthorized: false
        }
    });

    global.connection = connection;
    return connection
}

async function insertToken(access_token, expires_in, id){
    const conn = await connect();
    const sql = `INSERT INTO accesstokendb(access_token, expires_in, id) VALUES (?, ?, ?);`
    const values = [access_token, expires_in, id];
    return await conn.query(sql, values)
}

async function updateData(access_token, expires_in, id) {
    const conn = await connect();
    const sql = 'UPDATE accesstokendb SET access_token=?, expires_in=?, id=?'
    const values = [access_token, expires_in, id];
    return await conn.query(sql, values);
}

async function deleteData(id) {
    const conn = await connect();
    const sql = 'DELETE FROM accesstokendb where id=?;'
    return await conn.query(sql, id);
}

async function getAccessToken(id) {
    const conn = await connect();
    const sql = 'SELECT *FROM accesstokendb where id=?;'
    const result = await conn.query(sql, id);
    return result[0][0] != undefined ? true : false; 
}

async function getPlaylistByYear(year) {
    const conn = await connect();
    const sql = 'SELECT *FROM idLink where ano=?;'
    const result = await conn.query(sql, year);
    return result[0][0].idlink;
}

async function getPlaylists() {
    const conn = await connect();
    const sql = 'SELECT ano FROM idLink;'
    const result = await conn.query(sql);
    return result[0]; 
}

module.exports = {insertToken, getAccessToken, updateData, deleteData, getPlaylistByYear, getPlaylists}