<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>收益统计列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker style="width:100%" v-model="month" type="month" placeholder="请选择月份"></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="seachProfit()">查询</el-button>
          <el-button type="primary" @click="outExcel(profitList)">导出表格</el-button>
        </el-col>
      </el-row>
      <el-table :data="profitList" border show-summary>
        <el-table-column label="时间" width="150PX">
          <template slot-scope="scope">{{ preTime | month }}{{ '-' + scope.row.date }}</template>
        </el-table-column>
        <el-table-column label="收入(USD)" prop="NaMoney">
          <template slot-scope="scope">{{ scope.row.NaMoney | money }}</template>
        </el-table-column>
        <el-table-column label="工具类费用(USD)" prop="toolCost">
          <template slot-scope="scope">{{ scope.row.toolCost | money }}</template>
        </el-table-column>
        <el-table-column label="广告成本(USD)" prop="adCost">
          <template slot-scope="scope">{{ scope.row.adCost | money }}</template>
        </el-table-column>
        <el-table-column label="净收益(USD)" prop="profit">
          <template slot-scope="scope">{{ scope.row.profit | money }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      preTime: parseInt(new Date().getTime() / 1000),
      profitList: [],
      month: ''
    }
  },
  created() {
    this.getProfit()
  },
  methods: {
    /*** 获取当月收益 ***/
    async getProfit() {
      const { data: res } = await this.$http.post('/api/regular/getProfit', {
        preTime: this.preTime
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.profitList = res.data
    },
    seachProfit() {
      if (this.month === '') {
        return this.$message.error('请选择月份')
      }
      this.preTime = parseInt(this.month.getTime() / 1000)
      this.getProfit()
    },
    outExcel(res) {
      require.ensure([], () => {
        const { exportJsonToExcel } = require('../../excel/Export2Excel.js')
        const tHeader = [
          '日期',
          '收入(USD)',
          '工具类费用(USD)',
          '广告成本(USD)',
          '净收益(USD)'
        ]
        const filterVal = ['date', 'NaMoney', 'toolCost', 'adCost', 'profit']
        const list = res
        const data = this.formatJson(filterVal, list)
        exportJsonToExcel(tHeader, data, this.getMonth(this.preTime) + '收益表')
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