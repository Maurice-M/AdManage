const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const db = require('../config/db')
const $sql = require('../config/sqlMap')

const conn = mysql.createConnection(db.mysql)
conn.connect()






module.exports = router
