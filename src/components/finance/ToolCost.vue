<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>工具花费类目</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert title="注意输入币种为美元！！！" type="warning" show-icon></el-alert>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-select style="width:100%" v-model="seachToolId" placeholder="请选择类目">
            <el-option
              v-for="item in toolList"
              :key="item.id"
              :label="item.toolName"
              :value="item.id"
            ></el-option>
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
          <el-button type="success" @click="seachToolCost()">查询</el-button>
          <el-button type="primary" @click="addDialogVisible = true">添加日常花费</el-button>
        </el-col>
      </el-row>
      <el-table :data="toolCostList" border>
        <el-table-column label="ID" prop="id" width="100px"></el-table-column>
        <el-table-column label="工具类" prop="toolName"></el-table-column>
        <el-table-column label="金额(USD))">
          <template slot-scope="scope">{{ scope.row.toolCost | money }}</template>
        </el-table-column>
        <el-table-column label="归属人员" prop="name" width="150px"></el-table-column>
        <el-table-column label="时间" width="170px">
          <template slot-scope="scope">{{ scope.row.cerateTime | dataFormat }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          :width="roleId === 1 ? '150px' : '80px'"
          v-if="roleId === 1 || roleId === 2"
        >
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="showEditDialogVisible(scope.row.id)">编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="roleId === 1"
              @click="removeToolCost(scope.row.id)"
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
    <!-- 添加工具花费金额 -->
    <el-dialog
      title="添加工具花费金额"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose()"
    >
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item label="归属人员" prop="userId">
          <el-select v-model="addFrom.userId" placeholder="请选择人员">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="花费类目" prop="toolId">
          <el-select v-model="addFrom.toolId" placeholder="请选择类目">
            <el-option
              v-for="item in toolList"
              :key="item.id"
              :label="item.toolName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="花费金额" prop="toolCost">
          <el-input v-model="addFrom.toolCost" type="number" placeholder="请输入花费金额"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="cerateTime">
          <el-date-picker
            v-model="addFrom.cerateTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addToolCost()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改工具花费金额 -->
    <el-dialog title="修改工具花费金额" :visible.sync="editDialogVisible" width="30%">
      <el-input v-model="editFrom.toolCost" type="number" placeholder="请输入花费金额"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editToolCost()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addDialogVisible: false,
      userList: [],
      addFrom: {
        userId: '',
        toolId: '',
        toolCost: '',
        cerateTime: ''
      },
      addFromRules: {
        userId: [
          { required: true, message: '请选择归属人员', trigger: 'change' }
        ],
        toolId: [
          { required: true, message: '请选择花费类目', trigger: 'change' }
        ],
        toolCost: [
          {
            required: true,
            message: '请输入花费金额',
            trigger: 'blur'
          }
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
      toolCost: '',
      toolId: '',
      toolList: [],
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      toolCostList: [],
      roleId: 0,
      editDialogVisible: false,
      editFrom: {},
      seachToolId: '',
      seachStartTime: '',
      seachEndTime: ''
    }
  },
  created() {
    this.roleId = JSON.parse(
      unescape(window.sessionStorage.getItem('data'))
    ).roleId
    this.getTools()
    this.getToolCostList()
  },
  methods: {
    /*** 获取人员信息 ***/
    async getUserList() {
      const { data: res } = await this.$http.get('/api/regular/getUserList')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data
    },
    /*** 获取工具类目 ***/
    async getTools() {
      const { data: res } = await this.$http.get('/api/regular/getTools')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.toolList = res.data
    },
    /*** 添加工具类花费 ***/
    addToolCost() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return
        this.addFrom.cerateTime = parseInt(
          this.addFrom.cerateTime.getTime() / 1000
        )
        const { data: res } = await this.$http.post(
          '/api/regular/addToolCost',
          this.addFrom
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.addDialogVisible = false
        this.$message.success(res.meta.msg)
        this.getToolCostList()
      })
    },
    /*** 添加工具花费对话框 - 监听关闭事件 ***/
    addDialogClose() {
      this.$refs.addFromRef.resetFields()
    },
    /*** 获取工具花费列表***/
    async getToolCostList() {
      const { data: res } = await this.$http.post(
        '/api/regular/getToolCostList',
        {
          start: (this.currentPage - 1) * this.pageSize,
          end: this.pageSize
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.toolCostList = res.data.list
    },
    /*** 删除工具花费 ***/
    async removeToolCost(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该工具类花费项, 是否继续?',
        '删除工具类花费项',
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
        '/api/regular/removeToolCost',
        { id: id }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getToolCostList()
    },
    /*** 打开工具花费对话框 ***/
    async showEditDialogVisible(id) {
      const {
        data: res
      } = await this.$http.post('/api/regular/getToolCostById', { id: id })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editFrom = res.data
      this.editDialogVisible = true
    },
    /*** 修改工具花费金额 ***/
    async editToolCost() {
      if (this.editFrom.toolCost === '') {
        return this.$message.error('修改工具花费金额不能为空')
      }
      const { data: res } = await this.$http.post(
        '/api/regular/editToolCost',
        this.editFrom
      )
      if (res.meta.status !== 200) {
        return this.$message.success(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getToolCostList()
      this.editDialogVisible = false
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getToolCostList()
    },
    /*** 查询 ***/
    async seachToolCost() {
      if (this.seachStartTime === '' || this.seachEndTime === '') {
        return this.$message.error('查询条件不足')
      }
      this.total = 0
      const { data: res } = await this.$http.post('/api/regular/seachToolCost', {
        seachToolId: this.seachToolId,
        seachStartTime: parseInt(this.seachStartTime.getTime() / 1000),
        seachEndTime: parseInt(this.seachEndTime.getTime() / 1000)
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.seachToolId = ''
      this.toolCostList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-select {
  width: 130px;
}
</style>