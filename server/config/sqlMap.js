var sqlMap = {
    user: {
        seachUser: 'select id,email,name,roleId from users where email = ? and password = ? and state = 1',
        userList: 'select users.*,roles.roleName from users,roles where users.roleId = roles.id',
        addUser: 'insert into users (name,password,email,iphone,roleId,state,create_time) values (?,?,?,?,2,?,?)',
        getUserById:'select * from users where id = ?',
        editUser: 'update users set price = ?, commission = ?, state = ? where id = ?',
        removeUserById: 'delete from users where id = ?',
        getRoles: 'select * from roles',
        editUserRole: 'update users set roleId = ? where id = ?'
    },
    power: {
        getRightList: 'select * from rights ORDER BY level ASC',
        getRoleList: 'select roles.id,roles.roleName,roles.roleDesc,rights.authName,rights.path,(rights.id)as rightId,rights.rights_id from rights,roles WHERE find_in_set(rights.id,roles.rightsId)',
        removeRoleById: 'delete from roles where id = ?',
        addRole: "insert into roles (roleName, roleDesc, rightsId) values (?, ?, '1')",
        getAllRights: 'select * from rights ORDER BY level ASC',
        portionRight: 'update roles set rightsId = ? where id = ?'
    },
    regular: {
        addRegular: 'insert into regulars (regName) values (?)',
        geetRegularTotal: 'select count(*) from regulars',
        getRegularList: 'select * from regulars ORDER BY id DESC',
        editRegular: 'update regulars set regName = ? where id = ?',
        removeRegular: 'delete from regulars where id = ?',
        addSpendDay: 'insert into spendday (regId, cost, cerateTime) values (?, ?, ?)',
        getSpendDayTotal: 'select count(*) from spendday',
        getSpendDayList: 'select spendday.*,regulars.regName from spendday,regulars where spendday.regId = regulars.id ORDER BY spendday.id DESC LIMIT ? , ?',
        removeSpendDay: 'delete from spendday where id = ?',
        getSpendDayById: 'select id,cost from spendday where id = ?',
        editSpendDayCost: 'update spendday set cost = ? where id = ?',
        addTool: 'insert into tools (toolName) values (?)',
        getToolTotal: 'select count(*) from tools',
        getToolList: 'select * from tools ORDER BY id DESC LIMIT ? , ?',
        removeTool: 'delete from tools where id = ?',
        editTool: 'update tools set toolName = ? where id = ?',
        getTools: 'select * from tools',
        addToolCost: 'insert into toolcost (userId, toolId, toolCost, cerateTime) values (?, ?, ?, ?)',
        getToolCostTotal: 'select count(*) from toolcost',
        getToolCostList: 'select toolcost.*,tools.toolName,users.name from toolcost,tools,users where toolcost.toolId = tools.id and toolcost.userId = users.id ORDER BY toolcost.id DESC LIMIT ? , ?',
        removeToolCost: 'delete from toolcost where id = ?',
        getToolCostById: 'select id,toolCost from toolcost where id = ?',
        editToolCost: 'update toolcost set toolCost = ? where id = ?',
        addAdvertisers: 'insert into advertisers (adName, cerateTime) values (?, ?)',
        getAdvertiserstotal: 'select count(*) from advertisers',
        getAdvertisers: 'select * from advertisers ORDER BY id DESC LIMIT ? , ?',
        removeAd: 'delete from advertisers where id = ?',
        getUserList: 'select * from users where state = 1',
        getAdList: 'select id,adName from advertisers',
        addAdCost: 'insert into adcost (userId, adId, accountCost, adCost, formalities, cerateTime) values (?, ?, ?, ?, ?, ?)',
        getAdCostTotal: 'select count(*) from adcost',
        getAdCostList: 'select adcost.*,users.name,advertisers.adName from adcost,users,advertisers where adcost.userId = users.id and adcost.adId = advertisers.id ORDER BY adcost.id DESC LIMIT ? , ?',
        removeAdCost: 'delete from adcost where id = ?',
        getAdCostById: 'select id, accountCost, adCost, formalities from adcost where id = ?',
        editAdCost: 'update adcost set accountCost = ?, adCost = ?, formalities = ? where id = ?',
        addNetAlliances: 'insert into netalliances (naName, cerateTime) values (?, ?)',
        getNetAlliancestotal: 'select count(*) from netalliances',
        getNetAlliances: 'select * from netalliances ORDER BY id DESC LIMIT ? , ?',
        removeNa: 'delete from netalliances where id = ?',
        getNetAlliance: 'select * from netalliances',
        addNaMoney: 'insert into netalliancemoney (userId, naId, remitMoney, cerateTime) values (?, ?, ?, ?)',
        getNaMoneyTotal: 'select count(*) from netalliancemoney',
        getNaMoneyList: 'select netalliancemoney.*,netalliances.naName,users.name from netalliancemoney,netalliances,users where netalliancemoney.naId = netalliances.id and netalliancemoney.userId = users.id ORDER BY netalliancemoney.id DESC LIMIT ? , ?',
        getNaMoneyById: 'select id,remitMoney from netalliancemoney where id = ?',
        saveNaMoney: 'update netalliancemoney set remitMoney = ? where id = ?',
        removeNaMoney: 'delete from netalliancemoney where id = ?',
        addAccountCost: 'insert into accountcost (userId, accountCost, msg, cerateTime) values (?, ?, ?, ?)',
        getAccountCostTotal: 'select count(*) from accountcost',
        getAccountCostList: 'select accountcost.*,users.name from accountcost,users where accountcost.userId = users.id ORDER BY accountcost.id DESC LIMIT ? , ?',
        removeAccountCost: 'delete from accountcost where id = ?',
        getAccountCostById: 'select id,accountCost,msg from accountcost where id = ?',
        editAccountCost: 'update accountcost set accountCost = ?, msg = ? where id = ?',
        addCommission: 'insert into commission (userId, commission, month, cerateTime) values (?, ?, ?, ?)',
        getCommissionTotal: 'select count(*) from commission',
        getCommissionList: 'select commission.*,users.name from commission,users where commission.userId = users.id ORDER BY commission.id DESC LIMIT ? , ?',
        removeCommission: 'delete from commission where id = ?',
        addExchage: 'insert into exchange (RMB_USD, USD_RMB, month, cerateTime) values (?, ?, ?, ?)',
        getExchangeList: 'select * from exchange ORDER BY id DESC',
        removeExchange: 'delete from exchange where id = ?',
        addPublic: 'insert into public (naId, publicMoney, msg, cerateTime) values (?, ?, ?, ?)',
        getPublicTotal: 'select count(*) from public',
        getPublicList: 'select public.*,netalliances.naName from public,netalliances where public.naId = netalliances.id ORDER BY public.id DESC LIMIT ? , ?',
        getPublicById: 'select * from public where id = ?',
        saveEditPublic: 'update public set naId = ?, publicMoney = ?, msg = ? where id = ?',
        removePublic: 'delete from public where id = ?',
        getProfitToolCost: `SELECT FROM_UNIXTIME(cerateTime,'%d') as date,sum(toolCost) as toolCost,(select RMB_USD FROM exchange WHERE FROM_UNIXTIME(?,'%Y-%m') = FROM_UNIXTIME(month,'%Y-%m'))AS RMB_USD FROM toolcost WHERE FROM_UNIXTIME(?,'%Y-%m') = FROM_UNIXTIME(cerateTime,'%Y-%m') GROUP BY date`,
        getProfitNaMoney: `SELECT FROM_UNIXTIME(cerateTime,'%d') as date,sum(remitMoney) as remitMoney FROM netalliancemoney WHERE FROM_UNIXTIME(?,'%Y-%m') = FROM_UNIXTIME(cerateTime,'%Y-%m') GROUP BY date`,
        getProfitpublicMoney: `SELECT FROM_UNIXTIME(cerateTime,'%d') as date,sum(publicMoney) as publicMoney FROM public WHERE FROM_UNIXTIME(?,'%Y-%m') = FROM_UNIXTIME(cerateTime,'%Y-%m') GROUP BY date`,
        getProfitAdCost: `SELECT FROM_UNIXTIME(cerateTime,'%d') as date,sum(accountCost+adCost*(1+formalities)) as adCost FROM adcost WHERE FROM_UNIXTIME(?,'%Y-%m') = FROM_UNIXTIME(cerateTime,'%Y-%m') GROUP BY date`,
        addTransform: 'insert into transform (userId, number, cerateTime) values (?, ?, ?)',
        getTransformTotal: 'select count(*) from transform',
        getTransformList: 'select transform.*,users.name from transform,users where transform.userId = users.id ORDER BY transform.id DESC LIMIT ? , ?',
        removeTransform: 'delete from transform where id = ?',
        getRoiAdCost: `SELECT FROM_UNIXTIME(cerateTime,'%d') as date,sum(accountCost+adCost*(1+formalities)) as adCost FROM adcost WHERE userId = ? and FROM_UNIXTIME(?,'%Y-%m') = FROM_UNIXTIME(cerateTime,'%Y-%m') GROUP BY date`,
        getRoiAccountCost:`SELECT FROM_UNIXTIME(cerateTime,'%d') as date,sum(accountCost) as accountCost FROM accountcost WHERE userId = ? and FROM_UNIXTIME(?,'%Y-%m') = FROM_UNIXTIME(cerateTime,'%Y-%m') GROUP BY date`,
        getRoiNumber: `SELECT FROM_UNIXTIME(cerateTime,'%d') as date,sum(number) as number FROM transform WHERE userId = ? and FROM_UNIXTIME(?,'%Y-%m') = FROM_UNIXTIME(cerateTime,'%Y-%m') GROUP BY date`,
        getRoiNaMoney: `SELECT FROM_UNIXTIME(cerateTime,'%d') as date,sum(remitMoney) as NaMoney FROM netalliancemoney WHERE userId = ? and FROM_UNIXTIME(?,'%Y-%m') = FROM_UNIXTIME(cerateTime,'%Y-%m') GROUP BY date`,
        getPayList:`         
SELECT
    u.name,
    u.price,
    c.commission,
    e.RMB_USD,
    e.USD_RMB,
    (SELECT SUM(m.remitMoney) FROM netalliancemoney m where m.cerateTime >= ? AND m.cerateTime <= ?) AS remitMoneyTotal,
    (SELECT SUM(s.cost) FROM spendday s where s.cerateTime >= ? AND s.cerateTime <= ?) AS costTotal,
    (SELECT SUM(t.toolCost) FROM toolcost t where t.cerateTime >= ? AND t.cerateTime <= ?) AS toolCostTotal,
    (SELECT SUM(ad.accountCost + ad.adCost *(1 + ad.formalities)) as adTotal FROM adcost ad where ad.cerateTime >= ? AND ad.cerateTime <= ?) AS adTotal,
    (SELECT SUM(d.price) FROM domains d where d.cerateTime >= ? AND d.cerateTime <= ?) AS domainTotal
FROM 
    users u,
    commission c,
    exchange e
WHERE 
    u.roleId = 4 
    AND c.userId = u.id 
    AND c.month = ? 
    AND e.month = ?
        `,



    },
    domain: {
        getUserList: 'select id,name from users where state = 1',
        addDmoain: 'insert into domains (userId, domain, price, cerateTime) values (?, ?, ?, ?)',
        domainTotal: 'select count(*) from domains',
        domainList: 'select domains.*,users.name from domains,users where domains.userId = users.id ORDER BY domains.id DESC LIMIT ? , ?'
    },
    home: {
        getMenuList: 'select * from rights'
    }
}

module.exports = sqlMap