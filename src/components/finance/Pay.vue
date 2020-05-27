<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>薪资列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker style="width:100%" v-model="month" type="month" placeholder="请选择月份"></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="seachPay()">查询</el-button>
        </el-col>
      </el-row>
      <el-table border :data="payList">
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="总收入" prop="naMoney"></el-table-column>
        <el-table-column label="总花费">
          <template slot-scope="scope">
            {{scope.row.toolCost + scope.row.adCost + scope.row.rcCost * scope.row.RMB_USD + scope.row.domainPrice | money }}
          </template>
        </el-table-column>
        <el-table-column label="利润">
          <template slot-scope="scope">
            {{ scope.row.naMoney - (scope.row.toolCost + scope.row.adCost + scope.row.rcCost * scope.row.RMB_USD + scope.row.domainPrice) | money }}
          </template>
        </el-table-column>
        <el-table-column label="基本工资" prop="price"></el-table-column>
        <el-table-column label="结算">
          <template slot-scope="scope">
            <span v-if="scope.row.naMoney - (scope.row.toolCost + scope.row.adCost + scope.row.rcCost * scope.row.RMB_USD + scope.row.domainPrice) > 0">
              {{ scope.row.price + scope.row.commission * (scope.row.naMoney - (scope.row.toolCost + scope.row.adCost + scope.row.rcCost * scope.row.RMB_USD + scope.row.domainPrice)) | money }}
            </span>
            <span v-else>{{ scope.row.price | money }}</span>
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
      preTime: parseInt(new Date().getTime() / 1000),
      month: '',
      payList: []
    }
  },
  created() {
    this.getPay()
  },
  methods: {
    async getPay() {
      const { data: res } = await this.$http.post('/api/regular/getPay', {
        preTime: this.preTime
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.payList = res.data
    },
    seachPay() {
      if (this.month === '') {
        return this.$message.error('请选择查询月份')
      }
      this.preTime = parseInt(this.month.getTime() / 1000)
      this.getPay()
    }
  }
}
</script>

<style lang="less" scoped>
</style>