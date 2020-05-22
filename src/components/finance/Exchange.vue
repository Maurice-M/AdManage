<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>汇率列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input type="number" placeholder="人民币转美元汇率" v-model="RMB_USD"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input type="number" placeholder="美元转人民币汇率" v-model="USD_RMB"></el-input>
        </el-col>
        <el-col :span="6">
          <el-date-picker type="month" placeholder="请选择月份" v-model="month"></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="addExchage()">添加汇率</el-button>
        </el-col>
      </el-row>
      <el-table :data="exchangeList" border>
        <el-table-column label="ID" prop="id" width="80px"></el-table-column>
        <el-table-column label="月份" width="100px">
          <template slot-scope="scope">
            {{ scope.row.month | month }}
          </template>
        </el-table-column>
        <el-table-column label="人民币转美元汇率" prop="RMB_USD"></el-table-column>
        <el-table-column label="美元转人民币汇率" prop="USD_RMB"></el-table-column>
        <el-table-column label="时间" width="160px">
          <template slot-scope="scope">
            {{scope.row.cerateTime | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px" v-if="roleId === 1">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removeExchange(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleId: 0,
      RMB_USD: '',
      USD_RMB: '',
      month: '',
      exchangeList: ''
    }
  },
  created() {
    this.roleId = JSON.parse(
      unescape(window.sessionStorage.getItem('data'))
    ).roleId
    this.getExchangeList()
  },
  methods: {
    /*** 添加汇率 ***/
    async addExchage() {
      if (this.RMB_USD === '') { return this.$message.error('请输入人民币转美元汇率') }
      if (this.USD_RMB === '') { return this.$message.error('请输入美元转人民币汇率') }
      if (this.month === '') { return this.$message.error('请选择月份') }
      this.month = this.month.getTime()
      const { data: res } = await this.$http.post('/api/regular/addExchage', {
        RMB_USD: this.RMB_USD,
        USD_RMB: this.USD_RMB,
        month: this.month
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.RMB_USD = ''
      this.USD_RMB = ''
      this.month = ''
      this.getExchangeList()
    },
    /*** 获取汇率列表 ***/
    async getExchangeList() {
      const { data: res } = await this.$http.get('/api/regular/getExchangeList')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.exchangeList = res.data
    },
    /*** 删除汇率 ***/
    async removeExchange(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该提成记录, 是否继续?',
        '删除该提成记录',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.post('/api/regular/removeExchange', { id: id })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getExchangeList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>