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

/*** 添加素材 ***/
router.post('/addClassification', (req, res) => {
    let className = req.body.className
    let addClassification = $sql.material.addClassification
    conn.query(addClassification, [className], (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '添加素材分类成功' } })
        } else {
            jsonWrite(res, { data: null, meta: { status: 201, msg: '添加素材分类失败' } })
        }
    })
})

/*** 获取素材分类 ***/
router.get('/getClassification', (req, res) => {
    let getClassification = $sql.material.getClassification
    conn.query(getClassification, (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '获取素材分类成功' } })
        } else {
            jsonWrite(res, { data: null, meta: { status: 201, msg: '获取素材分类失败' } })
        }
    })
})

/** 添加素材 ***/
router.post('/addMaterial', (req, res) => {
    let name = req.body.name
    let url = req.body.url
    let classId = req.body.classId
    let format = req.body.format
    let cerateTime = parseInt(new Date().getTime() / 1000)
    let addMaterial = $sql.material.addMaterial
    conn.query(addMaterial, [name, classId, format, url, cerateTime], (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '添加素材成功' } })
        } else {
            jsonWrite(res, { data: null, meta: { status: 201, msg: '添加素材失败' } })
        }
    })
})

/*** 获取素材列表 ***/
router.post('/getMaterialList', (req, res) => {
    let start = req.body.start
    let end = req.body.end
    let getMaterialTotal = $sql.material.getMaterialTotal
    let getMaterialList = $sql.material.getMaterialList
    conn.query(getMaterialTotal, (err1, total) => {
        if (err1) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (total) {
            conn.query(getMaterialList, [start, end], (err2, list) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (list) {
                    var array= []
                    for(var i=0;i<list.length;i++) {
                        array.push(list[i].id)
                    }
                    let commentRate = $sql.material.commentRate
                    conn.query(commentRate, [array], (err3, rate) => {
                        if (err3) {
                            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                        }
                        if (rate) {
                            for (var x=0;x<list.length;x++){
                                list[x].rate = 0
                                for (var y=0;y<rate.length;y++){
                                    if(list[x].id == rate[y].materialId) {
                                        list[x].rate =  rate[y].rate
                                    }
                                }
                            }
                            jsonWrite(res, {data: {total:total[0]['count(*)'],list:list}, meta: {status: 200, msg: '获取素材列表成功'}})
                        }
                    })
        
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '获取素材列表失败'}})
                } 
            })
        }
    })
})

/*** 查询素材关键词 ***/
router.post('/seachMaterial', (req, res) => {
    let seach = '%' + req.body.seach + '%'
    let seachMaterial = $sql.material.seachMaterial
    conn.query(seachMaterial, [seach], (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '查询关键词成功' } })
        } else {
            jsonWrite(res, { data: null, meta: { status: 201, msg: '查询关键词失败' } })
        }
    })
})
/*** 根据id获取评论信息 ***/
router.post('/getmaterialById', (req, res) => {
    let materialId = req.body.materialId
    let getmaterialById = $sql.material.getmaterialById
    conn.query(getmaterialById, [materialId, materialId], (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '获取评论信息成功' } })
        } else {
            jsonWrite(res, { data: null, meta: { status: 201, msg: '获取评论信息失败' } })
        }
    })
})

/*** 添加评论 ***/
router.post('/addComment', (req, res) => {
    let userId = req.body.userId
    let materialId = req.body.materialId
    let rate = req.body.rate
    let message = req.body.	message
    let cerateTime = parseInt(new Date().getTime() / 1000)
    let addComment = $sql.material.addComment
    conn.query(addComment, [userId, materialId, rate, message, cerateTime], (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '添加评论信息成功' } })
        } else {
            jsonWrite(res, { data: null, meta: { status: 201, msg: '添加评论信息失败' } })
        }
    })
})

/*** 获取评论 ***/
router.post('/getComment', (req, res) => {
    let materialId = req.body.materialId
    let getComment = $sql.material.getComment
    conn.query(getComment, [materialId], (err, result) => {
        if (err) {
            jsonWrite(res, { data: null, meta: { status: 400, msg: '系统出现问题，请联系技术人员！' } })
        }
        if (result) {
            jsonWrite(res, { data: result, meta: { status: 200, msg: '获取评论信息成功' } })
        } else {
            jsonWrite(res, { data: null, meta: { status: 201, msg: '获取评论信息失败' } })
        }
    })
})
module.exports = router