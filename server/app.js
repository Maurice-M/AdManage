const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const JwtUtil = require('./config/jwt')

const userApi = require('./api/userApi')
const homeApi = require('./api/homeApi')
const powerApi = require('./api/powerApi')
const regularApi = require('./api/regularApi')
const domainApi = require('./api/domainApi')
const materialApi = require('./api/materialApi')
const uploadApi = require('./api/uploadApi')
const dropApi = require('./api/dropApi')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api/user', userApi)
app.use('/api/home', homeApi)
app.use('/api/power', powerApi)
app.use('/api/regular', regularApi)
app.use('/api/domain', domainApi)
app.use('/api/material', materialApi)
app.use('/api/upload', uploadApi)
app.use('/api/drop', dropApi)

app.use((req, res, next) => {
    if(req.url !== '/api/user/login') {
        let token = req.headers.authorization
        let jwt = new JwtUtil(token)
        let result = jwt.verifyToken()
        if(result == 'err') {
            res.send({data:null, meta:{status: 403, msg:'登录已过期，请重新登录！'}})
        }else{
            next()
        }  
    }else{
        next()
    }
})

app.listen(3000)
console.log('success listen at port:3000......')