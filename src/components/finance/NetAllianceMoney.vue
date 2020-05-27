<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>网盟收入列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert title="注意网盟汇款费用的币种为美元！！！" type="warning" show-icon></el-alert>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-select style="width:150px" v-model="seachNaId" placeholder="请选择广告商">
            <el-option
              v-for="item in NetAllianceList"
              :key="item.id"
              :label="item.naName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select style="width:150px" v-model="seachUserId" placeholder="请选择人员">
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
          <el-button type="success" @click="seachNamoney()">查询</el-button>
          <el-button type="primary" @click="showAddNaMoneyDialogVisible()">添加网盟收入</el-button>
        </el-col>
      </el-row>
      <el-table :data="naMoneyList" border>
        <el-table-column label="ID" prop="id" width="100px"></el-table-column>
        <el-table-column label="网盟" prop="naName"></el-table-column>
        <el-table-column label="汇款(USD)">
          <template slot-scope="scope">{{ scope.row.remitMoney | money }}</template>
        </el-table-column>
        <el-table-column label="归属人员" prop="name"></el-table-column>
        <el-table-column label="时间" width="160px">
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
              @click="showEditNaMoneyDialogVisible(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="roleId === 1"
              @click="removeNaMoney(scope.row.id)"
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
    <!--添加网盟汇款对话框-->
    <el-dialog
      title="添加网盟汇款(USD)"
      :visible.sync="addNaMoneyDialogVisible"
      width="55%"
      @close="addNaDialogClose()"
    >
      <el-form :model="addNaForm" :rules="addNaRules" ref="addNaRef" label-width="120px">
        <el-form-item label="归属人员" prop="userId">
          <el-select placeholder="请选择归属人员" v-model="addNaForm.userId">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网盟" prop="naId">
          <el-select v-model="addNaForm.naId" placeholder="请选择网盟">
            <el-option
              v-for="item in NetAllianceList"
              :key="item.id"
              :label="item.naName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇款金额(USD)" prop="remitMoney">
          <el-input v-model="addNaForm.remitMoney"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="cerateTime" placeholder="请输入日期时间">
          <el-date-picker
            v-model="addNaForm.cerateTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addNaMoneyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNaMoney()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改网盟汇款对话框 -->
    <el-dialog title="修改汇款金额(USD)" :visible.sync="editNaMoneyDialogVisible" width="50%">
      <el-input v-model="editNaMoney.remitMoney"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editNaMoneyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveNaMoney()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addNaMoneyDialogVisible: false,
      userList: [],
      addNaForm: {
        remitMoney: '',
        naId: '',
        userId: '',
        cerateTime: ''
      },
      addNaRules: {
        userId: [
          { required: true, message: '请选择归属人员', trigger: 'change' }
        ],
        naId: [{ required: true, message: '请选择网盟', trigger: 'change' }],
        remitMoney: [
          { required: true, message: '请输入汇款金额', trigger: 'blur' }
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
      NetAllianceList: [],
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      naMoneyList: [],
      roleId: 0,
      editNaMoneyDialogVisible: false,
      editNaMoney: {},
      seachNaId: '',
      seachUserId: '',
      seachStartTime: '',
      seachEndTime: ''
    }
  },
  created() {
    this.roleId = JSON.parse(
      unescape(window.sessionStorage.getItem('data'))
    ).roleId
    this.getNaMoneyList()
    this.getUserList()
    this.getNetAllianceList()
  },
  methods: {
    showAddNaMoneyDialogVisible() {
      this.getUserList()
      this.getNetAllianceList()
      this.addNaMoneyDialogVisible = true
    },
    /*** 获取人员信息 ***/
    async getUserList() {
      const { data: res } = await this.$http.get('/api/regular/getUserList')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data
    },
    /*** 获取网盟列表 ***/
    async getNetAllianceList() {
      const { data: res } = await this.$http.get('/api/regular/getNetAlliance')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.NetAllianceList = res.data
    },
    /*** 添加网盟汇款对话框 - 监听关闭事件 ***/
    addNaDialogClose() {
      this.$refs.addNaRef.resetFields()
    },
    /*** 添加网盟汇款 ***/
    addNaMoney() {
      this.$refs.addNaRef.validate(async valid => {
        if (!valid) return
        this.addNaForm.cerateTime = parseInt(
          this.addNaForm.cerateTime.getTime() / 1000
        )
        const { data: res } = await this.$http.post(
          '/api/regular/addNaMoney',
          this.addNaForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.addNaMoneyDialogVisible = false
        this.$message.success(res.meta.msg)
        this.getNaMoneyList()
      })
    },
    /*** 获取网盟汇款表 ***/
    async getNaMoneyList() {
      const { data: res } = await this.$http.post(
        '/api/regular/getNaMoneyList',
        {
          start: (this.currentPage - 1) * this.pageSize,
          end: this.pageSize
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.naMoneyList = res.data.list
    },
    /*** 打开修改网盟对话框 ***/
    async showEditNaMoneyDialogVisible(id) {
      const { data: res } = await this.$http.post(
        '/api/regular/getNaMoneyById',
        { id: id }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editNaMoney = res.data
      this.editNaMoneyDialogVisible = true
    },
    /*** 修改网盟汇款金额 ***/
    async saveNaMoney() {
      if (this.editNaMoney.remitMoney === '') {
        return this.$message.error('汇款金额不能为空')
      }
      const { data: res } = await this.$http.post(
        '/api/regular/saveNaMoney',
        this.editNaMoney
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.editNaMoneyDialogVisible = false
      this.getNaMoneyList()
    },
    /*** 删除网盟汇款 ***/
    async removeNaMoney(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该网盟汇款, 是否继续?',
        '删除网盟汇款',
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
        '/api/regular/removeNaMoney',
        { id: id }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getNaMoneyList()
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getNaMoneyList()
    },
    /*** 查询 ***/
    async seachNamoney() {
      if (this.seachStartTime === '' || this.seachEndTime === '') {
        return this.$message.error('请选择查询时间段')
      }
      this.total = ''
      const { data: res } = await this.$http.post('api/regular/seachNamoney', {
        seachNaId: this.seachNaId,
        seachUserId: this.seachUserId,
        seachStartTime: parseInt(this.seachStartTime.getTime() / 1000),
        seachEndTime: parseInt(this.seachEndTime.getTime() / 1000)
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.seachUserId = ''
      this.seachNaId = ''
      this.naMoneyList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-select {
  width: 150px;
}
</style>