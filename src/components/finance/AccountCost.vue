<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>FB账户使用列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert title="注意FB账户使用列表的币种为美元！！！" type="warning" show-icon></el-alert>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-select style="width:100%" v-model="seachUserId" placeholder="请选择人员">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            style="width:100%"
            v-model="seachStartTime"
            type="datetime"
            placeholder="选择起始时间"
          ></el-date-picker>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            style="width:100%"
            v-model="seachEndTime"
            type="datetime"
            placeholder="选择终止时间"
          ></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="seachAccountCost()">查询</el-button>
          <el-button type="primary" @click="showAddAccountCostDialogVisible()">添加账户花费</el-button>
        </el-col>
      </el-row>
      <el-table :data="accountCostList" border>
        <el-table-column label="ID" prop="id" width="80px"></el-table-column>
        <el-table-column label="费用(USD)" width="150px">
          <template slot-scope="scope">{{ scope.row.accountCost | money }}</template>
        </el-table-column>
        <el-table-column label="备注" prop="msg"></el-table-column>
        <el-table-column label="归属人员" prop="name" width="100px"></el-table-column>
        <el-table-column label="时间" prop="cerateTime" width="165px">
          <template slot-scope="scope">{{ scope.row.cerateTime | dataFormat }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          :width="roleId === 1 ? '150px' : '80px'"
          v-if="roleId === 1 || roleId === 2"
        >
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="showeditAccountCostDialogVisible(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="roleId === 1"
              @click="removeAccountCost(scope.row.id)"
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
    <!-- 添加账户花费对话框 -->
    <el-dialog
      title="添加FB账户使用列表"
      :visible.sync="addAccountCostDialogVisible"
      @close="addAccountCostDialogClose()"
      width="50%"
    >
      <el-form
        :model="addAccountCostForm"
        :rules="addAccountCostFormRules"
        ref="addAccountCostFormRef"
        label-width="120px"
      >
        <el-form-item label="归属人员" prop="userId">
          <el-select placeholder="请选择归属人员" v-model="addAccountCostForm.userId">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用(USD)" prop="accountCost">
          <el-input v-model="addAccountCostForm.accountCost" type="number"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addAccountCostForm.msg"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="cerateTime" placeholder="请输入日期时间">
          <el-date-picker
            v-model="addAccountCostForm.cerateTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAccountCostDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAccountCost()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改FB账户使用对话框 -->
    <el-dialog title="添加FB账户使用列表" :visible.sync="editAccountCostDialogVisible" width="50%">
      <el-form
        :model="editAccountCostForm"
        :rules="editAccountCostFormRules"
        ref="editAccountCostFormRef"
        label-width="100px"
      >
        <el-form-item label="ID">
          <el-input v-model="editAccountCostForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="费用(USD)">
          <el-input v-model="editAccountCostForm.accountCost" type="number"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editAccountCostForm.msg"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAccountCostDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAccountCost()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addAccountCostDialogVisible: false,
      editAccountCostDialogVisible: false,
      userList: [],
      adList: [],
      addAccountCostForm: {
        userId: '',
        accountCost: '',
        msg: '',
        cerateTime: ''
      },
      addAccountCostFormRules: {
        userId: [
          { required: true, message: '请选择归属人员', trigger: 'change' }
        ],
        accountCost: [
          { required: true, message: '请输入账花费', trigger: 'blur' }
        ],
        cerateTime: [
          {
            type: 'date',
            required: true,
            message: '请选择日期时间',
            trigger: 'change'
          }
        ]
      },
      accountCostList: [],
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      roleId: 0,
      editAccountCostForm: {},
      editAccountCostFormRules: {
        accountCost: [
          { required: true, message: '请输入花费', trigger: 'blur' }
        ]
      },
      seachUserId: '',
      seachStartTime: '',
      seachEndTime: ''
    }
  },
  created() {
    this.roleId = JSON.parse(
      unescape(window.sessionStorage.getItem('data'))
    ).roleId
    this.getAccountCostList()
    this.getUserList()
  },
  methods: {
    /*** 添加账户花费对话框 - 监听关闭事件 ***/
    addAccountCostDialogClose() {
      this.$refs.addAccountCostFormRef.resetFields()
    },
    /*** 添加账户花费对话狂***/
    showAddAccountCostDialogVisible() {
      this.getUserList()
      this.addAccountCostDialogVisible = true
    },
    /*** 获取人员信息 ***/
    async getUserList() {
      const { data: res } = await this.$http.get('/api/regular/getUserList')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data
    },
    /*** 添加账户花费 ***/
    addAccountCost() {
      this.$refs.addAccountCostFormRef.validate(async valid => {
        if (!valid) return
        this.addAccountCostForm.cerateTime = parseInt(
          this.addAccountCostForm.cerateTime.getTime() / 1000
        )
        const { data: res } = await this.$http.post(
          '/api/regular/addAccountCost',
          this.addAccountCostForm
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getAccountCostList()
        this.addAccountCostDialogVisible = false
      })
    },
    /*** 获取账户花费列表 ***/
    async getAccountCostList() {
      const { data: res } = await this.$http.post(
        '/api/regular/getAccountCostList',
        {
          start: (this.currentPage - 1) * this.pageSize,
          end: this.pageSize
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.accountCostList = res.data.list
    },
    /*** 删除账户花费 ***/
    async removeAccountCost(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该Multilogin花费, 是否继续?',
        '删除Multilogin花费',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.post(
        '/api/regular/removeAccountCost',
        {
          id: id
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getAccountCostList()
    },
    /*** 修改账户花费对话框***/
    async showeditAccountCostDialogVisible(id) {
      const {
        data: res
      } = await this.$http.post('/api/regular/getAccountCostById', { id: id })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editAccountCostForm = res.data
      this.editAccountCostDialogVisible = true
    },
    /*** 保存修改的账户花费 ***/
    editAccountCost() {
      this.$refs.editAccountCostFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/api/regular/editAccountCost',
          this.editAccountCostForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getAccountCostList()
        this.editAccountCostDialogVisible = false
      })
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getAccountCostList()
    },
    /*** 查询FB账户 ***/
    async seachAccountCost() {
      if (this.seachStartTime !== '' && this.seachEndTime !== '') {
        const { data: res } = await this.$http.post('/api/regular/seachAccountCost', {
          seachUserId: this.seachUserId,
          seachStartTime: parseInt(this.seachStartTime.getTime() / 1000),
          seachEndTime: parseInt(this.seachEndTime.getTime() / 1000)
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.seachUserId = ''
        this.accountCostList = res.data
      } else {
        return this.$message.error('请选择查询时间段')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>