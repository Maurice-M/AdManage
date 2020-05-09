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
    let cerateTime = parseInt(new Date().getTime() / 1000)
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
    let toolCost = req.body.toolCost
    let cerateTime = parseInt(new Date().getTime() / 1000)
    let addToolCostSql = $sql.regular.addToolCost
    conn.query(addToolCostSql, [toolId, toolCost, cerateTime], (err, result) => {
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
    let cerateTime = parseInt(new Date().getTime() / 1000)
    let addAdCostSql = $sql.regular.addAdCost
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
    let cerateTime = parseInt(new Date().getTime() / 1000)
    let addNaMoneySql = $sql.regular.addNaMoney
    conn.query(addNaMoneySql, [naId, remitMoney, cerateTime], (err, result) => {
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

/*** 添加账户花费 ***/
router.post('/addAccountCost', (req, res) => {
    let userId = req.body.userId
    let accountCost = req.body.accountCost
    let msg = req.body.msg
    let cerateTime = parseInt(new Date().getTime() / 1000)
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
module.exports = router
