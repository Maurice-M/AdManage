<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>素材管理</el-breadcrumb-item>
      <el-breadcrumb-item>素材分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="16">
        <el-col :span="6">
          <el-input v-model="className" placeholder="请输入需要添加的分类"></el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="success" @click="addClassification()">添加素材分类</el-button>
        </el-col>
      </el-row>
      <el-table :data="classificationList" border>
        <el-table-column label="ID" prop="id" width="60px"></el-table-column>
        <el-table-column label="类目" prop="className"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      className: '',
      classificationList: []
    }
  },
  created() {
    this.getClassification()
  },
  methods: {
    async addClassification() {
      if (this.className === '') {
        return this.$message.error('请输入需要添加的素材分类')
      }
      const { data: res } = await this.$http.post(
        '/api/material/addClassification',
        {
          className: this.className
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.className = ''
    },
    async getClassification() {
      const { data: res } = await this.$http.get(
        '/api/material/getClassification'
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.classificationList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>