<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>工具类目列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="toolName" placeholder="请输入新工具类目"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="addTool()">添加新工具类目</el-button>
        </el-col>
      </el-row>
      <el-table :data="toolList" border stripe>
        <el-table-column label="ID" prop="id" width="100px"></el-table-column>
        <el-table-column label="费用名称" prop="toolName"></el-table-column>
        <el-table-column
          label="操作"
          :width="roleId === 1 ? '150px' : '80px'"
          v-if="roleId === 1 || roleId === 2"
        >
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="showEditTool(scope.row)">编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="roleId === 1"
              @click="removeTool(scope.row.id)"
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
    <!--编辑类目-->
    <el-dialog title="编辑类目" :visible.sync="editDialogVisible" width="30%">
      <el-input v-model="editFrom.toolName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editTool()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toolName: '',
      toolList: [],
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      roleId: 0,
      editFrom: {},
      editDialogVisible: false
    }
  },
  created() {
    this.getToolList()
    this.roleId = JSON.parse(
      unescape(window.sessionStorage.getItem('data'))
    ).roleId
  },
  methods: {
    /*** 添加新工具类目***/
    async addTool() {
      if (this.toolName === '') {
        return this.$message.error('请输入新工具类目')
      }
      const { data: res } = await this.$http.post('/api/regular/addTool', {
        toolName: this.toolName
      })
      if (res.meta.status !== 200) {
        return this.$$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.toolName = ''
      this.getToolList()
    },
    /*** 获取工具类目列表 ***/
    async getToolList() {
      const { data: res } = await this.$http.post('api/regular/getToolList', {
        start: (this.currentPage - 1) * this.pageSize,
        end: this.pageSize
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.toolList = res.data.list
    },
    /*** 删除工具类目 ***/
    async removeTool(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该工具类目, 是否继续?',
        '删除工具类目',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.post('api/regular/removeTool', {
        id: id
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getToolList()
    },
    /***打开修改类目***/
    showEditTool(info) {
      this.editFrom = info
      this.editDialogVisible = true
    },
    async editTool() {
      if (this.editFrom.toolName === '') {
        return this.$message.error('编辑类目不能为空')
      }
      const { data: res } = await this.$http.post(
        '/api/regular/editTool',
        this.editFrom
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getToolList()
      this.editDialogVisible = false
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getToolList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>