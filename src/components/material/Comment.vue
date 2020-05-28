<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>素材管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/materials' }">素材列表</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row style="margin-bottom:20px">
        <el-col>
          <el-button type="success" @click="addCommentDialogVisible = true">添加评论</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-table :data="commentList">
            <el-table-column label="姓名" prop="name" width="80px"></el-table-column>
            <el-table-column label="素材评分" width="280px">
              <template scope="scope">
                <el-rate
                  disabled
                  show-score
                  text-color="#ff9900"
                  :max="10"
                  v-model="scope.row.rate"
                ></el-rate>
              </template>
            </el-table-column>
            <el-table-column label="使用心得" prop="message"></el-table-column>
            <el-table-column label="时间" width="180px">
              <template slot-scope="scope">{{ scope.row.cerateTime | dataFormat }}</template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6">
          <video
            v-if="materialInfo.format === 'video'"
            :src="materialInfo.url"
            width="100%"
            controls
            preload
          ></video>

          <img
            v-if="materialInfo.format === 'picture'"
            :src="materialInfo.url"
            :alt="materialInfo.name"
            width="100%"
          />
          <p>名称：{{ materialInfo.name }}</p>
          <p>评分：<span style="color:rgb(247, 186, 42)">{{ materialInfo.rate }}分</span></p>
          <p>时间：{{ materialInfo.cerateTime | dataFormat }}</p>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加评论对话框 -->

    <el-dialog
      title="添加评论"
      :visible.sync="addCommentDialogVisible"
      width="50%"
      @close="addComentFormClose()"
    >
      <el-form
        :model="addComentForm"
        :rules="addComentFormRules"
        ref="addComentFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="素材评分" prop="rate">
          <el-rate v-model="addComentForm.rate" show-score text-color="#ff9900" :max="10"></el-rate>
        </el-form-item>
        <el-form-item prop="message">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入你的使用心得"
            v-model="addComentForm.message"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCommentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addComment()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var validatorRate = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('请选择素材评分'))
      } else {
        callback()
      }
    }
    return {
      userId: '',
      materialId: '',
      materialInfo: [],
      addCommentDialogVisible: false,
      addComentForm: {
        rate: null,
        message: ''
      },
      addComentFormRules: {
        rate: [{ validator: validatorRate, trigger: 'change' }],
        message: [
          { required: true, message: '请输入素材使用心得', trigger: 'blur' }
        ]
      },
      commentList: []
    }
  },
  created() {
    this.materialId = this.$route.params.id
    this.userId = JSON.parse(unescape(window.sessionStorage.getItem('data'))).id
    this.getmaterialById()
    this.getComment()
  },
  methods: {
    async getmaterialById() {
      const { data: res } = await this.$http.post(
        '/api/material/getmaterialById',
        {
          materialId: this.materialId
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.materialInfo = res.data[0]
    },
    /*** 添加评论对话框 - 监听关闭事件 ***/
    addComentFormClose() {
      this.$refs.addComentFormRef.resetFields()
    },
    /*** 添加评论 ***/
    addComment() {
      this.$refs.addComentFormRef.validate(async valid => {
        if (!valid) return
        this.addComentForm.userId = this.userId
        this.addComentForm.materialId = this.materialId
        const { data: res } = await this.$http.post(
          '/api/material/addComment',
          this.addComentForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.addCommentDialogVisible = false
        this.$message.success(res.meta.msg)
        this.getmaterialById()
        this.getComment()
      })
    },
    /*** 获取评论 ***/
    async getComment() {
      const { data: res } = await this.$http.post('/api/material/getComment', {
        materialId: this.materialId
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.commentList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
p{
  color: #606266
}
</style>