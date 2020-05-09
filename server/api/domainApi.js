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


/*** 获取用户列表 ***/
router.get('/getUserList', (req, res) => {
    let getUserListSql = $sql.domain.getUserList
    conn.query(getUserListSql, (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '获取用户列表成功' } })
        }
    })
})

/*** 添加域名 ***/
router.post('/addDmoain', (req, res) => {
    let domain = req.body.domain
    let price = req.body.price
    let userId = req.body.userId
    let cerateTime = parseInt(new Date().getTime() / 1000)
    let addDmoainSql = $sql.domain.addDmoain
    conn.query(addDmoainSql, [userId, domain, price, cerateTime], (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '添加域名成功' } })
        } else {
            jsonWrite(res, { data: null, meta: { status: 201, msg: '添加域名失败' } })
        }
    })
})

/*** 获取域名列表 ***/
router.post('/getDomainList', (req, res) => {
    let start = req.body.start
    let end = req.body.end
    let domainTotalSql = $sql.domain.domainTotal
    let domainListSql = $sql.domain.domainList
    conn.query(domainTotalSql, (err, total) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (total) {
            conn.query(domainListSql, [start, end], (err, domainList) => {
                if (err) {
                    jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
                }
                if (domainList) {
                    jsonWrite(res, { data: {total:total[0]['count(*)'],list:domainList}, meta: { status: 200, msg: '获取域名成功' } })
                } else {
                    jsonWrite(res, { data: null, meta: { status: 201, msg: '获取域名失败' } })
                }
            })
        } else {
            jsonWrite(res, { data: null, meta: { status: 201, msg: '获取域名总数失败' } })
        }
    })
})

module.exports = router
