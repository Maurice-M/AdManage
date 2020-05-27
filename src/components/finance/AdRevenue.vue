<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>广告收支列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker style="width:100%" v-model="month" type="month" placeholder="请选择月份"></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="seachAdRevenue()">查询</el-button>
          <el-button type="primary" @click="outExcel(adRevenueList)">导出表格</el-button>
        </el-col>
      </el-row>
      <el-table border show-summary :data="adRevenueList">
        <el-table-column label="日期" prop="date" width="50px"></el-table-column>
        <el-table-column label="广告花费" prop="adCost"></el-table-column>
        <el-table-column label="手续费" prop="handlingFee"></el-table-column>
        <el-table-column label="BlitzAdsGroup" prop="BlitzAdsGroup"></el-table-column>
        <el-table-column label="mobooka" prop="mobooka"></el-table-column>
        <el-table-column label="ADEER" prop="ADEER"></el-table-column>
        <el-table-column label="盈利" prop="profit"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      preTime: parseInt(new Date().getTime() / 1000),
      month: '',
      adRevenueList: [],
      cerateTime: ''
    }
  },
  created() {
    this.getAdRevenue()
  },
  methods: {
    seachAdRevenue() {
      this.preTime =
        this.month === '' ? this.preTime : parseInt(this.month.getTime() / 1000)
      this.getAdRevenue()
    },
    async getAdRevenue() {
      const { data: res } = await this.$http.post('/api/regular/getAdRevenue', {
        preTime: this.preTime
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.adRevenueList = res.data
    },
    outExcel(res) {
      require.ensure([], () => {
        const { exportJsonToExcel } = require('../../excel/Export2Excel.js')
        const tHeader = [
          '日期',
          '广告花费(USD)',
          '手续费(USD)',
          'BlitzAdsGroup',
          'mobooka',
          'ADEER',
          '盈利'
        ]
        const filterVal = [
          'date',
          'adCos',
          'handlingFee',
          'BlitzAdsGroup',
          'mobooka',
          'ADEER',
          'profit'
        ]
        const list = res
        const data = this.formatJson(filterVal, list)
        exportJsonToExcel(
          tHeader,
          data,
          this.getMonth(this.preTime) + '-广告收支表'
        )
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    getMonth(originVal) {
      const dt = new Date(originVal * 1000)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      return `${y}-${m}`
    }
  }
}
</script>

<style lang="less" scoped>
</style>