const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

const userApi = require('./api/userApi')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api/user', userApi)

app.listen(3000)
console.log('success listen at port:3000......')