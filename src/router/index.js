import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'

/** 用户管理 **/
import Users from '../components/user/Users.vue'

/*** 权限管理 ***/
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
/*** 财务管理 ***/
import Regulars from '../components/finance/Regulars.vue'
import SpendDay from '../components/finance/SpendDay.vue'
import Tools from '../components/finance/Tools.vue'
import ToolCost from '../components/finance/ToolCost.vue'
import AdCost from '../components/finance/AdCost.vue'
import Advertisers from '../components/finance/Advertisers.vue'
import NetAlliances from '../components/finance/NetAlliances.vue'
import NetAllianceMoney from '../components/finance/NetAllianceMoney.vue'
import AccountCost from '../components/finance/AccountCost.vue'
import Commission from '../components/finance/Commission.vue'

/*** 域名管理 ***/
import Domains from '../components/domain/Domains.vue'
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
