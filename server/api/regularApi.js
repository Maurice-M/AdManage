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

/*** 添加新日常类目***/
router.post('/addRegular', (req, res) => {
    let regName = req.body.regName
    let addRegularSql = $sql.regular.addRegular
    conn.query(addRegularSql, [regName], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加新日常类目成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加新日常失败'}})
        }
    })
})

/*** 获取日常费用类目 ***/
router.get('/getRegularList', (req, res) => {
    let getRegularListSql = $sql.regular.getRegularList
    conn.query(getRegularListSql, (err2, result) => {
        if (err2) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '获取日常费用类目成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取日常费用类目失败'}})
        }
    })    
})

/*** 修改日常类目 ***/
router.post('/editRegular', (req, res) => {
    let id = req.body.id
    let regName = req.body.regName
    let editRegularSql = $sql.regular.editRegular
    conn.query(editRegularSql, [regName, id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '修改日常费用类目成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '修改日常费用类目失败'}})
        }
    })
})

/*** 删除日常费用类目 ***/
router.post('/removeRegular', (req, res) => {
    let id = req.body.id
    let removeRegularSql = $sql.regular.removeRegular
    conn.query(removeRegularSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除日常费用类目成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除日常费用类目失败'}})
        } 
    })
})

/*** 添加日常花费 ***/
router.post('/addSpendDay', (req, res) => {
    let regId = req.body.regId
    let cost = req.body.cost
    let cerateTime = req.body.cerateTime
    let addSpendDaySql = $sql.regular.addSpendDay
   conn.query(addSpendDaySql, [regId, cost, cerateTime], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加新日常花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加新日常花费失败'}})
        }
    })
})

/*** 获取日常花费 ***/
router.post('/getSpendDayList', (req, res) => {
    let start = req.body.start
    let end = req.body.end
    let getSpendDayTotal = $sql.regular.getSpendDayTotal
    let getSpendDayListSql = $sql.regular.getSpendDayList
    conn.query(getSpendDayTotal, (err1, total) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (total) {
            conn.query(getSpendDayListSql, [start, end], (err2, spendDayList) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (spendDayList) {
                    jsonWrite(res, {data: {total:total[0]['count(*)'],list:spendDayList}, meta: {status: 200, msg: '获取日常花费成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '获取日常花费失败'}})
                } 
            })
        }
    })


    
})

/*** 删除日常花费 ***/
router.post('/removeSpendDay', (req, res) => {
    let id = req.body.id
    let removeSpendDaySql = $sql.regular.removeSpendDay
    conn.query(removeSpendDaySql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除日常花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除日常花费失败'}})
        } 
    })
})
/*** 根据id获取日常花费 ***/
router.post('/getSpendDayById', (req, res) => {
    let id = req.body.id
    let getSpendDayByIdSql = $sql.regular.getSpendDayById
    conn.query(getSpendDayByIdSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result[0], meta: {status: 200, msg: '获取日常花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取日常花费失败'}})
        } 
    })
})

/*** 修改日常花费 ***/
router.post('/editSpendDayCost', (req, res) => {
    let id = req.body.id
    let cost = req.body.cost
    let editSpendDayCostSql = $sql.regular.editSpendDayCost
    conn.query(editSpendDayCostSql ,[cost, id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '修改日常花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '修改日常花费失败'}})
        }
    })
})
/*** 添加新工具类目***/
router.post('/addTool', (req, res) => {
    let toolName = req.body.toolName
    let addToolSql = $sql.regular.addTool
    conn.query(addToolSql, [toolName], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加新工具类目成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加新工具类目失败'}})
        }
    })
})

/*** 获取工具类目列表 ***/
router.post('/getToolList', (req, res) => {
    let start = req.body.start
    let end = req.body.end
    let getToolTotalSql = $sql.regular.getToolTotal
    let getToolListSql = $sql.regular.getToolList
    conn.query(getToolTotalSql, (err1, total) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (total) {
            conn.query(getToolListSql, [start, end], (err, toolList) => {
                if (err) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (toolList) {
                    jsonWrite(res, {data: {total:total[0]['count(*)'],list:toolList}, meta: {status: 200, msg: '获取工具类目列表成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '获取工具类目列表失败'}})
                }
            })
        }
    })

    
})

/*** 删除工具类目 ***/
router.post('/removeTool', (req, res) => {
    let id = req.body.id
    let removeToolSql = $sql.regular.removeTool
    conn.query(removeToolSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除工具类目成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除工具类目失败'}})
        } 
    })
})

/*** 根据id获取工具花费 ***/
router.post('/getToolCostById', (req, res) => {
    let id = req.body.id
    let getToolCostByIdSql = $sql.regular.getToolCostById
    conn.query(getToolCostByIdSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result[0], meta: {status: 200, msg: '获取花费信息成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取花费信息失败'}})
        } 
    })
})

/*** 修改工具类目 ***/
router.post('/editTool', (req, res) => {
    let toolName = req.body.toolName
    let id = req.body.id
    let editToolSql = $sql.regular.editTool
    conn.query(editToolSql, [toolName, id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '修改工具类目成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '修改工具类目失败'}})
        }
    })
})

/*** 获取工具类目 ***/
router.get('/getTools', (req, res) => {
    let getToolsSql = $sql.regular.getTools
    conn.query(getToolsSql, (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '获取工具类目成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取工具类目失败'}})
        }
    })
})

/*** 添加工具类花费 ***/
router.post('/addToolCost', (req, res) => {
    let toolId = req.body.toolId
    let userId = req.body.userId
    let toolCost = req.body.toolCost
    let cerateTime = req.body.cerateTime
    let addToolCostSql = $sql.regular.addToolCost
    conn.query(addToolCostSql, [userId, toolId, toolCost, cerateTime], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加工具类花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加工具类花费失败'}})
        }
    })
})

/*** 获取工具类花费列表 ***/
router.post('/getToolCostList', (req, res) => {
    let start = req.body.start
    let end = req.body.end
    let getToolCostTotalSql = $sql.regular.getToolCostTotal
    let getToolCostListSql = $sql.regular.getToolCostList
    conn.query(getToolCostTotalSql, (err1, total) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (total) {
            conn.query(getToolCostListSql, [start, end], (err2, toolCosstList) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (toolCosstList) {
                    jsonWrite(res, {data: {total:total[0]['count(*)'],list:toolCosstList}, meta: {status: 200, msg: '获取工具类花费列表成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '获取工具类花费列表失败'}})
                
                }
            })
        }
    })
})

/*** 删除工具类花费 ***/
router.post('/removeToolCost', (req, res) => {
    let id = req.body.id
    let removeToolCostSql = $sql.regular.removeToolCost
    conn.query(removeToolCostSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除工具类花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除工具类花费失败'}})
        }
    })
})

/*** 修改工具类花费 ***/
router.post('/editToolCost', (req, res) => {
    let id = req.body.id
    let toolCost = req.body.toolCost
    let editToolCostSql = $sql.regular.editToolCost
    conn.query(editToolCostSql, [toolCost, id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '修改工具类花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '修改工具类花费失败'}})
        }
    })
})

/*** 工具花费查询 ***/
router.post('/seachToolCost', (req, res) => {
    let seachToolId = req.body.seachToolId
    let seachStartTime = req.body.seachStartTime
    let seachEndTime = req.body.seachEndTime   
        if (seachToolId === '') {
            let seachToolCostSql = $sql.regular.seachToolCost
            conn.query(seachToolCostSql, [seachStartTime, seachEndTime], (err, result) => {
                if (err) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (result) {
                    jsonWrite(res, {data: result, meta: {status: 200, msg: '工具花费查询成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '工具花费查询失败'}})
                }
            })
        } else {
            let seachToolCostSql = $sql.regular.seachToolIdToolCost
            conn.query(seachToolCostSql, [seachToolId, seachStartTime, seachEndTime], (err, result) => {
                if (err) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (result) {
                    jsonWrite(res, {data: result, meta: {status: 200, msg: '工具花费查询成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '工具花费查询失败'}})
                }
            })
        }   
})

/*** 添加广告商 ***/
router.post('/addAdvertisers', (req, res) => {
    let adName = req.body.adName
    let cerateTime = parseInt(new Date().getTime() / 1000)
    let addAdvertisersSql = $sql.regular.addAdvertisers
    conn.query(addAdvertisersSql, [adName, cerateTime], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加广告商成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加广告商失败'}})
        }
    })
})

/*** 获取广告商列表***/
router.post('/getAdvertisers', (req, res) => {
    let start = req.body.start
    let end = req.body.end
    let getAdvertiserstotalSql = $sql.regular.getAdvertiserstotal
    let getAdvertisersSql = $sql.regular.getAdvertisers
    conn.query(getAdvertiserstotalSql, (err1, total) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (total) {
            conn.query(getAdvertisersSql, [start, end], (err2, adList) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (adList) {
                    jsonWrite(res, {data: {total:total[0]['count(*)'],list:adList}, meta: {status: 200, msg: '获取广告商列表成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '获取广告商列表失败'}})
                
                }
            })
        }
    })
})

/*** 删除广告商 ***/
router.post('/removeAd', (req, res) => {
    let id = req.body.id
    let removeAdSql = $sql.regular.removeAd
    conn.query(removeAdSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除广告商成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除广告商失败'}})
        }
    })
})

/*** 获取人员信息 ***/
router.get('/getUserList', (req, res) => {
    let getUserListSql = $sql.regular.getUserList
    conn.query(getUserListSql, (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '获取个员信息成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取个员信息失败'}})
        }
    })
})

/*** 获取广告商信息 ***/
router.get('/getAdList', (req, res) => {
    let getAdListSql = $sql.regular.getAdList
    conn.query(getAdListSql, (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '获取广告商信息成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取广告商信息失败'}})
        }
    })
})

/***添加广告花费 ***/
router.post('/addAdCost', (req, res) => {
    let userId = req.body.userId
    let adId = req.body.adId
    let accountCost = req.body.accountCost
    let adCost = req.body.adCost
    let formalities = req.body.formalities
    let cerateTime = req.body.cerateTime
    let price = (Number(accountCost) + Number(adCost) * (1 + Number(formalities))).toFixed(2)
    let outMoney = $sql.regular.outMoney
    let addAdCostSql = $sql.regular.addAdCost
    let seachPerbalance = $sql.regular.seachPerbalance
    conn.query(seachPerbalance, (err2, perBalance) => {
        if (err2) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (perBalance) {
            let balance =Number(perBalance[0].balance) - Number(price)
            conn.query(outMoney, [userId,price, balance, '广告花费', 1,cerateTime], (err3, outMoney) => {
                if (err3) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (outMoney) {
                    console.log('插入消费记录成功')
                    conn.query(addAdCostSql, [userId, adId, accountCost, adCost, formalities, cerateTime], (err, result) => {
                        if (err) {
                            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                        }
                        if (result) {
                            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加广告花费成功'}})
                        } else {
                            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加广告花费失败'}})
                        }
                    })
                }
            })

        }
    })

    
})

/*** 获取广告花费列白 ***/
router.post('/getAdCostList', (req, res) => {
    let start = req.body.start
    let end = req.body.end
    let getAdCostTotalSql = $sql.regular.getAdCostTotal
    let getAdCostListSql = $sql.regular.getAdCostList
    conn.query(getAdCostTotalSql, (err1, total) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (total) {
            conn.query(getAdCostListSql, [start, end], (err2,adCostList) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (adCostList) {
                    jsonWrite(res, {data: {total:total[0]['count(*)'],list:adCostList}, meta: {status: 200, msg: '获取广告花费列表成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '获取广告花费列表失败'}})
                }
            })
        }
    })
})

/*** 删除广告花费***/
router.post('/removeAdCost', (req, res) => {
    let id = req.body.id
    let removeAdCostSql = $sql.regular.removeAdCost
    conn.query(removeAdCostSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除广告花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除广告花费失败'}})
        }
    })
})

/*** 根据id获取广告花费 ***/
router.post('/getAdCostById', (req, res) => {
    let id = req.body.id
    let getAdCostByIdSql = $sql.regular.getAdCostById
    conn.query(getAdCostByIdSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result[0], meta: {status: 200, msg: '获取广告花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取广告花费失败'}})
        }
    })
})

/*** 修改广告花费 ***/
router.post('/editAdCost', (req, res) => {
    let id = req.body.id
    let accountCost = req.body.accountCost
    let adCost = req.body.adCost
    let formalities = req.body.formalities
    let editAdCostSql = $sql.regular.editAdCost 
    conn.query(editAdCostSql, [accountCost, adCost, formalities, id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '修改广告花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '修改广告花费失败'}})
        }
    })
})

/*** 广告花费查询 ***/
router.post('/seachAdCost', (req, res) => {
    let seachAdId = req.body.seachAdId
    let seachUserId = req.body.seachUserId
    let seachStartTime = req.body.seachStartTime
    let seachEndTime = req.body.seachEndTime    
    if (seachAdId === '' && seachUserId === ''){
        let seachAdCostSql = $sql.regular.seachTimeAdCost
        conn.query(seachAdCostSql, [seachStartTime, seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: '广告花费查询成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: '广告花费查询失败'}})
            }
        })
    } else if (seachAdId === '' && seachUserId !== ''){
        let seachUserIdAdCost = $sql.regular.seachUserIdAdCost
        conn.query(seachUserIdAdCost, [seachUserId,seachUserId,seachStartTime,seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: '广告花费查询成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: '广告花费查询失败'}})
            }
        })
    } else if(seachAdId !== '' && seachUserId === '') {
        let seachAdIdAdCost = $sql.regular.seachAdIdAdCost
        conn.query(seachAdIdAdCost, [seachAdId,seachStartTime,seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: '广告花费查询成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: '广告花费查询失败'}})
            }
        })
    } else if (seachAdId !== '' && seachUserId !== '') {
        let seachUsuerAdIdAdCost = $sql.regular.seachUsuerAdIdAdCost
        conn.query(seachUsuerAdIdAdCost, [seachUserId,seachUserId,seachAdId,seachStartTime,seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: '广告花费查询成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: '广告花费查询失败'}})
            }
        })
    }
})

/*** 添加网盟 ***/
router.post('/addNetAlliances', (req, res) => {
    let naName = req.body.naName
    let cerateTime = parseInt(new Date().getTime() / 1000)
    let addNetAlliancesSql = $sql.regular.addNetAlliances
    conn.query(addNetAlliancesSql, [naName, cerateTime], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加网盟成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加网盟失败'}})
        }
    })
})

/*** 获取网盟列表***/
router.post('/getNetAlliances', (req, res) => {
    let start = req.body.start
    let end = req.body.end
    let getNetAlliancestotalSql = $sql.regular.getNetAlliancestotal
    let getNetAlliancesSql = $sql.regular.getNetAlliances
    conn.query(getNetAlliancestotalSql, (err1, total) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (total) {
            conn.query(getNetAlliancesSql, [start, end], (err2, naList) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (naList) {
                    jsonWrite(res, {data: {total:total[0]['count(*)'],list:naList}, meta: {status: 200, msg: '获取网盟商列表成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '获取网盟商列表失败'}})
                
                }
            })
        }
    })
})

/*** 删除网盟 ***/
router.post('/removeNa', (req, res) => {
    let id = req.body.id
    let removeNaSql = $sql.regular.removeNa
    conn.query(removeNaSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除网盟成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除网盟失败'}})
        }
    })
})

/*** 获取网盟列表 ***/
router.get('/getNetAlliance', (req, res) => {
    let getNetAllianceSql = $sql.regular.getNetAlliance
    conn.query(getNetAllianceSql, (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '获取网盟列表成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取网盟列表失败'}})
        }
    })
})

/*** 添加网盟汇款 ***/
router.post('/addNaMoney', (req, res) => {
    let remitMoney = req.body.remitMoney
    let naId = req.body.naId
    let userId = req.body.userId
    let cerateTime = req.body.cerateTime
    let addNaMoneySql = $sql.regular.addNaMoney
    conn.query(addNaMoneySql, [userId, naId, remitMoney, cerateTime], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加网盟列表成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加网盟列表失败'}})
        }
    })
})

/*** 获取网盟汇款列表 ***/
router.post('/getNaMoneyList', (req, res) => {
    let start = req.body.start
    let end = req.body.end
    let getNaMoneyTotalSql = $sql.regular. getNaMoneyTotal
    let getNaMoneyListSql = $sql.regular.getNaMoneyList
    conn.query(getNaMoneyTotalSql, (err1, total) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (total) {
            conn.query(getNaMoneyListSql, [start, end], (err2, NaMoneyList) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (NaMoneyList) {
                    jsonWrite(res, {data: {total:total[0]['count(*)'],list:NaMoneyList}, meta: {status: 200, msg: '获取网盟汇款列表成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '获取网盟汇款列表失败'}})
                }
            })
        }
    })
})

/*** 根据id获取网盟汇款 ***/
router.post('/getNaMoneyById', (req, res) => {
    let id = req.body.id
    let getNaMoneyByIdSql = $sql.regular.getNaMoneyById
    conn.query(getNaMoneyByIdSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result[0], meta: {status: 200, msg: '获取网盟汇款成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取网盟汇款失败'}})
        }
    })
})

/*** 修改网盟汇款 ***/
router.post('/saveNaMoney', (req, res) => {
    let id = req.body.id
    let remitMoney = req.body.remitMoney
    let saveNaMoneySql = $sql.regular.saveNaMoney
    conn.query(saveNaMoneySql, [remitMoney, id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '修改网盟汇款金额成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '修改网盟汇款金额失败'}})
        }
    })
})

/*** 删除网盟汇款 ***/
router.post('/removeNaMoney', (req, res) => {
    let id = req.body.id
    let removeNaMoneySql = $sql.regular.removeNaMoney
    conn.query(removeNaMoneySql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除网盟汇款成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除网盟汇款失败'}})
        }
    })
})

/*** 网盟收款查询 ***/
router.post('/seachNamoney', (req, res) => {
    let seachNaId = req.body.seachNaId
    let seachUserId = req.body.seachUserId
    let seachStartTime = req.body.seachStartTime
    let seachEndTime = req.body.seachEndTime
    if(seachUserId !=='' && seachNaId === ''){
        let seachUserIdNamoneySQl = $sql.regular.seachUserIdNamoney
        conn.query(seachUserIdNamoneySQl, [seachUserId,seachStartTime,seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: '查询网盟汇款成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: '查询网盟汇款失败'}})
            }
        })
    }
     if(seachUserId === '' && seachNaId === ''){
        let seachTimeNamoneySql = $sql.regular.seachTimeNamoney
        conn.query(seachTimeNamoneySql, [seachStartTime, seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: '查询网盟汇款成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: '查询网盟汇款失败'}})
            }
        })
    }
    if(seachUserId === '' && seachNaId !== '') {
        let seachNaIdNamoneySQl = $sql.regular.seachNaIdNamoney
        conn.query(seachNaIdNamoneySQl, [seachNaId, seachStartTime, seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: '查询网盟汇款成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: '查询网盟汇款失败'}})
            }
        })
    } 
    if(seachUserId !== '' && seachNaId !== '') {
        let seachUserIdNaId = $sql.regular.seachUserIdNaId
        conn.query(seachUserIdNaId, [seachUserId,seachNaId,seachStartTime,seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: '查询网盟汇款成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: '查询网盟汇款失败'}})
            }
        })
    }
    
})

/*** 添加账户花费 ***/
router.post('/addAccountCost', (req, res) => {
    let userId = req.body.userId
    let accountCost = req.body.accountCost
    let msg = req.body.msg
    let cerateTime = req.body.cerateTime
    let addAccountCostSql = $sql.regular.addAccountCost
    conn.query(addAccountCostSql, [userId, accountCost, msg, cerateTime], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加账户花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加账户花费失败'}})
        }
    })
})

/*** 获取账户花费列表 ***/
router.post('/getAccountCostList', (req, res) => {
    let start = req.body.start
    let end = req.body.end
    let getAccountCostTotalSql = $sql.regular.getAccountCostTotal
    let getAccountCostListSql = $sql.regular.getAccountCostList
    conn.query(getAccountCostTotalSql, (err1, total) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (total) {
            conn.query(getAccountCostListSql, [start, end], (err2, accountCostList) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (accountCostList) {
                    jsonWrite(res, {data: {total:total[0]['count(*)'],list:accountCostList}, meta: {status: 200, msg: '获取账户花费成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '获取账户花费失败'}})
                } 
            })
        }
    })
})

/*** 根据id获取账户花费 ***/
router.post('/getAccountCostById', (req, res) => {
    let id = req.body.id
    let getAccountCostByIdSql = $sql.regular.getAccountCostById
    conn.query(getAccountCostByIdSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result[0], meta: {status: 200, msg: '获取账户花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取账户花费失败'}})
        }
    })
})

/*** 删除账户花费 ***/
router.post('/removeAccountCost', (req, res) => {
    let id = req.body.id
    let removeAccountCostSql = $sql.regular.removeAccountCost
    conn.query(removeAccountCostSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除账户花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除账户花费失败'}})
        }
    })
})

/*** 保存修改账户花费 ***/
router.post('/editAccountCost', (req, res) => {
    let id = req.body.id
    let accountCost = req.body.accountCost
    let msg = req.body.msg
    let editAccountCostSql = $sql.regular.editAccountCost
    conn.query(editAccountCostSql, [accountCost, msg, id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '修改账户花费成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '修改账户花费失败'}})
        }
    })
})

/*** fb账户查询 ***/
router.post('/seachAccountCost', (req, res) => {
    let seachUserId = req.body.seachUserId
    let seachStartTime = req.body.seachStartTime
    let seachEndTime = req.body.seachEndTime
    if (seachUserId === '') {
        let seachTimeAccountCost = $sql.regular.seachTimeAccountCost
        conn.query(seachTimeAccountCost, [seachStartTime, seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: 'fb账户查询成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: 'fb账户查询失败'}})
            }
        })
    } else {
        let seachUserAccountCost = $sql.regular.seachUserAccountCost
        conn.query(seachUserAccountCost, [seachUserId,seachStartTime,seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: 'fb账户查询成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: 'fb账户查询失败'}})
            }
        })
    }
    
})
/*** 添加个人提成 ***/
router.post('/addCommission', (req, res) => {
    let userId = req.body.userId
    let commission = req.body.commission
    let month = parseInt(req.body.month / 1000)
    let cerateTime = parseInt(new Date().getTime() / 1000)
    let addCommissiocommissionnSql = $sql.regular.addCommission
    conn.query(addCommissiocommissionnSql, [userId, commission, month, cerateTime], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加个人提成成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加个人提成失败'}})
        }
    })
})

/*** 获取提成列表 ***/
router.post('/getCommissionList', (req, res) => {
    let start = req.body.start
    let end = req.body.end
    let getCommissionTotalSql = $sql.regular.getCommissionTotal
    let getCommissionListSql = $sql.regular.getCommissionList
    conn.query(getCommissionTotalSql, (err1, total) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (total) {
            conn.query(getCommissionListSql, [start, end], (err2, cmList) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (cmList) {
                    jsonWrite(res, {data: {total:total[0]['count(*)'],list:cmList}, meta: {status: 200, msg: '获取提成列表成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '获取提成失败'}})
                } 
            })
        }
    })
})

/*** 删除提成 ***/
router.post('/removeCommission', (req, res) => {
    let id = req.body.id
    let removeCommissionSql = $sql.regular.removeCommission
    conn.query(removeCommissionSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除个人提成成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除个人提成失败'}})
        }
    })
})



/*** 添加汇率 ***/
router.post('/addExchage', (req, res) => {
    let RMB_USD = req.body.RMB_USD
    let USD_RMB = req.body.USD_RMB
    let month = parseInt(req.body.month / 1000)
    let cerateTime = parseInt(new Date().getTime() / 1000)
    let addExchageSql = $sql.regular.addExchage
    conn.query(addExchageSql, [RMB_USD, USD_RMB, month, cerateTime], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加汇率成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加汇率失败'}})
        }
    })
})

/*** 获取汇率列表 ***/
router.get('/getExchangeList', (req, res) => {
    let getExchangeListSql = $sql.regular.getExchangeList
    conn.query(getExchangeListSql, (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '获取汇率列表成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取汇率列表失败'}})
        }
    })
})

/*** 删除汇率 ***/
router.post('/removeExchange', (req, res) => {
    let id = req.body.id
    let removeExchangeSql = req.body.removeExchange
    conn.query(removeExchangeSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除汇率列表成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除汇率列表失败'}})
        }
    })
})

/*** 获取薪资列表 ***/
router.post('/getPay', (req, res) => {
    let preTime = req.body.preTime
    let getPaySql = $sql.regular.getPay
    conn.query(getPaySql, [preTime,preTime,preTime,preTime,preTime,preTime,preTime,preTime], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '获取薪资成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取薪资列表失败'}})
        }
    })
})

/*** 添加公共收益 ***/
router.post('/addPublic', (req, res) => {
    let naId = req.body.naId
    let cerateTime = req.body.cerateTime
    let publicMoney = req.body.publicMoney
    let msg = req.body.msg
    let addPublicSql = $sql.regular.addPublic
    conn.query(addPublicSql, [naId, publicMoney, msg, cerateTime], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加公共收益成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加公共收益失败'}})
        }
    })
})

/*** 获取公共收益 ***/
router.post('/getPublicList', (req, res) => {
    let start = req.body.start
    let end = req.body.end
    let getPublicTotalSql = $sql.regular.getPublicTotal
    let getPublicListSql = $sql.regular.getPublicList
    conn.query(getPublicTotalSql, (err1, total) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (total) {
            conn.query(getPublicListSql, [start, end], (err2, publicList) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (publicList) {
                    jsonWrite(res, {data: {total:total[0]['count(*)'],list:publicList}, meta: {status: 200, msg: '获取公共收益成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '获取公共收益失败'}})
                } 
            })
        }
    })
})

/*** 根据id获取公共收益信息 ***/
router.post('/getPublicById', (req, res) => {
    let id = req.body.id
    let getPublicByIdSql = $sql.regular.getPublicById
    conn.query(getPublicByIdSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result[0], meta: {status: 200, msg: '获取公共收益成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取公共收益失败'}})
        }
    })
})

/*** 保存修改公共收益 ***/
router.post('/saveEditPublic', (req, res) => {
    let naId = req.body.naId
    let publicMoney = req.body.publicMoney
    let msg = req.body.msg
    let id = req.body.id
    let saveEditPublicSql = $sql.regular.saveEditPublic
    conn.query(saveEditPublicSql, [naId, publicMoney, msg, id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '修改公共收益成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '修改公共收益失败'}})
        }
    })
})

/*** 删除公共收益 ***/
router.post('/removePublic', (req, res) => {
    let id = req.body.id
    let removePublicSql = $sql.regular.removePublic
    conn.query(removePublicSql, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除公共收益成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除公共收益失败'}})
        }
    })
})

/*** 查询公共收益 ***/
router.post('/seachPublic', (req, res) => {
    let seachNaId = req.body.seachNaId
    let seachStartTime = req.body.seachStartTime
    let seachEndTime = req.body.seachEndTime
    if (seachNaId === '') {
        let seachTimePublic = $sql.regular.seachTimePublic
        conn.query(seachTimePublic, [seachStartTime, seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: '查询公共收益成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: '查询公共收益失败'}})
            } 
        })
    } else {
        let seachNaIdPublic = $sql.regular.seachNaIdPublic
        conn.query(seachNaIdPublic, [seachNaId, seachStartTime, seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: '查询公共收益成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: '查询公共收益失败'}})
            } 
        }) 
    }
})
//获取收益
router.post('/getProfit', (req, res) => {
    let preTime = req.body.preTime
    let getProfitToolCost = $sql.regular.getProfitToolCost
    let getProfitNaMoney = $sql.regular.getProfitNaMoney
    let getProfitpublicMoney = $sql.regular.getProfitpublicMoney
    let getProfitAdCost = $sql.regular.getProfitAdCost
    let list = []
    for(var i =01;i<=31;i++) {
        if(i<10){
            list.push({
                date: '0' + i,
                toolCost: 0,
                NaMoney: 0,
                adCost: 0,
                profit: 0
            })
        }else{
            list.push({
                date: i + '',
                toolCost: 0,
                NaMoney: 0,
                adCost: 0,
                profit: 0
            })
        }
    }
    conn.query(getProfitToolCost, [preTime,preTime], (err1, toolCost) => {
        if (err1) {
            jsonWrite(res, {data: err1, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (toolCost) {
            for(var x=0;x<list.length;x++) {
                for (var y=0;y<toolCost.length;y++) {
                    if(list[x].date === toolCost[y].date){
                        list[x].toolCost = toolCost[y].toolCost
                    }
                }
            }
            conn.query(getProfitNaMoney,[preTime],(err2, NaMoney) => {
                if (err2) {
                    jsonWrite(res, {data: err1, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (NaMoney) {
                    for(var x=0;x<list.length;x++) {
                        for (var y=0;y<NaMoney.length;y++) {
                            if(list[x].date === NaMoney[y].date){
                                list[x].NaMoney = NaMoney[y].remitMoney
                            }
                        }
                    }
                    conn.query(getProfitpublicMoney, [preTime], (err3,publicMoney) => {
                        if (err3) {
                            jsonWrite(res, {data: err1, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                        }
                        if (publicMoney) {
                            for(var x=0;x<list.length;x++) {
                                for (var y=0;y<publicMoney.length;y++) {
                                    if(list[x].date === publicMoney[y].date){
                                        list[x].NaMoney = list[x].NaMoney + publicMoney[y].publicMoney
                                    }
                                }
                            }
                            conn.query(getProfitAdCost, [preTime], (err4, adCost) => {
                                if (err4) {
                                    jsonWrite(res, {data: err1, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                                }
                                if (adCost) {
                                    for(var x=0;x<list.length;x++) {
                                        for (var y=0;y<adCost.length;y++) {
                                            if(list[x].date === adCost[y].date){
                                                list[x].adCost = adCost[y].adCost
                                            }
                                        }
                                    }
                                    let getMonthDomain = $sql.regular.getMonthDomain
                                    conn.query(getMonthDomain, [preTime], (err5, domainPrice) => {
                                        if (err5) {
                                            jsonWrite(res, {data: err1, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                                        }
                                        if (domainPrice) {
                                            for(var x=0;x<list.length;x++) {
                                                for (var y=0;y<domainPrice.length;y++) {
                                                    if(list[x].date === domainPrice[y].date){
                                                        list[x].toolCost = list[x].toolCost + domainPrice[y].domainPrice
                                                    }
                                                }
                                            }
                                            for(var i=0;i<31;i++) {
                                                list[i].profit = list[i].NaMoney - list[i].toolCost - list[i].adCost
                                                
                                            }
                                            jsonWrite(res, {data: list, meta: {status: 200, msg: '收益数据获取成功'}}) 
                                        }
                                    })




                                    
                                }
                            })
                        }
                        
                    })
                }
            })
        }
    })
})

//添加转化
router.post('/addTransform', (req, res) => {
    let userId = req.body.userId
    let number = req.body.number
    let cerateTime = req.body.cerateTime
    let addTransformSql = $sql.regular.addTransform
    conn.query(addTransformSql, [userId, number, cerateTime], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '添加转化成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '添加转化失败'}})
        }
    })
})

//获取转化
router.post('/getTransform', (req, res) => {
    let start = req.body.start
    let end = req.body.end
    let  getTransformTotal = $sql.regular.getTransformTotal
    let getTransformSql = $sql.regular.getTransformList
    conn.query(getTransformTotal, (err1, total) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (total) {
            conn.query(getTransformSql, [start, end], (err2, list) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (list) {
                    jsonWrite(res, {data: {total: total[0]['count(*)'],list: list}, meta: {status: 200, msg: '获取转化成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '获取转化失败'}})
                }
            })
        }
    })    
})

//删除转化
router.post('/removeTransform', (req, res) => {
    let id = req.body.id
    let removeTransform = $sql.regular.removeTransform
    conn.query(removeTransform, [id], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '删除转化成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '删除转化失败'}})
        }
    })
})

//查询公共收益
router.post('/seachTransform', (req, res) => {
    let seachUserId = req.body.seachUserId
    let seachStartTime = req.body.seachStartTime
    let seachEndTime = req.body.seachEndTime
    if (seachUserId === '') {
        let seachTimeTransform = $sql.regular.seachTimeTransform
        conn.query(seachTimeTransform, [seachStartTime, seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: '查询公共收益成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: '查询公共收益失败'}})
            }
        })
    } else {
        let seachUserTransform = $sql.regular.seachUserTransform
        conn.query(seachUserTransform, [seachUserId,seachStartTime, seachEndTime], (err, result) => {
            if (err) {
                jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
            }
            if (result) {
                jsonWrite(res, {data: result, meta: {status: 200, msg: '查询公共收益成功'}})
            } else {
                jsonWrite(res, {data: null, meta: {status: 201, msg: '查询公共收益失败'}})
            }
        })
    }
})

//查询ROI
router.post('/seachRoi', (req, res) => {
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
                ROI: 0
            })
        }else{
            list.push({
                date: i + '',
                adCost: 0,
                accountCost: 0,
                number: 0,
                NaMoney: 0,
                profit: 0,
                ROI: 0
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
                                        list[i].ROI = list[i].NaMoney/(list[i].adCost+list[i].accountCost)
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

//广告收支表
router.post('/getAdRevenue', (req, res) => {
    let preTime = req.body.preTime
    let getAdRevenueAdCost = $sql.regular.getAdRevenueAdCost
    let getBlitzAdsGroupList = $sql.regular.getBlitzAdsGroupList
    let list = []
    for(var i =01;i<=31;i++) {
        if(i<10){
            list.push({
                date: '0' + i,
                adCost: 0,
                handlingFee: 0,
                BlitzAdsGroup: 0,
                mobooka: 0,
                ADEER: 0,
                profit: 0
            })
        }else{
            list.push({
                date: i + '',
                adCost: 0,
                handlingFee: 0,
                BlitzAdsGroup: 0,
                mobooka: 0,
                ADEER: 0,
                profit: 0
            })
        }
    }
    conn.query(getAdRevenueAdCost, [preTime], (err1, adCost) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (adCost) {
            for (var x=0;x<list.length;x++){
                for(var y=0;y<adCost.length;y++){
                    if(list[x].date == adCost[y].date){
                        list[x].adCost = (adCost[y].adCost).toFixed(2)
                        list[x].handlingFee = ((list[x].adCost) * 0.03).toFixed(2)
                    }
                }
            }
            conn.query(getBlitzAdsGroupList, [preTime, 19], (err2, BlitzAdsGroup) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (BlitzAdsGroup) {
                    for (var x=0;x<list.length;x++){
                        for(var y=0;y<BlitzAdsGroup.length;y++){
                            if(list[x].date == BlitzAdsGroup[y].date){
                                list[x].BlitzAdsGroup = (BlitzAdsGroup[y].remitMoney).toFixed(2)
                            }
                        }
                    }
                    conn.query(getBlitzAdsGroupList, [preTime, 20], (err3, mobooka) => {
                        if (err3) {
                            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                        }
                        if (mobooka) {
                            for (var x=0;x<list.length;x++){
                                for(var y=0;y<mobooka.length;y++){
                                    if(list[x].date == mobooka[y].date){
                                        list[x].mobooka = (mobooka[y].remitMoney).toFixed(2) 
                                    }
                                }
                            }
                            conn.query(getBlitzAdsGroupList, [preTime, 21], (err4, ADEER) => {
                                if (err4) {
                                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                                }
                                if (ADEER) {
                                    for (var x=0;x<list.length;x++){
                                        for(var y=0;y<ADEER.length;y++){
                                            if(list[x].date == ADEER[y].date){
                                                list[x].ADEER = (ADEER[y].remitMoney).toFixed(2) 
                                            }
                                        }
                                    }
                                    list.forEach(item => {
                                        item.profit = (Number(item.BlitzAdsGroup) + Number(item.mobooka) + Number(item.ADEER) - item.handlingFee - item.adCost).toFixed(2)
                                    })
                                    jsonWrite(res, {data: list, meta: {status: 200, msg: '获取广告收支列表成功'}})
                                }
                            })
                        }
                    })
                }
            })


            
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '获取广告收支列表失败'}})
        }
    })

})

//合并利润表
router.post('/getMergeProfit', (req, res) => {
    let preTime = req.body.preTime
    let getMergeProfit = $sql.regular.getMergeProfit
    conn.query(getMergeProfit, [preTime,preTime,preTime,preTime,preTime,preTime], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '广告合并利润表获取成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '广告合并利润表获取失败'}})
        }
    })
})

/***  充值 ***/
router.post('/addMoney', (req, res) => {
    let price = req.body.price
    let cerateTime = parseInt(new Date().getTime() / 1000)
    let seachPerbalance = $sql.regular.seachPerbalance
    let addMoney = $sql.regular.addMoney
    conn.query(seachPerbalance, (err1, perBalance) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (perBalance) {
            let balance = Number(perBalance[0].balance) + Number(price)
            conn.query(addMoney, [13, price, balance, '充值',0, cerateTime], (err2, result) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (result) {
                    jsonWrite(res, {data: result, meta: {status: 200, msg: '充值成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '充值失败'}})
                }
            })
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '查询余额失败！'}}) 
        }
    })
})

/*** 获取信用卡费用列表 ***/
router.post('/getMoney', (req, res) => {
    let getMoney = $sql.regular.getMoney
    conn.query(getMoney, (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '余额列表成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '余额列表失败'}})
        }
    })
})

/*** 添加信用卡消费 ***/
router.post('/outMoney', (req, res) => {
    let userId = req.body.userId
    let price = req.body.price
    let msg = req.body.msg  
    let cerateTime = req.body.cerateTime
    let seachPerbalance = $sql.regular.seachPerbalance
    let outToolMoney = $sql.regular.outToolMoney
    conn.query(seachPerbalance, (err1, perBalance) => {
        if (err1) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (perBalance) {
            let balance = Number(perBalance[0].balance) - Number(price)
            conn.query(outToolMoney, [userId, price, balance, msg, 1, cerateTime], (err2, result) => {
                if (err2) {
                    jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
                }
                if (result) {
                    jsonWrite(res, {data: result, meta: {status: 200, msg: '信用卡消费添加成功'}})
                } else {
                    jsonWrite(res, {data: null, meta: {status: 201, msg: '信用卡消费添加失败'}})
                }
            })
        }
    })
})

/*** 信用卡消费记录查询 ***/
router.post('/seachMoney', (req, res) => {
    let seachStartTime= req.body.seachStartTime
    let seachEndTime = req.body.seachEndTime
    let seachMoney = $sql.regular.seachMoney
    conn.query(seachMoney, [seachStartTime, seachEndTime], (err, result) => {
        if (err) {
            jsonWrite(res, {data: null, meta: {status: 400, msg: '系统出现问题，请联系技术人员！'}}) 
        }
        if (result) {
            jsonWrite(res, {data: result, meta: {status: 200, msg: '信用卡消费查询成功'}})
        } else {
            jsonWrite(res, {data: null, meta: {status: 201, msg: '信用卡消费查询失败'}})
        }
    })
})

module.exports = router
