<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>日常费用类目</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="regName" placeholder="请输入新日常费用类目"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="addRegular()">添加新日常类目</el-button>
        </el-col>
      </el-row>
      <el-table :data="regularList" border stripe>
        <el-table-column label="ID" prop="id" width="60px"></el-table-column>
        <el-table-column label="费用名称" prop="regName"></el-table-column>
        <el-table-column
          label="操作"
          :width="roleId === 1 ? '150px' : '80px'"
          v-if="roleId === 1 || roleId === 2"
        >
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="showEditditDialogVisible(scope.row)">编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="roleId === 1"
              @click="removeRegular(scope.row.id)"
            >删除</el-button>
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
    <!-- 编辑对话框 -->
    <el-dialog title="编辑类目" :visible.sync="editDialogVisible" width="30%">
      <el-input v-model="editFrom.regName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRegular()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      regName: '',
      regularList: [],
      roleId: 0,
      editDialogVisible: false,
      editFrom: {},
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0
    }
  },
  created() {
    this.getRegulars()
    this.roleId = JSON.parse(
      unescape(window.sessionStorage.getItem('data'))
    ).roleId
  },
  methods: {
    /*** 添加新日常费用类目***/
    async addRegular() {
      if (this.regName === '') {
        return this.$message.error('请输入新日常费用类目')
      }
      const { data: res } = await this.$http.post('/api/regular/addRegular', {
        regName: this.regName
      })
      if (res.meta.status !== 200) {
        return this.$$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRegulars()
      this.regName = ''
    },
    /*** 获取日常费用类目列表 ***/
    async getRegulars() {
      const { data: res } = await this.$http.get('/api/regular/getRegularList')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.regularList = res.data
    },
    /*** 删除日常费用类目 ***/
    async removeRegular(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该日常费用类目, 是否继续?',
        '删除日常费用类目',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.post('api/regular/removeRegular', {
        id: id
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRegulars()
    },
    /*** 打开修改对话框 ***/
    showEditditDialogVisible(info) {
      this.editFrom = info
      this.editDialogVisible = true
    },
    /*** 修改日常费用类目 ***/
    async editRegular() {
      if (this.editFrom.regName === '') {
        return this.$message.error('日常费用类目不能为空')
      }
      const { data: res } = await this.$http.post(
        '/api/regular/editRegular',
        this.editFrom
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRegulars()
      this.editDialogVisible = false
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getRegulars()
    }
  }
}
</script>

<style lang="less" scoped>
</style>