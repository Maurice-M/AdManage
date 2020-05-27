<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>公共收益列表</el-breadcrumb-item>
    </el-breadcrumb>
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
          <el-button type="success" @click="seachPublic()">查询</el-button>
          <el-button type="primary" @click="showAddDialogVisible()">添加数据</el-button>
        </el-col>
      </el-row>
      <el-table border :data="publicList">
        <el-table-column label="ID" prop="id" width="100px"></el-table-column>
        <el-table-column label="网盟" prop="naName"></el-table-column>
        <el-table-column label="金额(USD)">
          <template slot-scope="scope">{{ scope.row.publicMoney | money }}</template>
        </el-table-column>
        <el-table-column label="备注" prop="msg"></el-table-column>
        <el-table-column label="时间">
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
              @click="removePublic(scope.row.id)"
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
    <!--添加公共收益数据-->
    <el-dialog
      title="添加公共收益"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose()"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="网盟" prop="naId">
          <el-select v-model="addForm.naId" placeholder="请选择网盟">
            <el-option
              v-for="item in NetAllianceList"
              :key="item.id"
              :label="item.naName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="cerateTime">
          <el-date-picker
            v-model="addForm.cerateTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="金额(USB)" prop="publicMoney">
          <el-input v-model="addForm.publicMoney" placeholder="请输入金额" type="number"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.msg"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPublic()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改公共收益" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="网盟" prop="naId">
          <el-select v-model="editForm.naId" placeholder="请选择网盟">
            <el-option
              v-for="item in NetAllianceList"
              :key="item.id"
              :label="item.naName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="publicMoney">
          <el-input v-model="editForm.publicMoney"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.msg"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditPublic()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addDialogVisible: false,
      addForm: {
        naId: '',
        cerateTime: '',
        publicMoney: '',
        msg: ''
      },
      addFormRules: {
        naId: [{ required: true, message: '请选择网盟', trigger: 'change' }],
        cerateTime: [
          {
            type: 'date',
            required: true,
            message: '请选择日期时间',
            trigger: 'change'
          }
        ],
        publicMoney: [
          { required: true, message: '请输入汇款金额', trigger: 'blur' }
        ]
      },
      NetAllianceList: [],
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      publicList: [],
      roleId: 0,
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        naId: [{ required: true, message: '请选择网盟', trigger: 'change' }],
        publicMoney: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ]
      },
      seachNaId: '',
      seachStartTime: '',
      seachEndTime: ''
    }
  },
  created() {
    this.roleId = JSON.parse(
      unescape(window.sessionStorage.getItem('data'))
    ).roleId
    this.getNetAllianceList()
    this.getPublicList()
  },
  methods: {
    /*** 添加公共收益对话框 ***/
    showAddDialogVisible() {
      this.getNetAllianceList()
      this.addDialogVisible = true
    },
    /*** 获取网盟列表 ***/
    async getNetAllianceList() {
      const { data: res } = await this.$http.get('/api/regular/getNetAlliance')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.NetAllianceList = res.data
    },
    /*** 添加公共收益 ***/
    addPublic() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        this.addForm.cerateTime = parseInt(
          this.addForm.cerateTime.getTime() / 1000
        )
        const { data: res } = await this.$http.post(
          '/api/regular/addPublic',
          this.addForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.addDialogVisible = false
        this.$message.success(res.meta.msg)
        this.getPublicList()
      })
    },
    /*** 添加个人提成对话框 - 监听关闭事件 ***/
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getPublicList()
    },
    /*** 获取公共收益列表 ***/
    async getPublicList() {
      const { data: res } = await this.$http.post(
        '/api/regular/getPublicList',
        {
          start: (this.currentPage - 1) * this.pageSize,
          end: this.pageSize
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.publicList = res.data.list
    },
    /*** 修改公共收益对话框 ***/
    async showEditDialogVisible(id) {
      const { data: res } = await this.$http.post(
        '/api/regular/getPublicById',
        { id: id }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.getNetAllianceList()
      this.editDialogVisible = true
    },
    /*** 保存修改共收益 ***/
    saveEditPublic() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/api/regular/saveEditPublic',
          this.editForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.editDialogVisible = false
        this.$message.success(res.meta.msg)
        this.getPublicList()
      })
    },
    /*** 删除公共收益 ***/
    async removePublic(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该公共收益, 是否继续?',
        '删除该公共收益',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.post('/api/regular/removePublic', { id: id })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getPublicList()
    },
    /*** 查询公共花费 ***/
    async seachPublic() {
      if (this.seachStartTime !== '' && this.seachEndTime !== '') {
        const { data: res } = await this.$http.post('/api/regular/seachPublic', {
          seachNaId: this.seachNaId,
          seachStartTime: parseInt(this.seachStartTime.getTime() / 1000),
          seachEndTime: parseInt(this.seachEndTime.getTime() / 1000)
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.total = ''
        this.$message.success(res.meta.msg)
        this.seachNaId = ''
        this.publicList = res.data
      } else {
        return this.$message.error('请选择查询时间段')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>