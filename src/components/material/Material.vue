<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>素材管理</el-breadcrumb-item>
      <el-breadcrumb-item>素材列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="seach" placeholder="请输入查询关键字" clearable @clear="getMaterialList()"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="seachMaterial()">查询</el-button>
          <el-button type="primary" @click="showAddDialogVisible()">添加素材</el-button>
        </el-col>
      </el-row>
      <el-table :data="matetialList" border>
        <el-table-column label="ID" prop="id" width="80px"></el-table-column>
        <el-table-column label="素材" width="130px">
          <template slot-scope="scope">
            <span v-if="scope.row.format === 'picture'">
              <a :href="scope.row.url" target="_blank">
                <img v-lazy="scope.row.url" :alt="scope.row.name" width="100px" height="100px" />
              </a>
            </span>
            <span v-if="scope.row.format === 'video'">
              <a :href="scope.row.url" target="_blank">
                <video
                  :src="scope.row.url + '#t=5'"
                  preload="“metadata”"
                  width="100px"
                  height="100px"
                ></video>
              </a>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="素材名称" prop="name"></el-table-column>
        <el-table-column label="素材分类" prop="className" width="80px"></el-table-column>
        <el-table-column label="素材格式" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.format === 'video'">视频</span>
            <span v-if="scope.row.format === 'picture'">图片</span>
          </template>
        </el-table-column>
        <el-table-column label="素材评分" prop="rate" width="80px"></el-table-column>
        <el-table-column label="时间" width="160px">
          <template slot-scope="scope">{{ scope.row.cerateTime | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="goComment(scope.row.id)">评论</el-button>
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
    <!-- 添加素材对话框 -->
    <el-dialog title="添加素材" :visible.sync="AddDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="AddForm" :rules="AddFormRules" ref="AddFormRef" label-width="100px">
        <el-form-item label="素材名称" prop="name">
          <el-input v-model="AddForm.name"></el-input>
        </el-form-item>
        <el-form-item label="素材分类" prop="classId">
          <el-select v-model="AddForm.classId">
            <el-option
              v-for="item in classificationList"
              :key="item.id"
              :label="item.className"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="素材格式" prop="format">
          <el-select v-model="AddForm.format">
            <el-option label="图片" value="picture"></el-option>
            <el-option label="视频" value="video"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="素材地址" prop="url">
          <el-input v-model="AddForm.url"></el-input>
          <el-upload
            class="upload-demo"
            action="https://upload-z2.qiniup.com"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :data="qiniuForm"
            :on-success="uploadSuccess"
            :on-error="uploadError"
          >
            <el-button size="small" type="primary">上传素材</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMaterial()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      AddDialogVisible: false,
      classificationList: [],
      AddForm: {
        name: '',
        classId: '',
        format: '',
        url: ''
      },
      AddFormRules: {
        name: [{ required: true, message: '请输入素材名称', trigger: 'blur' }],
        classId: [
          { required: true, message: '请选择素材分类', trigger: 'change' }
        ],
        format: [
          { required: true, message: '请选择素材格式', trigger: 'change' }
        ],
        url: [{ required: true, message: '请上传素材', trigger: 'blur' }]
      },
      qiniuForm: {
        key: '',
        token: ''
      },
      qiniuUrl: 'http://qaz0lou24.bkt.clouddn.com',
      pagerCount: 5,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      matetialList: [],
      seach: ''
    }
  },
  created() {
    this.getMaterialList()
  },
  methods: {
    /*** 素材上传前验证 ***/
    async beforeUpload(file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传素材图片大小不能超过2MB!')
          return false
        }
      } else if (file.type === 'video/mp4') {
        const isLt80M = file.size / 1024 / 1024 < 80
        if (!isLt80M) {
          this.$message.error('上传素材视频大小不能超过80MB!')
          return false
        }
      } else {
        this.$message.error('上传素材仅支持图片JPG或者PNG格式、视频MP4格式！')
        return false
      }
      const { data: res } = await this.$http.get('/api/upload/getToken')
      if (res.meta.status !== 200) {
        this.$message.error('token获取失败')
        return false
      }
      const fileType = ''
      if (file.type === 'image/jpeg') {
        this.fileType = 'jpg'
      }
      if (file.type === 'image/png') {
        this.fileType = 'png'
      }
      if (file.type === 'video/mp4') {
        this.fileType = 'mp4'
      }
      this.qiniuForm = {
        key:
          new Date().getTime() +
          Math.floor(Math.random() * 100000) +
          '.' +
          this.fileType,
        token: res.token
      }
      return true
    },
    /*** 素材上传成功 ***/
    uploadSuccess(response, file, fileList) {
      this.AddForm.url = this.qiniuUrl + '/' + response.key
      this.$message.success('素材上传成功')
    },
    /*** 图片上传失败 ***/
    uploadError(err, file, fileList) {
      this.$message.error('素材上传失败')
    },
    /*** 保存素材 ***/
    addMaterial() {
      this.$refs.AddFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/api/material/addMaterial',
          this.AddForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.AddDialogVisible = false
        this.getMaterialList()
      })
    },
    showAddDialogVisible() {
      this.getClassification()
      this.AddDialogVisible = true
    },
    /*** 获取素材分类 ***/
    async getClassification() {
      const { data: res } = await this.$http.get(
        '/api/material/getClassification'
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.classificationList = res.data
    },
    paginationChange(newCurrentPage) {
      this.currentPage = newCurrentPage
      this.getAdCostList()
    },
    /*** 获取素材列表 ***/
    async getMaterialList() {
      const { data: res } = await this.$http.post(
        '/api/material/getMaterialList',
        {
          start: (this.currentPage - 1) * this.pageSize,
          end: this.pageSize
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.matetialList = res.data.list
    },
    /*** 添加素材对话框 - 监听关闭事件 ***/
    addDialogClose() {
      this.$refs.AddFormRef.resetFields()
    },
    goComment(id) {
      this.$router.push({ path: `/comment/${id}` })
    },
    /*** 查询关键词 ***/
    async seachMaterial() {
      if (this.seach === '') {
        return this.$message.error('请输入需要查询的关键词')
      }
      const { data: res } = await this.$http.post('/api/material/seachMaterial', { seach: this.seach })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = ''
      this.seach = ''
      this.matetialList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>