<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>合并利润列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker style="width:100%" v-model="month" type="month" placeholder="请选择月份"></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="seach()">查询</el-button>
        </el-col>
      </el-row>
      <el-table border :data="mergeProfitList">
        <el-table-column label="网盟收益" prop="remitMoney"></el-table-column>
        <el-table-column label="工具花费">
          <template slot-scope="scope">{{ scope.row.domainPrice + scope.row.toolCost}}</template>
        </el-table-column>
        <el-table-column label="光告花费" prop="adCost"></el-table-column>
        <el-table-column label="日常花费">
            <template scope="scope">
                {{ scope.row.rcCost * scope.row.RMB_USD | money }}
            </template>
        </el-table-column>
        <el-table-column label="合计">
          <template
            slot-scope="scope"
          >{{scope.row.remitMoney - scope.row.domainPrice - scope.row.toolCost -scope.row.adCost - scope.row.rcCost * scope.row.RMB_USD | money }}</template>
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
      month: '',
      mergeProfitList: []
    }
  },
  created() {
    this.getMergeProfit()
  },
  methods: {
    async getMergeProfit() {
      const { data: res } = await this.$http.post(
        '/api/regular/getMergeProfit',
        {
          preTime: this.preTime
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.mergeProfitList = res.data
    },
    seach() {
      if (this.month === '') {
        return this.$message.error('请选择查询月份')
      }
      this.preTime = parseInt(this.month.getTime() / 1000)
      this.getMergeProfit()
    }
  }
}
</script>

<style lang="less" scoped>
</style>