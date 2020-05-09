<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>提成列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="success" @click="showAddCmdialogVisible()">添加提成</el-button>
      <el-table :data="commissionList" border>
        <el-table-column label="ID" prop="id" width="80px"></el-table-column>
        <el-table-column label="月份">
          <template slot-scope="scope">{{ scope.row.month | month }}</template>
        </el-table-column>
        <el-table-column label="比例" prop="commission"></el-table-column>
        <el-table-column label="归属人员" prop="name" width="150px"></el-table-column>
        <el-table-column label="时间" width="180px">
          <template slot-scope="scope">{{ scope.row.cerateTime | dataFormat }}</template>
        </el-table-column>
        <el-table-column width="80px" v-if="roleId === 1" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removeCommission(scope.row.id)">删除</el-button>
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
    <!-- 添加提成 -->
    <el-dialog
      title="添加个人提成"
      :visible.sync="AddCmdialogVisible"
      width="50%"
      @close="addCmDialogClose"
    >
      <el-form :model="addCmForm" :rules="addCmFormRules" ref="addCmFormRef" label-width="100px">
        <el-form-item label="归属人员" prop="userId">
          <el-select placeholder="请选择归属人员" v-model="addCmForm.userId">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月份" prop="month">
          <el-date-picker type="month" placeholder="选择月份" v-model="addCmForm.month"></el-date-picker>
        </el-form-item>
        <el-form-item label="提成比例" prop="commission">
          <el-input v-model="addCmForm.commission" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddCmdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddCommission()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      AddCmdialogVisible: false,
      addCmForm: {
        userId: '',
        commission: '',
        month: ''
      },
      addCmFormRules: {
        userId: [
          { required: true, message: '请选择归属人员', trigger: 'change' }
        ],
        commission: [
          {
            required: true,
            message: '请输入个人提成比例(0-1)',
            trigger: 'blur'
          }
        ],
        month: [
          {
            type: 'date',
            required: true,
            message: '请选择月份',
            trigger: 'change'
          }
        ]
      },
      userList: [],
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      commissionList: [],
      roleId: 0
    }
  },
  created() {
    this.roleId = JSON.parse(
      unescape(window.sessionStorage.getItem('data'))
    ).roleId
    this.getCommissionList()
  },
  methods: {
    showAddCmdialogVisible() {
      this.getUserList()
      this.AddCmdialogVisible = true
    },
    /*** 添加个人提成对话框 - 监听关闭事件 ***/
    addCmDialogClose() {
      this.$refs.addCmFormRef.resetFields()
    },
    /*** 获取人员信息 ***/
    async getUserList() {
      const { data: res } = await this.$http.get('/api/regular/getUserList')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data
    },
    /*** 添加个人提成 ***/
    AddCommission() {
      this.$refs.addCmFormRef.validate(async valid => {
        if (!valid) return
        this.addCmForm.month = this.addCmForm.month.getTime()
        const { data: res } = await this.$http.post(
          'api/regular/addCommission',
          this.addCmForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.AddCmdialogVisible = false
        this.getCommissionList()
      })
    },
    /*** 获取个人提成列表 ***/
    async getCommissionList() {
      const { data: res } = await this.$http.post(
        '/api/regular/getCommissionList',
        {
          start: (this.currentPage - 1) * this.pageSize,
          end: this.pageSize
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.commissionList = res.data.list
    },
    /*** 删除提成 ***/
    async removeCommission(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该提成记录, 是否继续?',
        '删除该提成记录',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.post('/api/regular/removeCommission', { id: id })
      if (res.meta.status !== 200) { this.$message.error(res.meta.msg) }
      this.$message.success(res.meta.msg)
      this.getCommissionList()
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getCommissionList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>