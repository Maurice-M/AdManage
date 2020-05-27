<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>转化信息列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入转化个数" v-model="number" type="number">
            <el-select slot="prepend" style="width:150px" v-model="userId" placeholder="请选择人员">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-date-picker
            style="width:100%"
            v-model="cerateTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
          ></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addTransform()">添加转化</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 15px">
        <el-col :span="4">
          <el-select style="width:100%" v-model="seachUserId" placeholder="请选择人员">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            style="width:100%"
            v-model="seachStartTime"
            type="datetime"
            placeholder="选择起始时间"
          ></el-date-picker>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            style="width:100%"
            v-model="seachEndTime"
            type="datetime"
            placeholder="选择终止时间"
          ></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="seachTransform()">查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="transformList" border>
        <el-table-column label="ID" prop="id" width="100px"></el-table-column>
        <el-table-column label="归属人员" prop="name"></el-table-column>
        <el-table-column label="数量" prop="number"></el-table-column>
        <el-table-column label="时间" width="170px">
          <template slot-scope="scope">{{ scope.row.cerateTime | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" v-if="roleId === 1" width="80px">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removeTransform(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col>
          <el-pagination
            background
            :pager-count="pagerCount"
            :current-page="currentPage"
            :page-size="pageSize"
            @current-change="paginationChange"
            layout="total, pager"
            :total="total"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      userId: '',
      number: '',
      cerateTime: '',
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      transformList: [],
      roleId: 0,
      seachUserId: '',
      seachStartTime: '',
      seachEndTime: ''
    }
  },
  created() {
    this.roleId = JSON.parse(
      unescape(window.sessionStorage.getItem('data'))
    ).roleId
    this.getUserList()
    this.getTransform()
  },
  methods: {
    /*** 获取人员信息 ***/
    async getUserList() {
      const { data: res } = await this.$http.get('/api/regular/getUserList')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data
    },
    /***** 添加转化 ***/
    async addTransform() {
      if (this.userId === '') {
        return this.$message.error('请选择人员')
      }
      if (this.number === '') {
        return this.$message.error('请输入转化个数')
      }
      if (this.cerateTime === '') {
        return this.$message.error('请选择日期时间')
      }
      const { data: res } = await this.$http.post('/api/regular/addTransform', {
        userId: this.userId,
        number: this.number,
        cerateTime: parseInt(this.cerateTime.getTime() / 1000)
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.userId = ''
      this.number = ''
      this.cerateTime = ''
      this.getTransform()
    },
    /*** 获取转化 ***/
    async getTransform() {
      const { data: res } = await this.$http.post('/api/regular/getTransform', {
        start: (this.currentPage - 1) * this.pageSize,
        end: this.pageSize
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.transformList = res.data.list
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getTransform()
    },
    async removeTransform(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该转化记录, 是否继续?',
        '删除转化记录',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const {
        data: res
      } = await this.$http.post('/api/regular/removeTransform', { id: id })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getTransform()
    },
    /*** 查询转化 ***/
    async seachTransform() {
      if (this.seachStartTime !== '' && this.seachEndTime !== '') {
        const { data: res } = await this.$http.post('/api/regular/seachTransform', {
          seachUserId: this.seachUserId,
          seachStartTime: parseInt(this.seachStartTime.getTime() / 1000),
          seachEndTime: parseInt(this.seachEndTime.getTime() / 1000)
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.total = ''
        this.seachUserId = ''
        this.$message.success(res.meta.msg)
        this.transformList = res.data
      } else {
        return this.$message.error('请选择查询时间段')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>