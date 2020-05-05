const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const mysql = require('mysql')
const db = require('../config/db')
const $sql = require('../config/sqlMap')
const JwtUtil = require('../config/jwt')

const conn = mysql.createConnection(db.mysql)
conn.connect();

var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
}

/*** 账户登录 ***/
router.post('/login', (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let passwordMd5 = crypto.createHash('md5').update(password).digest('hex');
    let seachUserSql = $sql.user.seachUser
    conn.query(seachUserSql, [email, passwordMd5], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}})
        }
        if (result && result.length > 0) {
            let userId = result[0].id
            let jwt = new JwtUtil(userId)
            let token = jwt.generateToken()
            jsonWrite(res, {data: {token: token}, meta: {status: 200, msg: '登录成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 401, msg: '当前账户或密码错误'}})
        }
    })
})

module.exports = router
