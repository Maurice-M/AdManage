const fs = require('fs')
const path = require('path')
const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const mysql = require('mysql')
const db = require('../config/db')
const $sql = require('../config/sqlMap')
const JwtUtil = require('../config/jwt')
const qiniu = require('qiniu')

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

const accessKey = 'PDHmZiRutV9UYfzRlKEmo5RxkjWISZRep2lqSrjA'
const secretKey = 'TPY6C6-33J9jSVUb_frejWj2VIvH_t1uztg3tePj'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const options = {
    scope: 'admanage',
    expires: 7200
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

router.get('/getToken', (req, res) => {
    jsonWrite(res, {token: uploadToken, meta: {msg: '获取token成功', status: 200}})
})



module.exports = router
