const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const mysql = require('mysql')
const db = require('../config/db')
const $sql = require('../config/sqlMap')
const JwtUtil = require('../config/jwt')

const conn = mysql.createConnection(db.mysql)
conn.connect();

var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
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
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result && result.length > 0) {
            let userId = result[0].id
            let jwt = new JwtUtil(userId)
            let token = jwt.generateToken()
            jsonWrite(res, { data: { token: token, info: result[0] }, meta: { status: 200, msg: '登录成功' } })
        } else {
            jsonWrite(res, { data: null, meta: { status: 201, msg: '当前账户或密码错误' } })
        }
    })
})

/*** 获取用户列表 ***/
router.get('/userList', (req, res) => {
    let userListSql = $sql.user.userList
    conn.query(userListSql, (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '获取用户列表成功' } })
        }
    })
})

/*** 添加用户 ***/
router.post('/addUser', (req, res) => {
    let name = req.body.name
    let email = req.body.email
    let password = crypto.createHash('md5').update(req.body.password).digest('hex');
    let iphone = req.body.iphone
    let state = req.body.state
    let create_time = parseInt(new Date().getTime() / 1000)
    addUserSql = $sql.user.addUser
    conn.query(addUserSql, [name, password, email, iphone, state, create_time], (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '添加用户成功' } })
        }
    })
})

/*** 根据id查找用户信息 ***/
router.post('/getUserById', (req, res) => {
    let id = req.body.id
    let getUserByIdSql = $sql.user.getUserById
    conn.query(getUserByIdSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result[0], meta: { status: 200, msg: '获取当前ID用户信息成功' } })
        }
    })
})

/*** x修改用户信息 ***/
router.post('/edit', (req, res) => {
    let id = req.body.id
    let price = req.body.price
    let commission = req.body.commission
    let state = req.body.state
    let editUserSql = $sql.user.editUser
    conn.query(editUserSql, [price, commission, state, id], (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '修改用户信息成功' } })
        } else {
            jsonWrite(res, { data: result, meta: { status: 201, msg: '修改用户信息失败' } })
        }
    })
})

/*** 删除用户 ***/
router.post('/removeUser', (req, res) => {
    let id = req.body.id
    let removeUserByIdSql = $sql.user.removeUserById
    conn.query(removeUserByIdSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '删除用户信息成功' } })
        } else {
            jsonWrite(res, { data: null, meta: { status: 201, msg: '删除用户信息失败' } })
        }
    })
})

/*** 获取角色列表 ***/
router.get('/getRoles', (req, res) => {
    let getRoleSql = $sql.user.getRoles
    conn.query(getRoleSql, (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '获取角色列表成功' } })
        } else {
            jsonWrite(res, { data: null, meta: { status: 201, msg: '获取角色列表失败' } })
        }
    })
})

/*** 保存修改分配角色 ***/
router.post('/editUserRole', (req, res) => {
    let id = req.body.id
    let roleId = req.body.roleId
    let editUserRoleSql = $sql.user.editUserRole
    conn.query(editUserRoleSql, [roleId, id], (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '修改角色成功' } })
        } else {
            jsonWrite(res, { data: null, meta: { status: 201, msg: '修改角色失败' } })
        }
    })
})
module.exports = router
