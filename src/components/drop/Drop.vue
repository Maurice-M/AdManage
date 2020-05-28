<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>投放管理</el-breadcrumb-item>
      <el-breadcrumb-item>个人统计列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
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
        <el-table-column label="ROI值" prop="ROIS"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: '',
      userList: [],
      cerateTime: parseInt(new Date().getTime() / 1000),
      roiList: []
    }
  },
  created() {
    this.userId = JSON.parse(unescape(window.sessionStorage.getItem('data'))).id
    this.getDrop()
  },
  methods: {
    async getDrop() {
      const { data: res } = await this.$http.post('/api/drop/seachDrop', {
        userId: this.userId,
        cerateTime: parseInt(new Date().getTime() / 1000)
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roiList = res.data
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