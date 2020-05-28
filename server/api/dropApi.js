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

router.post('/seachDrop', (req, res) => {
    let userId = req.body.userId
    let cerateTime = req.body.cerateTime
    let list = []
    for(var i =01;i<=31;i++) {
        if(i<10){
            list.push({
                date: '0' + i,
                adCost: 0,
                accountCost: 0,
                number: 0,
                NaMoney: 0,
                profit: 0,
                ROIS: 0
            })
        }else{
            list.push({
                date: i + '',
                adCost: 0,
                accountCost: 0,
                number: 0,
                NaMoney: 0,
                profit: 0,
                ROIS: 0
            })
        }
    }
    let getRoiAdCost = $sql.regular.getRoiAdCost
    conn.query(getRoiAdCost, [userId, cerateTime], (err1, adCost) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (adCost) {
            for( var x=0;x<list.length;x++) {
                for(var y=0;y<adCost.length;y++) {
                    if (list[x].date == adCost[y].date){
                        list[x].adCost = adCost[y].adCost
                    }
                }
            }
            let getRoiAccountCost = $sql.regular.getRoiAccountCost
            conn.query(getRoiAccountCost, [userId, cerateTime], (err2, accountCost) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (accountCost) {
                    for( var x=0;x<list.length;x++) {
                        for(var y=0;y<accountCost.length;y++) {
                            if (list[x].date == accountCost[y].date){
                                list[x].accountCost = accountCost[y].accountCost
                            }
                        }
                    }
                    let getRoiNumber = $sql.regular.getRoiNumber
                    conn.query(getRoiNumber, [userId, cerateTime], (err3, number) => {
                        if (err3) {
                            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                        }
                        if (number) {
                            for( var x=0;x<list.length;x++) {
                                for(var y=0;y<number.length;y++) {
                                    if (list[x].date == number[y].date){
                                        list[x].number = number[y].number
                                    }
                                }
                            }
                            let getRoiNaMoney = $sql.regular.getRoiNaMoney
                            conn.query(getRoiNaMoney, [userId, cerateTime], (err4, NaMoney) => {
                                if (err4) {
                                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                                }
                                if (NaMoney) {
                                    for( var x=0;x<list.length;x++) {
                                        for(var y=0;y<NaMoney.length;y++) {
                                            if (list[x].date == NaMoney[y].date){
                                                list[x].NaMoney = NaMoney[y].NaMoney
                                            }
                                        }
                                    }
                                    for (var i=0;i<list.length;i++) {
                                        list[i].profit = list[i].NaMoney-list[i].adCost-list[i].accountCost
                                        list[i].ROIS = (list[i].NaMoney/(list[i].adCost+list[i].accountCost)).toFixed(2)
                                    }
                                    jsonWrite(res, {data: list, meta: {status: 200, msg: 'ROI数据货获取成功'}}) 
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})



module.exports = router
