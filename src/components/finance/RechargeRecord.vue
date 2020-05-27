<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>合并利润列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10" style="margin-bottom: 16px">
        <el-col :span="6">
          <el-input placeholder="请输入充值金额" v-model="price" type="number"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="addMoney">充值</el-button>
          <el-button type="warning" @click="showOutMonayDialogVisible()">添加消费</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
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
          <el-button type="success" @click="seachMoney()">查询</el-button>
          <el-button type="primary" @click="outExcel(moneyList)">导出表格</el-button>
        </el-col>
      </el-row>
      <el-table border :data="moneyList">
        <el-table-column label="ID" prop="id" width="100px"></el-table-column>
        <el-table-column label="归属人员" prop="name" width="100px"></el-table-column>
        <el-table-column label="金额" prop="price"></el-table-column>
        <el-table-column label="余额" prop="balance"></el-table-column>
        <el-table-column label="备注" prop="msg"></el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">{{ scope.row.cerateTime | dataFormat}}</template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加信用卡消费" :visible.sync="OutMonayDialogVisible" width="50%">
      <el-form
        :model="outMoneyForm"
        :rules="outMoneyFormRules"
        ref="outMoneyFormRef"
        label-width="100px"
        class="demo-ruleForm"
        @close="outMoneyDialogClose()"
      >
        <el-form-item label="归属人员" prop="userId">
          <el-select placeholder="请选择归属人员" v-model="outMoneyForm.userId">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消费金额" prop="cost">
          <el-input placeholder="请输入消费金额" v-model="outMoneyForm.cost"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="msg">
          <el-input v-model="outMoneyForm.msg"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="cerateTime" placeholder="请输入日期时间">
          <el-date-picker
            v-model="outMoneyForm.cerateTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="OutMonayDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="OutMonay()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      price: '',
      moneyList: [],
      userList: [],
      OutMonayDialogVisible: false,
      outMoneyForm: {
        userId: '',
        cost: '',
        msg: '',
        cerateTime: ''
      },
      outMoneyFormRules: {
        userId: [
          { required: true, message: '请选择归属人员', trigger: 'change' }
        ],
        cost: [{ required: true, message: '请输入消费金额', trigger: 'blur' }],
        msg: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        cerateTime: [
          {
            type: 'date',
            required: true,
            message: '请选择日期时间',
            trigger: 'change'
          }
        ]
      },
      seachStartTime: '',
      seachEndTime: ''
    }
  },
  created() {
    this.getMoney()
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
    async addMoney() {
      if (this.price === '') {
        return this.$message.error('请输入充值金额')
      }
      const { data: res } = await this.$http.post('/api/regular/addMoney', {
        price: this.price
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.price = ''
    },
    async getMoney() {
      const { data: res } = await this.$http.post('/api/regular/getMoney')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.moneyList = res.data
    },
    outExcel(res) {
      require.ensure([], () => {
        const { exportJsonToExcel } = require('../../excel/Export2Excel.js')
        const tHeader = ['ID', '归属人员', '金额', '余额', '备注', '时间']
        const filterVal = [
          'id',
          'name',
          'price',
          'balance',
          'msg',
          'cerateTime'
        ]
        const list = res
        const data = this.formatJson(filterVal, list)
        exportJsonToExcel(tHeader, data, '信用卡消费统计表')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    showOutMonayDialogVisible() {
      this.getUserList()
      this.OutMonayDialogVisible = true
    },
    OutMonay() {
      this.$refs.outMoneyFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/api/regular/outMoney', {
          userId: this.outMoneyForm.userId,
          price: this.outMoneyForm.cost,
          msg: this.outMoneyForm.msg,
          cerateTime: parseInt(this.outMoneyForm.cerateTime.getTime() / 1000)
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.OutMonayDialogVisible = false
        this.getMoney()
      })
    },
    /*** 添加花费对话框 - 监听关闭事件 ***/
    outMoneyDialogClose() {
      this.$refs.outMoneyFormRef.resetFields()
    },
    async seachMoney() {
      if (this.seachStartTime !== '' && this.seachEndTime !== '') {
        const { data: res } = await this.$http.post('/api/regular/seachMoney', {
          seachStartTime: parseInt(this.seachStartTime.getTime() / 1000),
          seachEndTime: parseInt(this.seachEndTime.getTime() / 1000)
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.seachStartTime = ''
        this.seachEndTime = ''
        this.moneyList = res.data
      } else {
        return this.$message.error('请输入查询时间段')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>