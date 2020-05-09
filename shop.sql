create table domains (
  id int(11) NOT NULL auto_increment,
  userId int(11),
  domain varchar(64),
  cerateTime int(13),
  PRIMARY KEY  (id)
);






























CREATE TABLE `attributes` (
  `id` int(11) NOT NULL,
  `attrName` varchar(64) DEFAULT NULL,
  `zhAttrName` varchar(64) DEFAULT NULL,
  `cateId` int(11) DEFAULT NULL,
  `sel` varchar(32) DEFAULT NULL,
  `vals` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `attributes`
--

INSERT INTO `attributes` (`id`, `attrName`, `zhAttrName`, `cateId`, `sel`, `vals`) VALUES
(1, 'Style', '品牌', 10, 'many', '三枪,七匹狼,利郎,海澜之家'),
(2, 'Material composition: cotton 100%', '材质成分: 棉100%', 10, 'only', ''),
(3, 'Thickness: conventional', '厚薄: 常规', 10, 'only', '1111'),
(4, 'Sleeve type: conventional', '袖型：常规', 10, 'only', '是'),
(5, 'ceshi11111111', '测试参数1111111111', 17, 'many', ''),
(6, 'cshi2', '测试参数2', 17, 'many', ''),
(7, 'ceshishuxing', '测试属性1', 17, 'only', ''),
(9, 'type', '款式', 10, 'many', '222,111,33333');

-- --------------------------------------------------------

--
-- 表的结构 `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `cateName` varchar(32) DEFAULT NULL,
  `zhCateName` varchar(32) NOT NULL,
  `catePid` int(11) DEFAULT NULL,
  `cateLevel` int(11) DEFAULT NULL,
  `cateDeleted` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `categories`
--

INSERT INTO `categories` (`id`, `cateName`, `zhCateName`, `catePid`, `cateLevel`, `cateDeleted`) VALUES
(1, 'Men\'s', '男装', 0, 0, 0),
(2, 'Women', '女装', 0, 0, 0),
(4, 'coat', '男士外套', 1, 1, 0),
(5, 'pants', '男士裤装', 1, 1, 0),
(6, 'inner', '男士内搭', 1, 1, 0),
(7, 'shoes', '男士鞋服', 1, 1, 0),
(8, 'Romantic dress', '浪漫裙装', 2, 1, 0),
(9, 'Women\'s pants', '女士下装', 2, 1, 0),
(10, 'T', 'T恤', 4, 2, 0),
(11, 'ceshi1', '测试1', 0, 0, 0),
(12, 'ceshi2', '测试2', 11, 0, 0),
(14, '测试3', '测试3', 0, 0, 0),
(15, '测试4', '测试4', 0, 0, 0),
(17, 'ceshi no.3 测试呀啦啦啦啦', '测试 3吉目录 测试呀啦啦啦啦', 9, 2, 0);

-- --------------------------------------------------------

--
-- 表的结构 `commission`
--

CREATE TABLE `commission` (
  `id` int(11) NOT NULL,
  `comNumber` varchar(64) NOT NULL,
  `sellerId` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `commission`
--

INSERT INTO `commission` (`id`, `comNumber`, `sellerId`) VALUES
(1, '1586827982', '607648754360'),
(2, '1586827994', '592177906420'),
(3, '1586828014', '586036348851'),
(4, '1586828021', '606477210801'),
(5, '1586828022', '557680917467');

-- --------------------------------------------------------

--
-- 表的结构 `commissionprop`
--

CREATE TABLE `commissionprop` (
  `id` int(11) NOT NULL,
  `comNumber` varchar(64) DEFAULT NULL,
  `option1` varchar(64) DEFAULT NULL,
  `option2` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `commissionprop`
--

INSERT INTO `commissionprop` (`id`, `comNumber`, `option1`, `option2`) VALUES
(39, '1586828024', '颜色', ' 浅色系,深色系,藏青色系,酒红色系'),
(40, '1586828024', '尺码', '均码'),
(43, '1586828021', '颜色', '绿色,棕色'),
(44, '1586828021', '尺码', '均码');

-- --------------------------------------------------------

--
-- 表的结构 `commissionsku`
--

CREATE TABLE `commissionsku` (
  `id` int(11) NOT NULL,
  `comNumber` varchar(64) DEFAULT NULL,
  `skuNumber` varchar(64) DEFAULT NULL,
  `sku` varchar(128) DEFAULT NULL,
  `sellerSkuId` int(13) DEFAULT NULL,
  `state` int(13) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `commissionsku`
--

INSERT INTO `commissionsku` (`id`, `comNumber`, `skuNumber`, `sku`, `sellerSkuId`, `state`) VALUES
(1, '1586828024', '158682802400', ' 浅色系-均码', 10, 0),
(2, '1586828024', '158682802410', '深色系-均码', 9, 0),
(3, '1586828024', '158682802420', '藏青色系-均码', 8, 0),
(4, '1586828024', '158682802430', '酒红色系-均码', 7, 0),
(37, '1586828021', '158682802100', '绿色-均码', 23, 0),
(38, '1586828021', '158682802110', '棕色-均码', 22, 0);

-- --------------------------------------------------------

--
-- 表的结构 `menu`
--

CREATE TABLE `rights` (
  `id` int(11) NOT NULL,
  `authName` varchar(32) DEFAULT NULL,
  `path` varchar(32) DEFAULT NULL,
  `level` int(13) NOT NULL,
  `rights_id` int(11) NOT NULL,
  `create_time` bigint(13) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `menu`
--

INSERT INTO `rights` (`id`, `authName`, `path`, `level`, `rights_id`, `create_time`) VALUES
(1, '用户管理', 'users', 0, 0, 25541343434),
(2, '商品管理', 'goods', 0, 0, 25541343434),
(3, '订单管理', 'orders', 0, 0, 25541343434),
(4, '权限管理', 'rights', 0, 0, 25541343434),
(5, '用户列表', 'users', 1, 1, 25541343434),
(6, '商品列表', 'goods', 1, 2, 25541343434),
(7, '订单列表', 'orders', 1, 3, 25541343434),
(8, '权限列表', 'rights', 1, 4, 25541343434),
(9, '角色列表', 'roles', 1, 4, 1586247773),
(10, '添加用户', 'addUser', 1, 1, 1586247773),
(11, '添加商品', 'addGood', 1, 2, 1586247773),
(12, '添加订单', 'addOrder', 1, 3, 1586247773),
(13, '分类参数', 'params', 1, 2, 1586247773),
(14, '商品分类', 'Categories', 1, 2, 1586247773),
(15, '货源管理', 'sellers', 0, 0, 1586247773),
(16, '货源列表', 'sellers', 1, 15, 1586247773),
(17, '自定义商品列表', 'commission', 1, 15, 1586247773);

-- --------------------------------------------------------

--
-- 表的结构 `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `roleName` varchar(32) DEFAULT NULL,
  `roleDesc` varchar(64) DEFAULT NULL,
  `rightsId` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `roles`
--

INSERT INTO `roles` (`id`, `roleName`, `roleDesc`, `rightsId`) VALUES
(1, '超级管理员', '超级管理员', '1,5,10,2,6,11,13,3,7,12,4,8,9'),
(2, '未分配角色', '联系管理员分配角色', '6,2'),
(3, '客服', '卖萌卖萌卖萌卖萌', '6,3,7,12,2'),
(4, '投放', '加油加油加油加油加油', '6,7,2,3'),
(6, '财务', '早日实现财务自由', '6,7,2,3');

-- --------------------------------------------------------

--
-- 表的结构 `sellers`
--

CREATE TABLE `sellers` (
  `id` int(11) NOT NULL,
  `origin` varchar(64) DEFAULT NULL,
  `seller` varchar(64) DEFAULT NULL,
  `sellerId` varchar(128) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `url` varchar(512) DEFAULT NULL,
  `images` varchar(512) DEFAULT NULL,
  `cerateTime` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `sellers`
--

INSERT INTO `sellers` (`id`, `origin`, `seller`, `sellerId`, `name`, `url`, `images`, `cerateTime`) VALUES
(1, '1688', 'LIAOSHI KEER QIAOWA/廖氏可儿俏娃官方旗舰店', '565657388812', '品牌女装2019秋装新款不规则牛仔裙 复古腰带刺绣中袖连衣裙82083', 'https://detail.1688.com/offer/565657388812.html?spm=a312h.2018_new_sem.dh_002.5.10ee6a48bp6RyJ&tracelog=p4p&clickid=261c28b898724b7e9ce6171d06f752c3&sessionid=606588208c7609d596cfddbbbfc4f10b', 'https://cbu01.alicdn.com/img/ibank/2018/573/574/8663475375_1780044008.jpg,https://cbu01.alicdn.com/img/ibank/2018/369/010/8620010963_1780044008.jpg,https://cbu01.alicdn.com/img/ibank/2018/202/067/8585760202_1780044008.jpg,https://cbu01.alicdn.com/img/ibank/2018/521/738/8605837125_1780044008.jpg,https://cbu01.alicdn.com/img/ibank/2018/157/337/8585733751_1780044008.jpg,https://cbu01.alicdn.com/img/ibank/2018/855/037/8585730558_1780044008.jpg', 1586747960),
(2, '1688', '东莞市大朗荣姿服饰厂', '599436203258', '针织连衣裙女长袖秋冬新款韩版拼接不规则复古修身长裙厂家', 'https://detail.1688.com/offer/599436203258.html?spm=a312h.2018_new_sem.dh_002.37.10ee6a48bp6RyJ&tracelog=p4p&clickid=b9542c3fede34e95a57fc05039dcd1c2&sessionid=606588208c7609d596cfddbbbfc4f10b', 'https://cbu01.alicdn.com/img/ibank/2019/100/049/11553940001_2058389640.jpg,https://cbu01.alicdn.com/img/ibank/2019/282/546/11585645282_2058389640.jpg,https://cbu01.alicdn.com/img/ibank/2019/257/336/11585633752_2058389640.jpg,https://cbu01.alicdn.com/img/ibank/2019/290/156/11585651092_2058389640.jpg,https://cbu01.alicdn.com/img/ibank/2019/205/936/11585639502_2058389640.jpg,https://cbu01.alicdn.com/img/ibank/2019/518/546/11585645815_2058389640.jpg', 2147483647),
(3, '1688', '深圳市福田区语言尚品服饰厂', '557680917467', '2019秋季经典大码女装长袖针织韩版修身显瘦两件套连衣裙长裙', 'https://detail.1688.com/offer/557680917467.html?spm=a312h.2018_new_sem.dh_002.23.10ee6a48bp6RyJ&tracelog=p4p&clickid=1792dbaa93bb4d3dae8ea1356e4e264a&sessionid=606588208c7609d596cfddbbbfc4f10b', 'https://cbu01.alicdn.com/img/ibank/2017/075/734/4609437570_1348415983.jpg,https://cbu01.alicdn.com/img/ibank/2017/400/854/4609458004_1348415983.jpg,https://cbu01.alicdn.com/img/ibank/2017/471/944/4609449174_1348415983.jpg,https://cbu01.alicdn.com/img/ibank/2017/281/944/4609449182_1348415983.jpg,https://cbu01.alicdn.com/img/ibank/2017/040/554/4609455040_1348415983.jpg', 2147483647),
(4, '1688', '浦江县蓬勃电子商务商行', '586036348851', '2018秋冬长款蕾丝拼接针织连衣裙 新款ins半高领套头毛衣女打底衫', 'https://detail.1688.com/offer/586036348851.html?spm=a312h.2018_new_sem.dh_002.33.10ee6a48bp6RyJ&tracelog=p4p&clickid=ae5429bbc5ca4beb948c85510d032654&sessionid=606588208c7609d596cfddbbbfc4f10b', 'https://cbu01.alicdn.com/img/ibank/2018/968/241/9719142869_1363674945.jpg,https://cbu01.alicdn.com/img/ibank/2018/948/840/9745048849_1363674945.jpg,https://cbu01.alicdn.com/img/ibank/2018/204/470/9768074402_1363674945.jpg,https://cbu01.alicdn.com/img/ibank/2018/957/360/9745063759_1363674945.jpg,https://cbu01.alicdn.com/img/ibank/2018/187/664/9753466781_1363674945.jpg,https://cbu01.alicdn.com/img/ibank/2018/683/380/9768083386_1363674945.jpg,https://cbu01.alicdn.com/img/ibank/2018/744/170/9768071447_136367494', 2147483647),
(5, '1688', '深圳市宝安区福海鹿禾服饰厂', '592177906420', '夜场性感连衣裙KTV夜店足浴会所佳丽模特公关小姐晚礼服工服长裙', 'https://detail.1688.com/offer/592177906420.html?spm=b26110380.sw1688.mof001.497.376230e1z5X0jr&sk=consign', 'https://cbu01.alicdn.com/img/ibank/2019/314/022/10848220413_1042948804.jpg,https://cbu01.alicdn.com/img/ibank/2019/534/192/10818291435_1042948804.jpg,https://cbu01.alicdn.com/img/ibank/2019/567/502/10848205765_1042948804.jpg,https://cbu01.alicdn.com/img/ibank/2019/027/878/10875878720_1042948804.jpg,https://cbu01.alicdn.com/img/ibank/2019/451/998/10875899154_1042948804.jpg', 2147483647),
(6, '1688', '慈溪市胜山财轩服装店', '606477210801', '配毛衣大衣单排扣复古气质小碎花长袖雪纺衬衫连衣裙女厂家直销', 'https://detail.1688.com/offer/606477210801.html?spm=a262eq.12572798.jsczf959.2.11802fb1sM3Iqf', 'https://cbu01.alicdn.com/img/ibank/2019/222/144/12421441222_1872907074.jpg,https://cbu01.alicdn.com/img/ibank/2019/633/817/12383718336_1872907074.jpg,https://cbu01.alicdn.com/img/ibank/2019/559/586/12383685955_1872907074.jpg,https://cbu01.alicdn.com/img/ibank/2019/083/414/12458414380_1872907074.jpg,https://cbu01.alicdn.com/img/ibank/2019/577/796/12383697775_1872907074.jpg,https://cbu01.alicdn.com/img/ibank/2019/931/324/12458423139_1872907074.jpg,https://cbu01.alicdn.com/img/ibank/2019/911/744/12421447119_18', 2147483647),
(8, '1688', '卢浮服饰实力卖场', '607648754360', '2019冬新复古时髦廓形羊毛呢西装外套设计感宽松中长款加厚大衣女', 'https://detail.1688.com/offer/607648754360.html?spm=a312h.2018_new_sem.dh_002.5.2a1e5fa7BYClv0&tracelog=p4p&clickid=287c01c66b0d44d6a044e06e1afe6071&sessionid=340ac0d1738320779fd4a563d42ccd0d&a=1805&e=eBm4p3K.I71DTWjC-T6pUPW441UN6DKYbdGlOl9EZhkFYnpKgALwC2J.QVPDEZ5MGorSr-050Ho_&sk=sem&cclue=1', 'https://cbu01.alicdn.com/img/ibank/2019/297/547/12634745792_1423037658.jpg,https://cbu01.alicdn.com/img/ibank/2019/045/383/12559383540_1423037658.jpg,https://cbu01.alicdn.com/img/ibank/2019/353/293/12559392353_1423037658.jpg,https://cbu01.alicdn.com/img/ibank/2019/654/234/12498432456_1423037658.jpg,https://cbu01.alicdn.com/img/ibank/2019/974/425/12542524479_1423037658.jpg,https://cbu01.alicdn.com/img/ibank/2019/458/847/12634748854_1423037658.jpg', 2147483647);

-- --------------------------------------------------------

--
-- 表的结构 `sellers_options`
--

CREATE TABLE `sellers_options` (
  `id` int(11) NOT NULL,
  `sellers_product_id` varchar(128) DEFAULT NULL,
  `name` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `sellers_options`
--

INSERT INTO `sellers_options` (`id`, `sellers_product_id`, `name`) VALUES
(1, '565657388812', '颜色'),
(2, '565657388812', '尺码'),
(3, '599436203258', '颜色'),
(4, '599436203258', '尺码'),
(5, '557680917467', '颜色'),
(6, '557680917467', '尺码'),
(7, '586036348851', '颜色'),
(8, '586036348851', '尺码'),
(9, '592177906420', '颜色'),
(10, '592177906420', '尺码'),
(11, '606477210801', '颜色'),
(12, '606477210801', '尺码'),
(13, '607648754360', '颜色'),
(14, '607648754360', '尺码');

-- --------------------------------------------------------

--
-- 表的结构 `sellers_properties`
--

CREATE TABLE `sellers_properties` (
  `id` int(11) NOT NULL,
  `sellers_product_id` varchar(128) DEFAULT NULL,
  `sellers_options_name` varchar(32) DEFAULT NULL,
  `value` varchar(64) DEFAULT NULL,
  `image_url` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `sellers_properties`
--

INSERT INTO `sellers_properties` (`id`, `sellers_product_id`, `sellers_options_name`, `value`, `image_url`) VALUES
(1, '565657388812', '颜色', '丹宁', 'https://cbu01.alicdn.com/img/ibank/2018/855/037/8585730558_1780044008.jpg'),
(2, '565657388812', '尺码', 'S', ''),
(3, '565657388812', '尺码', 'M', ''),
(4, '565657388812', '尺码', 'L', ''),
(5, '565657388812', '尺码', 'XL', ''),
(6, '599436203258', '颜色', '黑色', 'https://cbu01.alicdn.com/img/ibank/2019/518/546/11585645815_2058389640.jpg'),
(7, '599436203258', '尺码', 'M', ''),
(8, '599436203258', '尺码', 'L', ''),
(9, '557680917467', '颜色', '浅灰色上衣+长裙', ''),
(10, '557680917467', '颜色', '深灰色上衣+长裙', ''),
(11, '557680917467', '颜色', '藏青色上衣+长裙', ''),
(12, '557680917467', '颜色', '酒红色上衣+长裙', ''),
(13, '557680917467', '尺码', '均码', ''),
(14, '586036348851', '颜色', '黑色', 'https://cbu01.alicdn.com/img/ibank/2018/683/380/9768083386_1363674945.jpg'),
(15, '586036348851', '颜色', '浅咖', 'https://cbu01.alicdn.com/img/ibank/2018/744/170/9768071447_1363674945.jpg'),
(16, '586036348851', '颜色', '焦糖', 'https://cbu01.alicdn.com/img/ibank/2018/968/241/9719142869_1363674945.jpg'),
(17, '586036348851', '颜色', '米白', 'https://cbu01.alicdn.com/img/ibank/2018/230/011/9768110032_1363674945.jpg'),
(18, '586036348851', '颜色', '杏色', 'https://cbu01.alicdn.com/img/ibank/2018/033/111/9745111330_1363674945.jpg'),
(19, '586036348851', '尺码', '均码', ''),
(20, '592177906420', '颜色', '黑色', 'https://cbu01.alicdn.com/img/ibank/2019/451/998/10875899154_1042948804.jpg'),
(21, '592177906420', '尺码', 'S', ''),
(22, '592177906420', '尺码', 'M', ''),
(23, '592177906420', '尺码', 'L', ''),
(24, '592177906420', '尺码', 'XL', ''),
(25, '592177906420', '尺码', 'XXL', ''),
(26, '592177906420', '尺码', 'XXXL', ''),
(27, '606477210801', '颜色', '复古绿', 'https://cbu01.alicdn.com/img/ibank/2019/911/744/12421447119_1872907074.jpg'),
(28, '606477210801', '颜色', '姜汁棕', 'https://cbu01.alicdn.com/img/ibank/2019/931/324/12458423139_1872907074.jpg'),
(29, '606477210801', '尺码', '均码', ''),
(30, '607648754360', '颜色', '深咖色', 'https://cbu01.alicdn.com/img/ibank/2019/458/847/12634748854_1423037658.jpg'),
(31, '607648754360', '尺码', 'S', ''),
(32, '607648754360', '尺码', 'M', '');

-- --------------------------------------------------------

--
-- 表的结构 `sellers_sku`
--

CREATE TABLE `sellers_sku` (
  `id` int(11) NOT NULL,
  `sellerId` varchar(64) DEFAULT NULL,
  `image` varchar(128) DEFAULT NULL,
  `image_index` int(11) DEFAULT NULL,
  `option1` varchar(32) DEFAULT NULL,
  `option2` varchar(32) DEFAULT NULL,
  `sku` varchar(64) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `weight_unit` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `sellers_sku`
--

INSERT INTO `sellers_sku` (`id`, `sellerId`, `image`, `image_index`, `option1`, `option2`, `sku`, `weight`, `weight_unit`) VALUES
(1, '565657388812', 'https://cbu01.alicdn.com/img/ibank/2018/855/037/8585730558_1780044008.jpg', 5, '丹宁', 'L', '丹宁-L', 138, 'g'),
(2, '565657388812', 'https://cbu01.alicdn.com/img/ibank/2018/855/037/8585730558_1780044008.jpg', 5, '丹宁', 'M', '丹宁-M', 138, 'g'),
(3, '565657388812', 'https://cbu01.alicdn.com/img/ibank/2018/855/037/8585730558_1780044008.jpg', 5, '丹宁', 'XL', '丹宁-XL', 138, 'g'),
(4, '565657388812', 'https://cbu01.alicdn.com/img/ibank/2018/855/037/8585730558_1780044008.jpg', 5, '丹宁', 'S', '丹宁-S', 138, 'g'),
(5, '599436203258', 'https://cbu01.alicdn.com/img/ibank/2019/518/546/11585645815_2058389640.jpg', 5, '黑色', 'L', '黑色-L', 68, 'g'),
(6, '599436203258', 'https://cbu01.alicdn.com/img/ibank/2019/518/546/11585645815_2058389640.jpg', 5, '黑色', 'M', '黑色-M', 68, 'g'),
(7, '557680917467', 'https://cbu01.alicdn.com/img/ibank/2017/075/734/4609437570_1348415983.jpg', 0, '酒红色上衣+长裙', '均码', '酒红色上衣+长裙-均码', 24, 'g'),
(8, '557680917467', 'https://cbu01.alicdn.com/img/ibank/2017/075/734/4609437570_1348415983.jpg', 0, '藏青色上衣+长裙', '均码', '藏青色上衣+长裙-均码', 24, 'g'),
(9, '557680917467', 'https://cbu01.alicdn.com/img/ibank/2017/075/734/4609437570_1348415983.jpg', 0, '深灰色上衣+长裙', '均码', '深灰色上衣+长裙-均码', 24, 'g'),
(10, '557680917467', 'https://cbu01.alicdn.com/img/ibank/2017/075/734/4609437570_1348415983.jpg', 0, '浅灰色上衣+长裙', '均码', '浅灰色上衣+长裙-均码', 24, 'g'),
(11, '586036348851', 'https://cbu01.alicdn.com/img/ibank/2018/033/111/9745111330_1363674945.jpg', 8, '杏色', '均码', '杏色-均码', 58, 'g'),
(12, '586036348851', 'https://cbu01.alicdn.com/img/ibank/2018/968/241/9719142869_1363674945.jpg', 0, '焦糖', '均码', '焦糖-均码', 58, 'g'),
(13, '586036348851', 'https://cbu01.alicdn.com/img/ibank/2018/744/170/9768071447_1363674945.jpg', 6, '浅咖', '均码', '浅咖-均码', 58, 'g'),
(14, '586036348851', 'https://cbu01.alicdn.com/img/ibank/2018/683/380/9768083386_1363674945.jpg', 5, '黑色', '均码', '黑色-均码', 58, 'g'),
(15, '586036348851', 'https://cbu01.alicdn.com/img/ibank/2018/230/011/9768110032_1363674945.jpg', 7, '米白', '均码', '米白-均码', 58, 'g'),
(16, '592177906420', 'https://cbu01.alicdn.com/img/ibank/2019/451/998/10875899154_1042948804.jpg', 4, '黑色', 'XL', '黑色-XL', 72, 'g'),
(17, '592177906420', 'https://cbu01.alicdn.com/img/ibank/2019/451/998/10875899154_1042948804.jpg', 4, '黑色', 'S', '黑色-S', 72, 'g'),
(18, '592177906420', 'https://cbu01.alicdn.com/img/ibank/2019/451/998/10875899154_1042948804.jpg', 4, '黑色', 'L', '黑色-L', 72, 'g'),
(19, '592177906420', 'https://cbu01.alicdn.com/img/ibank/2019/451/998/10875899154_1042948804.jpg', 4, '黑色', 'XXXL', '黑色-XXXL', 72, 'g'),
(20, '592177906420', 'https://cbu01.alicdn.com/img/ibank/2019/451/998/10875899154_1042948804.jpg', 4, '黑色', 'XXL', '黑色-XXL', 72, 'g'),
(21, '592177906420', 'https://cbu01.alicdn.com/img/ibank/2019/451/998/10875899154_1042948804.jpg', 4, '黑色', 'M', '黑色-M', 72, 'g'),
(22, '606477210801', 'https://cbu01.alicdn.com/img/ibank/2019/931/324/12458423139_1872907074.jpg', 5, '姜汁棕', '均码', '姜汁棕-均码', 73, 'g'),
(23, '606477210801', 'https://cbu01.alicdn.com/img/ibank/2019/911/744/12421447119_1872907074.jpg', 6, '复古绿', '均码', '复古绿-均码', 73, 'g'),
(24, '607648754360', 'https://cbu01.alicdn.com/img/ibank/2019/458/847/12634748854_1423037658.jpg', 5, '深咖色', 'S', '深咖色-S', 217, 'g'),
(25, '607648754360', 'https://cbu01.alicdn.com/img/ibank/2019/458/847/12634748854_1423037658.jpg', 5, '深咖色', 'M', '深咖色-M', 217, 'g');

-- --------------------------------------------------------




--
-- 表的索引 `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `commission`
--
ALTER TABLE `commission`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `commissionprop`
--
ALTER TABLE `commissionprop`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `commissionsku`
--
ALTER TABLE `commissionsku`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `menu`
--
ALTER TABLE `rights`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `sellers`
--
ALTER TABLE `sellers`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `sellers_sku`
--
ALTER TABLE `sellers_sku`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `attributes`
--
ALTER TABLE `attributes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- 使用表AUTO_INCREMENT `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- 使用表AUTO_INCREMENT `commission`
--
ALTER TABLE `commission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- 使用表AUTO_INCREMENT `commissionprop`
--
ALTER TABLE `commissionprop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- 使用表AUTO_INCREMENT `commissionsku`
--
ALTER TABLE `commissionsku`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- 使用表AUTO_INCREMENT `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- 使用表AUTO_INCREMENT `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- 使用表AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
