const express = require('express')
const router = express.Router()
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

/*** 获取菜单栏列表 ***/
router.get('/menu', (req, res) => {
    const getMenuSql = $sql.home.getMenuList
    conn.query(getMenuSql, (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result && result.length > 0) {
            const list = []
            for(var i=0;i<result.length;i++){
                result[i].children = []
                for(var j=0;j<result.length;j++){
                    if(result[j].rights_id == result[i].id) {
                        result[i].children.push(result[j])
                    }
                }
                if(result[i].rights_id == 0) {
                    list.push(result[i])
                }
            }
            jsonWrite(res, {data: list, meta: {status: 200, msg: '获取菜单列表成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '当前账户未分配权限，请联系管理员！'}})
        }
    })
})

module.exports = router
