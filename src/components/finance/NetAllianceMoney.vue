<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>网盟汇款列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert title="注意网盟汇款费用的币种为美元！！！" type="warning" show-icon></el-alert>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入汇款金额" v-model="remitMoney" type="number">
            <el-select slot="prepend" v-model="naId" placeholder="请选择网盟">
              <el-option
                v-for="item in NetAllianceList"
                :key="item.id"
                :label="item.naName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="addNaMoney()">添加网盟汇款</el-button>
        </el-col>
      </el-row>
      <el-table :data="naMoneyList" border>
        <el-table-column label="ID" prop="id" width="100px"></el-table-column>
        <el-table-column label="网盟" prop="naName"></el-table-column>
        <el-table-column label="汇款(USD)">
          <template slot-scope="scope">{{ scope.row.remitMoney | money }}</template>
        </el-table-column>
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
      NetAllianceList: [],
      remitMoney: '',
      naId: '',
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      naMoneyList: [],
      roleId: 0,
      editNaMoneyDialogVisible: false,
      editNaMoney: {}
    }
  },
  created() {
    this.roleId = JSON.parse(
      unescape(window.sessionStorage.getItem('data'))
    ).roleId
    this.getNetAllianceList()
    this.getNaMoneyList()
  },
  methods: {
    /*** 获取网盟列表 ***/
    async getNetAllianceList() {
      const { data: res } = await this.$http.get('/api/regular/getNetAlliance')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.NetAllianceList = res.data
    },
    /*** 添加网盟汇款 ***/
    async addNaMoney() {
      if (this.remitMoney === '') {
        return this.$message.error('请输入网盟汇款金额！')
      }
      if (this.naId === '') {
        return this.$message.error('请选择网盟！')
      }
      const { data: res } = await this.$http.post('/api/regular/addNaMoney', {
        remitMoney: this.remitMoney,
        naId: this.naId
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getNaMoneyList()
      this.remitMoney = ''
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
      const { data: res } = await this.$http.post('/api/regular/getNaMoneyById', { id: id })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editNaMoney = res.data
      this.editNaMoneyDialogVisible = true
    },
    /*** 修改网盟汇款金额 ***/
    async saveNaMoney() {
      if (this.editNaMoney.remitMoney === '') { return this.$message.error('汇款金额不能为空') }
      const { data: res } = await this.$http.post('/api/regular/saveNaMoney', this.editNaMoney)
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
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
      const { data: res } = await this.$http.post('/api/regular/removeNaMoney', { id: id })
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.$message.success(res.meta.msg)
      this.getNaMoneyList()
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getNaMoneyList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-select {
  width: 150px;
}
</style>