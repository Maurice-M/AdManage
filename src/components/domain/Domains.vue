<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>域名管理</el-breadcrumb-item>
      <el-breadcrumb-item>域名列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert title="注意输入币种为人民币！！！" type="warning" show-icon></el-alert>
    <el-card>
      <el-button type="success" @click="addDomainDialogVisible = true">添加域名</el-button>
      <el-table :data="domainList" border>
          <el-table-column label="ID" prop="id" width="100px"></el-table-column>
          <el-table-column label="域名" prop="domain"></el-table-column>
          <el-table-column label="价格" width="120px">
              <template slot-scope="scope">
                  {{ scope.row.price | money }}
              </template>
          </el-table-column>
          <el-table-column label="归属人员" prop="name" width="120px"></el-table-column>
          <el-table-column label="时间" width="180px">
              <template slot-scope="scope">
                  {{ scope.row.cerateTime | dataFormat }}
              </template>
          </el-table-column>
      </el-table>
      <el-row>
        <el-col>
          <el-pagination
            background
            :pager-count='pagerCount'
            :current-page="currentPage"
            :page-size="pageSize"
            @current-change="paginationChange"
            layout="total, pager"
            :total="total"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加域名对话框 -->
    <el-dialog
      title="添加域名"
      :visible.sync="addDomainDialogVisible"
      @close="addDomainDialogClose()"
      width="50%"
    >
      <el-form :model="domainForm" :rules="domainFormRules" ref="domainFormRef" label-width="100px">
        <el-form-item label="域名" prop="domain">
          <el-input v-model="domainForm.domain">
            <template slot="prepend">Http://</template>
          </el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="domainForm.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="归属人员" prop="userId">
          <el-select placeholder="请选择" v-model="domainForm.userId">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDomainDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDomain()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      domainList: [],
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      addDomainDialogVisible: false,
      userList: [],
      domainForm: {
        domain: '',
        price: '',
        userId: ''
      },
      domainFormRules: {
        domain: [{ required: true, message: '请输入域名', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        userId: [
          { required: true, message: '请选择归属人员', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
    this.getDomainList()
  },
  methods: {
    /*** 获取用户列表 ***/
    async getUserList() {
      const { data: res } = await this.$http.get('api/domain/getUserList')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data
    },
    /*** 提交添加域名 ***/
    addDomain() {
      this.$refs.domainFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/api/domain/addDmoain',
          this.domainForm
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getDomainList()
        this.addDomainDialogVisible = false
      })
    },
    /*** 添加域名对话框 - 监听关闭事件 ***/
    addDomainDialogClose() {
      this.$refs.domainFormRef.resetFields()
    },
    /*** 获取域名列表 ***/
    async getDomainList() {
      const { data: res } = await this.$http.post('/api/domain/getDomainList', {
        start: (this.currentPage - 1) * this.pageSize,
        end: this.pageSize
      })
      if (res.meta.status !== 200) return this.$http.error(res.meta.msg)
      this.total = res.data.total
      this.domainList = res.data.list
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getDomainList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>