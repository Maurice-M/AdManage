<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>薪资列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert title="当前页面费用为人民币！！！" type="warning" show-icon></el-alert>
    <el-card>
      <el-table :data="payList" border>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="基本工资" prop="price"></el-table-column>
        <el-table-column label="总收益" prop="remitMoneyTotal">
          <template slot-scope="scope">
            {{ scope.row.remitMoneyTotal * scope.row.USD_RMB | money }}
          </template>
        </el-table-column>
        <el-table-column label="总支出">
          <template slot-scope="scope">
            {{
              scope.row.costTotal +
              scope.row.adTotal +
              scope.row.domainTotal +
              scope.row.toolCostTotal | money
            }}
          </template>
        </el-table-column>
        <el-table-column label="净收入">
          <template slot-scope="scope">
            {{
              scope.row.remitMoneyTotal * scope.row.USD_RMB -
              (scope.row.costTotal +
              scope.row.adTotal +
              scope.row.domainTotal +
              scope.row.toolCostTotal) | money
            }}
          </template>
        </el-table-column>
        <el-table-column label="提成比例" prop="commission"></el-table-column>
        <el-table-column label="工资">
          <template slot-scope="scope">
            <span v-if="scope.row.remitMoneyTotal * scope.row.USD_RMB - (scope.row.costTotal + scope.row.adTotal + scope.row.domainTotal + scope.row.toolCostTotal) > 0">
              {{ scope.row.price + scope.row.commission * (scope.row.remitMoneyTotal * scope.row.USD_RMB - (scope.row.costTotal + scope.row.adTotal + scope.row.domainTotal + scope.row.toolCostTotal)) | money }}
            </span>
            <span v-if="scope.row.remitMoneyTotal * scope.row.USD_RMB - (scope.row.costTotal + scope.row.adTotal + scope.row.domainTotal + scope.row.toolCostTotal) <= 0">
              {{ scope.row.price | money }}
            </span>
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
      payList: [],
      monthStart: moment().startOf('month').format('X'),
      monthEnd: moment().endOf('month').format('X')
    }
  },
  created() {
    this.getPayList()
  },
  methods: {
    async getPayList() {
      const { data: res } = await this.$http.post('/api/regular/getPayList', {
        monthStart: this.monthStart,
        monthEnd: this.monthEnd
      })
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.payList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>