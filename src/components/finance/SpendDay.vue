<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>日常费用类目</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert title="注意输入币种为人民币！！！" type="warning" show-icon></el-alert>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入花费金额" v-model="cost" type="number">
            <el-select slot="prepend" v-model="regId" placeholder="请选择类目">
              <el-option
                v-for="item in regularList"
                :key="item.id"
                :label="item.regName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="addSpendDay()">添加日常花费</el-button>
        </el-col>
      </el-row>
      <el-table :data="spendDayList" border>
        <el-table-column label="ID" prop="id" width="100px"></el-table-column>
        <el-table-column label="花费类目" prop="regName"></el-table-column>
        <el-table-column label="花费金额(RMB)">
          <template slot-scope="scope">{{ scope.row.cost | money }}</template>
        </el-table-column>
        <el-table-column label="时间" width="170px">
          <template slot-scope="scope">{{scope.row.cerateTime | dataFormat }}</template>
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
              @click="removeSpendDay(scope.row.id)"
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
    <!-- 修改日常花费金额 -->
    <el-dialog title="修改日常花费金额" :visible.sync="editDialogVisible" width="30%">
      <el-input v-model="editFrom.cost" type="number"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSpendDayCost()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      regularList: [],
      regId: '',
      cost: '',
      spendDayList: [],
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      editDialogVisible: false,
      editFrom: {},
      roleId: 0
    }
  },
  created() {
    this.roleId = JSON.parse(
      unescape(window.sessionStorage.getItem('data'))
    ).roleId
    this.getSpendDayList()
    this.getRegularList()
  },
  methods: {
    /*** 获取日常费用类目列表 ***/
    async getRegularList() {
      const { data: res } = await this.$http.get('api/regular/getRegularList')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.regularList = res.data
    },
    /*** 添加日常花费 ***/
    async addSpendDay() {
      if (this.regId === '') {
        return this.$message.error('请选择花费类目！')
      }
      if (this.cost === '') {
        return this.$message.error('请输入花费金额！')
      }
      const { data: res } = await this.$http.post('/api/regular/addSpendDay', {
        regId: this.regId,
        cost: this.cost
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getSpendDayList()
      this.cost = ''
    },
    /*** 获取日常花费 ***/
    async getSpendDayList() {
      const { data: res } = await this.$http.post(
        '/api/regular/getSpendDayList',
        {
          start: (this.currentPage - 1) * this.pageSize,
          end: this.pageSize
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.spendDayList = res.data.list
    },
    /*** 删除日常花费 ***/
    async removeSpendDay(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该日常花费, 是否继续?',
        '删除日常花费',
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
        'api/regular/removeSpendDay',
        {
          id: id
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getSpendDayList()
    },
    /*** 打开修改日常花费金额对话框***/
    async showEditDialogVisible(id) {
      const { data: res } = await this.$http.post('/api/regular/getSpendDayById', { id: id })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editFrom = res.data
      this.editDialogVisible = true
    },
    /***修改金额***/
    async editSpendDayCost() {
      if (this.editFrom.cost === '') {
        this.$message.error('日常花费金额不能为空')
      }
      const { data: res } = await this.$http.post(
        '/api/regular/editSpendDayCost',
        this.editFrom
      )
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getSpendDayList()
      this.editDialogVisible = false
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getSpendDayList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-select {
  width: 130px;
}
</style>