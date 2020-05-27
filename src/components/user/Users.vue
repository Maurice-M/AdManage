<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="success" @click="addUserDialogVisible = true">添加用户</el-button>
      <el-table border :data="userList">
        <el-table-column label="ID" prop="id" width="80px"></el-table-column>
        <el-table-column label="姓名" prop="name" width="120px"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="iphone"></el-table-column>
        <el-table-column label="状态" width="65px">
          <template slot-scope="scope">{{stateObj[scope.row.state]}}</template>
        </el-table-column>
        <el-table-column label="角色" prop="roleName" width="100px"></el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">{{scope.row.create_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialig(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加新用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      @close="addDialogClose()"
      width="40%"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="iphone">
          <el-input v-model="addForm.iphone"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="addForm.state">
            <el-option label="禁止" value="0"></el-option>
            <el-option label="启动" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      @close="editDialogClose()"
      width="60%"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="基本工资(RMB)" prop="price">
          <el-input v-model="editForm.price"></el-input>
        </el-form-item>
        <el-form-item label="提成" prop="commission">
          <el-input v-model="editForm.commission"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="editForm.state">
            <el-option label="禁止" :value="0"></el-option>
            <el-option label="启动" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClose()"
    >
      <div>
        <p>当前用户：{{userInfo.name}}</p>
        <p>当前用户：{{userInfo.roleName}}</p>
        <p>
          分配角色：
          <el-select v-model="selectRoleId">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callbac) => {
      const regEamil = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEamil.test(value)) {
        return callbac()
      }
      callbac(new Error('请输入正确的邮箱格式'))
    }
    var checkIphone = (rule, value, callbac) => {
      const regIphone = /^(0|89?17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|15[57])[0-9]{8}$/
      if (regIphone.test(value)) {
        return callbac()
      }
      callbac(new Error('请输入正确的手机格式'))
    }
    return {
      userList: [],
      stateObj: {
        '0': '禁止',
        '1': '启用'
      },
      addUserDialogVisible: false,
      addForm: {
        name: '',
        password: '',
        email: '',
        iphone: '',
        state: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入用户真实姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在6-15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        iphone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkIphone, trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择账户状态', trigger: 'change' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        price: [{ required: true, message: '请输入基本工资', trigger: 'blur' }],
        commission: [
          { required: true, message: '请输入提成', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择账户状态', trigger: 'change' }
        ]
      },
      setRoleDialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    /*** 获取账户列表 ***/
    async getUserList() {
      const { data: res } = await this.$http.get('api/user/userList')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data
    },
    /*** 添加用户对话框 - 监听关闭时间 ***/
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    /*** 添加用用户 ***/
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'api/user/addUser',
          this.addForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addUserDialogVisible = false
        this.getUserList()
      })
    },
    /*** 获取修改用户信息对话框 ***/
    async showEditDialig(id) {
      const { data: res } = await this.$http.post('/api/user/getUserById', {
        id: id
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    /*** 修改用户信息提交 ***/
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'api/user/edit',
          this.editForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    /*** 修改对话框 - 监听关闭事件 ***/
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    /*** 删除用户 ***/
    async removeUser(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '删除用户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.post('api/user/removeUser', {
        id: id
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    /*** 分配角色 ***/
    async setRole(userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('api/user/getRoles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    //保存修改角色分配
    async editUserRole() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择新的分配角色！')
      }
      const { data: res } = await this.$http.post('api/user/editUserRole', {
        id: this.userInfo.id,
        roleId: this.selectRoleId
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClose() {
      this.userInfo = []
      this.selectRoleId = ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>