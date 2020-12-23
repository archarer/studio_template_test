<template>
<el-dialog title="密码强制更新" :visible="isForce" :show-close="false" :close-on-click-modal="false" width="40%">
 <el-form  :rules="rules" ref="passwordFocusEditForm" :model="passwordInfo" label-position="right" label-width="150px" style='width: 90%; margin-left:10px;'>
        <el-form-item label="请输入新密码" prop="Password">
          <el-input type="password" v-model="passwordInfo.Password" show-password></el-input>
        </el-form-item>
         <el-form-item label="请再次输入密码" prop="PasswordAg" >
          <el-input type="password" v-model="passwordInfo.PasswordAg" show-password></el-input>
        </el-form-item>
  </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="saveInfo()">提交</el-button>
      </div>
</el-dialog>

</template>
<script>
import request from '@/utils/request'
export default {
  name: 'forcePassword',
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordInfo.Password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      input: '',
      passwordInfo: {
        Password: '',
        PasswordAg: ''
      },
      isForce: false,
      rules: {
        Password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        PasswordAg: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    request({
      url: window.Global.POWER_API + '/power/FocusPassword',
      method: 'get'
    }).then(response => {
      if (response.data.ResultCode === '0') {
        this.isForce = true
      }
    })
  },
  methods: {
    saveInfo() {
      this.$refs['passwordFocusEditForm'].validate((valid) => {
        if (valid) {
          request({
            url: window.Global.POWER_API + '/power/FocusChangeUserPw',
            params: {
              password: this.passwordInfo.Password
            },
            method: 'post'
          }).then(response => {
            if (response.data.ResultCode !== '0') {
              this.$message.error(response.data.ResultMessage)
            } else {
              this.$message({
                message: '密码更新成功',
                type: 'success'
              })
              this.isForce = false
            }
          })
        }
      })
    }
  }
}
</script>
