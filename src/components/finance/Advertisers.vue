<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>广告商列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="adName" placeholder="请输入新的广告商"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="addAdvertisers()">添加广告商</el-button>
        </el-col>
      </el-row>
      <el-table :data="advertisersList" border>
        <el-table-column label="ID" prop="id" width="100px"></el-table-column>
        <el-table-column label="广告商" prop="adName"></el-table-column>
        <el-table-column label="时间" width="160px">
          <template slot-scope="scope">{{ scope.row.cerateTime | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="80px" v-if="roleId === 1">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removeAd(scope.row.id)">删除</el-button>
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
      adName: '',
      advertisersList: [],
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      roleId: 0
    }
  },
  created() {
    this.getAdvertisers()
    this.roleId = JSON.parse(
      unescape(window.sessionStorage.getItem('data'))
    ).roleId
  },
  methods: {
    /*** 添加广告商 ***/
    async addAdvertisers() {
      if (this.adName === '') {
        return this.$message.error('新增广告商不能为空')
      }
      const { data: res } = await this.$http.post(
        '/api/regular/addAdvertisers',
        { adName: this.adName }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getAdvertisers()
      this.adName = ''
    },
    /*** 获取广告商列表***/
    async getAdvertisers() {
      const { data: res } = await this.$http.post(
        '/api/regular/getAdvertisers',
        {
          start: (this.currentPage - 1) * this.pageSize,
          end: this.pageSize
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.advertisersList = res.data.list
    },
    /*** 删除广告商 ***/
    async removeAd(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该广告商, 是否继续?',
        '删除广告商',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.post('/api/regular/removeAd', {
        id: id
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getAdvertisers()
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getAdvertisers()
    }
  }
}
</script>

<style lang="less" scoped>
</style>