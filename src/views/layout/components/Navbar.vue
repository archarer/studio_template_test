<template>
  <el-menu class="navbar" mode="horizontal">
    <div class="left-menu"> <logo :isActive="sidebar.opened&&device!=='mobile'"></logo></div>
    <div class="right-menu">
       <!-- <i class="fa fa-pencil-square-o logMenu" v-if="isLogOperation" @click="handleShowLogOperation()"></i> -->
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" v-if="userInfo.Avatar!==''" :src="userInfo.Avatar">
          <img class="user-avatar" v-else src="../../../images/default.gif">
          <i class="el-icon-caret-bottom" style="color:#ffffff;"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="handleUpdateUserInfo" style="display:block;">用户信息</span>
          </el-dropdown-item>
           <el-dropdown-item divided>
            <span @click="handleChangePw" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog  title="用户信息" :visible.sync="dialogUserEditVisible" :append-to-body="true" width="600px">
      <el-form  :rules="rules" ref="userInfoEditForm" :model="userInfo" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="昵称" prop="NickName">
          <el-input v-model="userInfo.NickName"></el-input>
        </el-form-item>
         <el-form-item label="手机号码" >
          <el-input v-model="userInfo.Phone"></el-input>
        </el-form-item>
         <el-form-item label="邮箱">
          <el-input v-model="userInfo.Email"></el-input>
        </el-form-item>
         <el-form-item label="个性说明">
          <el-input v-model="userInfo.PersonalitySignature" type="textarea"  rows="3"></el-input>
        </el-form-item>
         <el-form-item label="头像">
          <el-upload-branch
            class="avatar-uploader"
            resourceCode="BaseResources"
            restrictCode="Pic"
            v-model="userInfo.Avatar"
            uploadType="img"
            :show-file-list="false">
          </el-upload-branch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserEditVisible = false">取消</el-button>
        <el-button  type="primary" @click="saveInfo()">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog  title="修改密码" :visible.sync="dialogPdEditVisible"   :append-to-body="true" width="600px">
      <el-form  :rules="rules" ref="pdEditForm" label-position="left" :model="userInfo" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="旧密码" prop="Password">
          <el-input type="password" v-model="userInfo.Password"></el-input>
        </el-form-item>
         <el-form-item label="新密码" prop="NewPassword">
          <el-input type="password" v-model="userInfo.NewPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="NewPasswordAg">
          <el-input type="password" v-model="userInfo.NewPasswordAg"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPdEditVisible = false">取消</el-button>
        <el-button  type="primary" @click="changeUserPw()">提交</el-button>
      </div>
    </el-dialog>
     <div v-if="isLogOperate">
       <el-dialog  title="操作日志" :visible.sync="dialogLogOperationVisible"  :append-to-body="true">
        <log-operation ref="logOperate" ></log-operation>
        </el-dialog>
      </div>
  </el-menu>

</template>

<script>
import { mapGetters } from 'vuex'
import ErrorLog from '@/components/ErrorLog'
import LogOperation from '@/components/LogOperation'
import ThemePicker from '@/components/ThemePicker'
import Logo from '@/components/Logo'
import request from '@/utils/request'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
export default {
  components: {
    ErrorLog,
    ThemePicker,
    Logo,
    LogOperation
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'topmodule',
      'permission_routergroup',
      'device',
      'isLogOperation',
      'title'
    ])
  },
  mounted() {
    new Swiper('.swiper-container', {
      slidesPerView: 'auto'
    })
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userInfo.NewPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogUserEditVisible: false,
      dialogPdEditVisible: false,
      dialogLogOperationVisible: false,
      productID: window.Global.PRODUCTID,
      userInfo: {
        Avatar: '',
        NickName: '',
        Phone: '',
        Email: '',
        PersonalitySignature: '',
        Password: '',
        NewPassword: '',
        NewPasswordAg: ''
      },
      rules: {
        NickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        Password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        NewPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        NewPasswordAg: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.readData()
    this.$store.dispatch('toggleModule', '03E5D2A0-DB59-47F6-8F10-1ACDEFE9BDDD')
    document.title = this.title
    console.info(this.productID)
  },
  methods: {
    targetPlatform() {
      window.open('http://www.baidu.com')
    },
    readData() {
      request({
        url: window.Global.POWER_API + '/power/GetUserInfo',
        method: 'get'
      }).then(response => {
        this.userInfo.Avatar = response.data.Data.Avatar
        this.userInfo.NickName = response.data.Data.NickName
        this.userInfo.Phone = response.data.Data.Phone
        this.userInfo.Email = response.data.Data.Email
        this.userInfo.PersonalitySignature = response.data.Data.PersonalitySignature
      })
    },
    saveInfo() {
      this.$refs['userInfoEditForm'].validate((valid) => {
        if (valid) {
          const postData = this.$qs.stringify(this.userInfo)
          request({
            url: window.Global.POWER_API + '/Power/SaveCurrUser',
            method: 'post',
            data: postData
          }).then(response => {
            if (response.data.ResultCode !== '0') {
              this.$message.error(response.data.ResultMessage)
            } else {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.dialogUserEditVisible = false
            }
          })
        }
      })
    },
    changeUserPw() {
      this.$refs['pdEditForm'].validate((valid) => {
        if (valid) {
          const postData = this.$qs.stringify(this.userInfo)
          request({
            url: window.Global.POWER_API + '/power/ChangeCurrUserPw',
            method: 'post',
            data: postData
          }).then(response => {
            if (response.data.ResultCode !== '0') {
              this.$message.error(response.data.ResultMessage)
            } else {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.dialogUserEditVisible = false
              this.logout()
            }
          })
        }
      })
    },
    handleChangePw() {
      this.dialogPdEditVisible = true
    },
    handleShowLogOperation() {
      this.dialogLogOperationVisible = true
      this.$refs.logOperate.handleSearch()
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()
      })
    },
    selectModule(item) {
      this.$store.dispatch('toggleModule', '03E5D2A0-DB59-47F6-8F10-1ACDEFE9BDDD')
      if (!this.sidebar.opened) {
        this.toggleSideBar()
      }
    },
    handleUpdateUserInfo() {
      this.dialogUserEditVisible = true
    },
    handleAvatarSuccess(res, file) {
      if (res.ResultCode !== '0') {
        this.$message.error(res.data.ResultMessage)
      } else {
        this.userInfo.Avatar = res.Data
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    }
  }
}
</script>
<style>
   .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>

.navbar {
  color:#fff;
  height: 55px;
  line-height: 55px;
  border-radius: 0px !important;
  position:fixed;
  z-index: 50;
  border-bottom: 3px solid #69cab9 !important;
  box-shadow: 1px 2px 2px #00000036;
  background-color: #304156;
  top:0;
  width: 100%;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
 .top-menumobile{
   width: 180px;
  }
  .top-menudeskto{
    width: 900px;
  }
 
.top-menu{
  max-width: 500px;
}
  .top-menu,.left-menu{
    float: left;
  }
  .top-menu .el-menu-item{float: left;height: 52px;width:125px;}
  .top-menu .el-menu-item,.top-menu .fa{
   color: rgb(191, 203, 217);
  }
  .top-menu .mobile .el-menu-item{width:50px;}
  .top-menu .mobile .el-menu-item .topmenu-title{display:none}
  .top-menu .el-menu-item:hover{
    background-color: #69cab9;
    color: #fff;
    .fa
    {

    color: #fff;
    }
   }
   .top-menu .is-topactive{
    background-color: #69cab9;
    color: #fff;
    .fa
    {

    color: #fff;
    }
   }

  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.logMenu{
  cursor: pointer;
    font-size: 40px;
    margin-right: 10px;
    }
</style>
