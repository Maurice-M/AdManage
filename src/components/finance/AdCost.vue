<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>广告花费列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert title="注意广告费用请输入币种为美元！！！" type="warning" show-icon></el-alert>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-select style="width:100%" v-model="seachAdId" placeholder="请选择类目">
            <el-option v-for="item in adList" :key="item.id" :label="item.adName" :value="item.id"></el-option>
          </el-select>
        </el-col>
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
          <el-button type="success" @click="seachAdCost()">查询</el-button>
          <el-button type="primary" @click="showAddAdCostDialogVisible()">添加广告花费</el-button>
        </el-col>
      </el-row>
      <el-table :data="adCostList" border>
        <el-table-column label="ID" prop="id" width="80px"></el-table-column>
        <el-table-column label="广告商" prop="adName" width="160px"></el-table-column>
        <el-table-column label="开户费(USD)">
          <template slot-scope="scope">{{ scope.row.accountCost | money }}</template>
        </el-table-column>
        <el-table-column label="广告费(USD)">
          <template slot-scope="scope">{{ scope.row.adCost | money }}</template>
        </el-table-column>
        <el-table-column label="手续费(USD)" prop="formalities" v-if="roleId === 1 || roleId === 2"></el-table-column>
        <el-table-column label="总费用费(USD)" v-if="roleId === 1 || roleId === 2">
          <template slot-scope="scope">{{ scope.row.total | money }}</template>
        </el-table-column>
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
              @click="showEditAdCostDialogVisible(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="roleId === 1"
              @click="removeAdCost(scope.row.id)"
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
    <!-- 添加广告花费对话框 -->
    <el-dialog
      title="添加广告花费"
      :visible.sync="addAdCostDialogVisible"
      @close="addAdCostDialogClose()"
      width="50%"
    >
      <el-form
        :model="addAdCostForm"
        :rules="addAdCostFormRules"
        ref="addAdCostFormRef"
        label-width="120px"
      >
        <el-form-item label="归属人员" prop="userId">
          <el-select placeholder="请选择归属人员" v-model="addAdCostForm.userId">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告商" prop="adId">
          <el-select placeholder="请选择广告商" v-model="addAdCostForm.adId">
            <el-option v-for="item in adList" :key="item.id" :label="item.adName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户费(USD)" prop="accountCost">
          <el-input v-model="addAdCostForm.accountCost" placeholder="请输入开户费" type="number"></el-input>
        </el-form-item>
        <el-form-item label="广告费(USD)" prop="adCost">
          <el-input v-model="addAdCostForm.adCost" placeholder="请输入广告费" type="number"></el-input>
        </el-form-item>
        <el-form-item label="手续费(USD)" prop="formalities">
          <el-input v-model="addAdCostForm.formalities" placeholder="请输入百分比手续费" type="number"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="cerateTime" placeholder="请输入日期时间">
          <el-date-picker
            v-model="addAdCostForm.cerateTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAdCostDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdCost()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改广告花费对话框 -->
    <el-dialog title="添加广告花费" :visible.sync="editAdCostDialogVisible" width="50%">
      <el-form
        :model="editAdCostForm"
        :rules="editAdCostFormRules"
        ref="editAdCostFormRef"
        label-width="120px"
      >
        <el-form-item label="ID">
          <el-input v-model="editAdCostForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="开户费(USD)">
          <el-input v-model="editAdCostForm.accountCost" type="number"></el-input>
        </el-form-item>
        <el-form-item label="广告费(USD)" prop="adCost">
          <el-input v-model="editAdCostForm.adCost" type="number"></el-input>
        </el-form-item>
        <el-form-item label="手续费(USD)" prop="formalities">
          <el-input v-model="editAdCostForm.formalities" placeholder="请输入百分比手续费" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAdCostDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAdCost()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addAdCostDialogVisible: false,
      editAdCostDialogVisible: false,
      userList: [],
      adList: [],
      addAdCostForm: {
        userId: '',
        adId: '',
        accountCost: '',
        adCost: '',
        formalities: '',
        cerateTime: ''
      },
      addAdCostFormRules: {
        userId: [
          { required: true, message: '请选择归属人员', trigger: 'change' }
        ],
        adId: [{ required: true, message: '请选择广告商', trigger: 'change' }],
        accountCost: [
          { required: true, message: '请输入开户费', trigger: 'blur' }
        ],
        adCost: [{ required: true, message: '请输入广告费', trigger: 'blur' }],
        formalities: [
          { required: true, message: '请输入手续费百分比', trigger: 'blur' }
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
      adCostList: [],
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      roleId: 0,
      editAdCostForm: {},
      editAdCostFormRules: {
        adCost: [{ required: true, message: '请输入广告费', trigger: 'blur' }],
        formalities: [
          { required: true, message: '请输入手续费', trigger: 'blur' }
        ]
      },
      seachAdId: '',
      seachUserId: '',
      seachStartTime: '',
      seachEndTime: ''
    }
  },
  created() {
    this.roleId = JSON.parse(
      unescape(window.sessionStorage.getItem('data'))
    ).roleId
    this.getAdCostList()
    this.getAdList()
    this.getUserList()
  },
  methods: {
    /*** 添加广告花费对话框 - 监听关闭事件 ***/
    addAdCostDialogClose() {
      this.$refs.addAdCostFormRef.resetFields()
    },
    /*** 添加广告花费对话狂***/
    showAddAdCostDialogVisible() {
      this.getUserList()
      this.getAdList()
      this.addAdCostDialogVisible = true
    },
    /*** 获取人员信息 ***/
    async getUserList() {
      const { data: res } = await this.$http.get('/api/regular/getUserList')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data
    },
    /*** 获取广告商信息 ***/
    async getAdList() {
      const { data: res } = await this.$http.get('/api/regular/getAdList')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.adList = res.data
    },
    /*** 添加广告花费 ***/
    addAdCost() {
      this.$refs.addAdCostFormRef.validate(async valid => {
        if (!valid) return
        this.addAdCostForm.cerateTime = parseInt(
          this.addAdCostForm.cerateTime.getTime() / 1000
        )
        const { data: res } = await this.$http.post(
          '/api/regular/addAdCost',
          this.addAdCostForm
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getAdCostList()
        this.addAdCostDialogVisible = false
      })
    },
    /*** 获取广告花费列表 ***/
    async getAdCostList() {
      const { data: res } = await this.$http.post(
        '/api/regular/getAdCostList',
        {
          start: (this.currentPage - 1) * this.pageSize,
          end: this.pageSize
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.adCostList = res.data.list
    },
    /*** 删除广告花费 ***/
    async removeAdCost(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该广告花费, 是否继续?',
        '删除广告花费',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.post('/api/regular/removeAdCost', {
        id: id
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getAdCostList()
    },
    /*** 修改广告花费对话框***/
    async showEditAdCostDialogVisible(id) {
      const { data: res } = await this.$http.post(
        '/api/regular/getAdCostById',
        { id: id }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editAdCostForm = res.data
      this.editAdCostDialogVisible = true
    },
    /*** 保存修改的广告花费 ***/
    editAdCost() {
      this.$refs.editAdCostFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/api/regular/editAdCost',
          this.editAdCostForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getAdCostList()
        this.editAdCostDialogVisible = false
      })
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getAdCostList()
    },
    async seachAdCost() {
      if (this.seachStartTime === '' || this.seachEndTime === '') {
        return this.$message.error('查询时间不能为空')
      }
      const { data: res } = await this.$http.post('/api/regular/seachAdCost', {
        seachAdId: this.seachAdId,
        seachUserId: this.seachUserId,
        seachStartTime: parseInt(this.seachStartTime.getTime() / 1000),
        seachEndTime: parseInt(this.seachEndTime.getTime() / 1000)
      })
      this.total = ''
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.adCostList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>