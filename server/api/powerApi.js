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

/*** 获取权限列表 ***/
router.get('/rights', (req, res) => {
    const getRightSql = $sql.power.getRightList
    conn.query(getRightSql, (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '获取权限列表成功'}})
        }
    })
})

/*** 获取角色列表 ***/
router.get('/roles', (req, res) => {
    let getRoleSql = $sql.power.getRoleList
    conn.query(getRoleSql, (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '获取角色列表成功'}})
        }
    })
})

/*** 删除角色 ***/
router.post('/removeRole', (req, res) => {
    let id = req.body.id
    let removeRoleSql = $sql.power.removeRoleById
    conn.query(removeRoleSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除角色成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除角色失败'}})
        }
    })
})

/*** 添加角色 ***/
router.post('/addRole', (req, res) => {
    let roleName = req.body.roleName
    let roleDesc = req.body.roleDesc
    let addRoleSql = $sql.power.addRole
    conn.query(addRoleSql, [roleName, roleDesc], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加角色成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加角色失败'}})
        }
    })
})

/*** 获取所有权限 ***/
router.get('/allRight', ( req, res) => {
    let getAllRightssql = $sql.power.getAllRights
    conn.query(getAllRightssql, (err, result) => {
      if (err) {
        jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}})
      }
      if (result) {
        const list=[]
        for(var i=0;i<result.length;i++){
          result[i].childrens=[]
          for(var j=0;j<result.length;j++){
            if(result[j].rights_id==result[i].id){
              result[i].childrens.push(result[j])
            }
          }
          if(result[i].rights_id==0){
            list.push(result[i])
          }
        }
        jsonWrite(res, { data: list, meta: { msg: '权限菜单栏获取成功', status: 200 } })
      }else{
        jsonWrite(res, { data: null, meta: { msg: '权限菜单栏获取失败', status: 201 } })
      }
  
    })
  })
  
/*** 分配权限提交 ***/
// --- 分配权限
router.post('/portionRight', (req, res) => {
    let rightsId = req.body.rightsId
    let id = req.body.id
    let sql = $sql.power.portionRight
    conn.query(sql, [rightsId, id], (err, result) => {
      if (err) {
        jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}})
      }
      if (result) {
        jsonWrite(res, { data: result, meta: { msg: '分配权限成功', status: 200 } })
      } else {
        jsonWrite(res, { data: null, meta: { msg: '分配权限失败', status: 201 } })
      }
    })
  })









module.exports = router