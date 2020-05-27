import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackchunkName: "user" */ '../components/Login.vue')
const Home = () => import(/* webpackchunkName: "user" */ '../components/Home.vue')
const Welcome = () => import(/* webpackchunkName: "user" */ '../components/Welcome.vue')
/** 用户管理 **/
const Users = () => import(/* webpackchunkName: "user" */ '../components/user/Users.vue')

/*** 权限管理 ***/
const Rights = () => import(/* webpackchunkName: "power" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackchunkName: "power" */ '../components/power/Roles.vue')

/*** 财务管理 ***/
const Regulars = () => import(/* webpackchunkName: "finance" */ '../components/finance/Regulars.vue')
const SpendDay = () => import(/* webpackchunkName: "finance" */ '../components/finance/SpendDay.vue')
const Tools = () => import(/* webpackchunkName: "finance" */ '../components/finance/Tools.vue')
const ToolCost = () => import(/* webpackchunkName: "finance" */ '../components/finance/ToolCost.vue')
const AdCost = () => import(/* webpackchunkName: "finance" */ '../components/finance/AdCost.vue')
const Advertisers = () => import(/* webpackchunkName: "finance" */ '../components/finance/Advertisers.vue')
const NetAlliances = () => import(/* webpackchunkName: "finance" */ '../components/finance/NetAlliances.vue')
const NetAllianceMoney = () => import(/* webpackchunkName: "finance" */ '../components/finance/NetAllianceMoney.vue')
const AccountCost = () => import(/* webpackchunkName: "finance" */ '../components/finance/AccountCost.vue')
const Commission = () => import(/* webpackchunkName: "finance" */ '../components/finance/Commission.vue')
const Exchange = () => import(/* webpackchunkName: "finance" */ '../components/finance/Exchange.vue')
const Public = () => import(/* webpackchunkName: "finance" */ '../components/finance/Public.vue')
const ProfitList = () => import(/* webpackchunkName: "finance" */ '../components/finance/ProfitList.vue')
const Transform = () => import(/* webpackchunkName: "finance" */ '../components/finance/Transform.vue')
const ROI = () => import(/* webpackchunkName: "finance" */ '../components/finance/ROI.vue')
const AdRevenue = () => import(/* webpackchunkName: "finance" */ '../components/finance/AdRevenue.vue')
const MergeProfit = () => import(/* webpackchunkName: "finance" */ '../components/finance/MergeProfit.vue')
const Pay = () => import(/* webpackchunkName: "finance" */ '../components/finance/Pay.vue')
const RechargeRecord = () => import(/* webpackchunkName: "finance" */ '../components/finance/RechargeRecord.vue')

/*** 域名管理 ***/
const Domains = () => import(/* webpackchunkName: "Domains" */ '../components/domain/Domains.vue')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/regulars', component: Regulars },
      { path: '/spendDay', component: SpendDay },
      { path: '/tools', component: Tools },
      { path: '/tools', component: Tools },
      { path: '/toolCost', component: ToolCost },
      { path: '/adCost', component: AdCost },
      { path: '/advertisers', component: Advertisers },
      { path: '/netAlliances', component: NetAlliances },
      { path: '/netAllianceMoney', component: NetAllianceMoney },
      { path: '/accountCost', component: AccountCost },
      { path: '/commission', component: Commission },
      { path: '/exchange', component: Exchange },
      { path: '/public', component: Public },
      { path: '/profitList', component: ProfitList },
      { path: '/transform', component: Transform },
      { path: '/roi', component: ROI },
      { path: '/adRevenue', component: AdRevenue },
      { path: '/mergeProfit', component: MergeProfit },
      { path: '/pay', component: Pay },
      { path: '/rechargeRecord', component: RechargeRecord },
      { path: '/domains', component: Domains }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
