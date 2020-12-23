<template>
  <div class="app-container">
    <top-menu>
    </top-menu>

    <el-form v-model="formData" style="padding: 15px;" label-width="120px">
      <el-form-item prop="title" label="标签标题：">
        <el-input v-model="formData.title" class="input-style"></el-input>
      </el-form-item>
      <el-form-item prop="banner_logo" label="头部logo：">
        <el-upload-branch 
          class="img-uploader" 
          resourceCode="BaseResources" 
          restrictCode="Pic" 
          v-model="formData.banner_logo" 
          uploadType="img" 
          :multiple="false" 
          :show-file-list="false"
        >
        </el-upload-branch>
        <div class="tip">图片尺寸为180*56</div>
      </el-form-item>

      <el-form-item prop="login_logo" label="登录页logo：">
        <el-upload-branch 
          class="img-uploader lg" 
          resourceCode="BaseResources" 
          restrictCode="Pic" 
          v-model="formData.login_logo" 
          uploadType="img" 
          :multiple="false" 
          :show-file-list="false"
        >
        </el-upload-branch>
        <div class="tip">图片尺寸为450*72</div>
      </el-form-item>

      <el-form-item prop="login_background" label="登录页背景：">
        <el-upload-branch 
          class="img-uploader bc" 
          resourceCode="BaseResources" 
          restrictCode="Pic" 
          v-model="formData.login_background" 
          uploadType="img" 
          :multiple="false" 
          :show-file-list="false"
        >
        </el-upload-branch>
      </el-form-item>
      
      <div style="text-align: center; margin-top: 25px;"><el-button type="primary" size="mini" @click="handleSaveBaseInfo">保存</el-button></div>
    </el-form>
    
    <air-contex-menu>
    </air-contex-menu>
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
export default {
  
  name: 'baseinfo',
  components: {
  },
  data() {
    return {
      formData: {}
    }
  },
  computed: {
    ...mapGetters([
      'banner_logo',
      'login_background',
      'login_logo',
      'title'
    ])
  },
  created() {
    this.formData = {
      title: this.title,
      banner_logo: this.banner_logo,
      login_background: this.login_background,
      login_logo: this.login_logo
    }
  },
  methods: {
    handleSaveBaseInfo() {
      const {banner_logo, login_background, login_logo, title} = this.formData
      const postData = this.$qs.stringify(this.formData)
      request({
        url: window.Global.POWER_API + "/settings/base",
        method: "post",
        data: postData
      }).then((response) => {
        if(response.data.ResultCode == 0) {
          this.$message.success('保存成功')
          this.$store.dispatch('setBaseInfo', this.formData)
        }
      });
      
    },
   
  }
}
</script>

<style>
.input-style {
  width: 300px;
}
.img-uploader .el-upload {
  position: relative;
}
.img-uploader .avatar-uploader-icon {
  border: 1px dotted #ccc;
  border-radius: 3px;
}

.img-uploader .avatar {
  width: auto;
  height: 56px;
}
.bc .avatar {
  height: 200px;
}
.lg .avatar {
  height: 72px;
}
.tip {
  font-size: .6em; 
  color: #CE8762;
}
</style>

