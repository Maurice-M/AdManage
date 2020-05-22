<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>ROI统计列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="userId" placeholder="请选择人员">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker style="width:100%" v-model="cerateTime" type="month" placeholder="选择日期"></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="seachRoi()">查询</el-button>
          <el-button type="primary" @click="outExcel(roiList)">导出表格</el-button>
        </el-col>
      </el-row>
      <el-table border show-summary :data="roiList">
        <el-table-column label="日期" width="120px">
          <template slot-scope="scope">{{ cerateTime | month }}{{ '-' + scope.row.date }}</template>
        </el-table-column>
        <el-table-column label="广告花费" prop="adCost">
          <template slot-scope="scope">{{ scope.row.adCost | money }}</template>
        </el-table-column>
        <el-table-column label="FB账户花费" prop="accountCost">
          <template slot-scope="scope">{{ scope.row.accountCost | money }}</template>
        </el-table-column>
        <el-table-column label="转化数" prop="number"></el-table-column>
        <el-table-column label="总收入" prop="NaMoney">
          <template slot-scope="scope">{{ scope.row.NaMoney | money }}</template>
        </el-table-column>
        <el-table-column label="利润" prop="profit">
          <template slot-scope="scope">{{ scope.row.profit | money }}</template>
        </el-table-column>
        <el-table-column label="ROI值" prop="ROI"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: '',
      userName: '',
      userList: [],
      cerateTime: '',
      roiList: []
    }
  },
  created() {
    this.getUserList()
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
    async seachRoi() {
      if (this.userId === '') {
        return this.$message.error('请选择查询人员')
      }
      if (this.cerateTime === '') {
        return this.$message.error('请选择查询月份')
      }
      this.userList.forEach(item => {
        if (item.id === this.userId) {
          this.userName = item.name
        }
      })
      const { data: res } = await this.$http.post('/api/regular/seachRoi', {
        userId: this.userId,
        cerateTime: parseInt(this.cerateTime.getTime() / 1000)
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roiList = res.data
    },
    outExcel(res) {
      require.ensure([], () => {
        const { exportJsonToExcel } = require('../../excel/Export2Excel.js')
        const tHeader = [
          '日期',
          '广告花费(USD)',
          'FB账户花费(USD)',
          '转化',
          '总收入(USD)',
          '利润',
          'ROI'
        ]
        const filterVal = [
          'date',
          'adCost',
          'accountCost',
          'number',
          'profit',
          'profit',
          'ROI'
        ]
        const list = res
        const data = this.formatJson(filterVal, list)
        exportJsonToExcel(tHeader, data, this.userName + '-' + this.getMonth(this.cerateTime) + '-ROI统计表')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    getMonth(originVal) {
      const dt = new Date(originVal)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      return `${y}-${m}`
    }
  }
}
</script>

<style lang="less" scoped>
</style>