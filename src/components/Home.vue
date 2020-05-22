<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="logo" />
        <span>广告费用管理系统</span>
      </div>
      <div>
        <span class="account">{{ email }}</span>
        <i class="el-icon-switch-button" @click="logout()"></i>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse()">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#444"
          text-color="#fff"
          active-text-color="#67C23A"
          unique-opened
          router
          :collapse-transition="false"
          :default-active="activePath"
          :collapse="isCollapse"
        >
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="'/' + subItem.path"
              @click="savNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main :style="{left : isCollapse ? '64px' : '200px'}">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        '1': 'el-icon-user',
        '2': 'el-icon-goods',
        '3': 'el-icon-tickets',
        '4': 'el-icon-box'
      },
      isCollapse: false,
      activePath: '',
      email: ''
    }
  },
  created() {
    this.getSessionStorage()
    this.getMenuList()
  },
  methods: {
    /*** 获取session信息 ***/
    getSessionStorage() {
      this.activePath = window.sessionStorage.getItem('activePath')
      if (window.sessionStorage.getItem('data')) {
        const data = JSON.parse(unescape(window.sessionStorage.getItem('data')))
        this.email = data.email
      } else {
        this.logout()
      }
    },
    /***退出当前账户***/
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/')
    },
    /***获取当前菜单列表***/
    async getMenuList() {
      const { data: res } = await this.$http.get('/api/home/menu')
      if (res.meta.status !== 200) {
        if (res.meta.status === 201) {
          this.$message.warning(res.meta.msg)
          this.logout()
        }
      }
      this.menuList = res.data
    },
    /***菜单栏折叠***/
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    /***保持菜单栏激活状态***/
    savNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #444;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      margin-right: 8px;
    }
  }
}
.el-aside {
  background-color: #444;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}

.toggle-button {
  color: #fff;
  background-color: #4e4e4e;
  line-height: 24px;
  font-size: 10px;
  text-align: center;
  cursor: pointer;
}
.el-icon-switch-button {
  cursor: pointer;
}
.account {
  font-size: 12px;
  margin-right: 15px;
  font-style: italic;
}
</style>