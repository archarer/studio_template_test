<template>
  <div class="app-container">
    <top-menu>
    </top-menu>
    <div class="filter-container">
      <el-input size="small" style="width: 200px;" class="filter-item" :placeholder="'账号'" v-model="readOptions.Account.Value">
      </el-input>
      <el-input size="small" style="width: 200px;" class="filter-item" :placeholder="'昵称'" v-model="readOptions.NickName.Value">
      </el-input>
    </div>
    <el-table :data="tableDataInfo.Data" row-key="UserID" ref="DataTable" highlight-current-row @sort-change="handleSort" @select-all="selectAllRow" @row-contextmenu="rowContextmenu" border fit style="width: 100%;">
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column min-width="150px" label="账号">
        <template slot-scope="scope">
          <span class="link-type" @click="handleEdit(scope.row)">{{scope.row.Account}}</span>
          <el-tag v-if="scope.row.IsSuper === 1">超管</el-tag>
          <el-tag type="warning" v-if="scope.row.IsCopyPower==1">已选中复制</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.UserName}} </span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{scope.row.NickName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{scope.row.Phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="头像">
        <template slot-scope="scope">
          <image-preview :imageUrl="scope.row.Avatar"></image-preview>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.IsLock | statusFilter">{{scope.row.IsLock==1?"锁定":"正常"}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="登录失败次数">
        <template slot-scope="scope">
          <span>{{scope.row.FaildLoginCount}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" sortable="custom" prop="LoginDate" label="登录时间">
        <template slot-scope="scope">
          <span>{{scope.row.LoginDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="直属上级">
        <template slot-scope="scope">
          <span>{{scope.row.ChiefUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="归属平台" v-if="productID===0">
        <template slot-scope="scope">
          <span>{{getProductNames(scope.row.UserProductIds)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" v-show="device === 'mobile'" v-if="device === 'mobile'&&contentMenuList.length>0" width="330" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-for="item in contentMenuList" size="small" :key="item.name" class="filter-item" :type="item.color" v-show="contentMenuFilter(scope.row,item.showCondition)" :icon="'fa fa-'+item.icon" @click="handleContentMenuCommand(scope.row, item.commandName, item.commandParms)">{{item.name}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :hide-on-single-page="false" background @size-change="pageSizeChange" @current-change="pageIndexChange" :current-page="tableDataInfo.PageIndex+1" :page-sizes="[10,20,30, 50]" :page-size="tableDataInfo.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableDataInfo.RecordCount">
      </el-pagination>
    </div>
    <el-dialog :title="dialogEditTitle" :visible.sync="dialogEditVisible">
      <el-container>
        <el-aside width="400px">
          <el-form :rules="rules" ref="editForm" :model="rowData" label-width="70px" style='width: 300px; margin-left:50px;'>
            <el-form-item label="账号" prop="Account">
              <el-input v-model="rowData.Account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="Password">
              <el-input v-show='rowData.ChangePw' v-model="rowData.Password"></el-input>
              <el-switch v-model="rowData.ChangePw" :active-value="true" :inactive-value="false"></el-switch>
              <el-tag v-if='rowData.UserID==""'>默认7777777</el-tag>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="rowData.UserName"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="rowData.NickName"></el-input>
            </el-form-item>
            <el-form-item label="工号">
              <el-input v-model="rowData.JobNo"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="rowData.Phone"></el-input>
            </el-form-item>
            <el-form-item label="头像">
              <el-upload-branch class="avatar-uploader" resourceCode="BaseResources" restrictCode="Pic" v-model="rowData.Avatar" uploadType="img" :show-file-list="false">
              </el-upload-branch>
            </el-form-item>
          </el-form>
        </el-aside>
        <el-main style="padding-top:0;">
          <el-card class="box-card" v-show="roleData.length>0">
            <div slot="header" class="clearfix">
              <span><b>角色</b></span>
            </div>
            <div>
              <el-checkbox-group v-model="rowData.UserRoleIds" @change="handleCheckedRoleChange">
                <el-checkbox v-for="role in roleData" :label="role.RoleID" :key="role.RoleID">{{role.RoleName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-card>
          <el-card class="box-card" style="margin-bottom: 10px;">
            <div slot="header" class="clearfix">
              <span><b>产品</b></span>
            </div>
            <div>
              <el-checkbox-group v-model="rowData.UserProductIds" @change="handleCheckedProductChange">
                <el-checkbox v-for="product in productData" :label="product.ProductID" :key="product.ProductID">{{product.ProductName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-card>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideEditDialog()">取消</el-button>
        <el-button type="primary" @click="saveInfo()" :loading="saveLoading">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="已存在当前账户，是否确认该用户信息" :visible.sync="dialogBaseUserInfoVisible" width="30%" :close-on-click-modal="false">
      <el-container>
        <el-main class="viewInfo">
          <el-row :gutter="24">
            <el-col :xs="8" :sm="8" :lg="6" class="viewTitle">工号:</el-col>
            <el-col :xs="16" :sm="16" :lg="18" class="viewContent">{{baseUserInfo.JobNo}} </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :xs="8" :sm="8" :lg="6" class="viewTitle">账号:</el-col>
            <el-col :xs="16" :sm="16" :lg="18" class="viewContent">{{baseUserInfo.Account}} </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :xs="8" :sm="8" :lg="6" class="viewTitle">昵称:</el-col>
            <el-col :xs="16" :sm="16" :lg="18" class="viewContent">{{baseUserInfo.NickName}} </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :xs="8" :sm="8" :lg="6" class="viewTitle">用户名:</el-col>
            <el-col :xs="16" :sm="16" :lg="18" class="viewContent">{{baseUserInfo.UserName}} </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :xs="8" :sm="8" :lg="6" class="viewTitle">手机号:</el-col>
            <el-col :xs="16" :sm="16" :lg="18" class="viewContent">{{baseUserInfo.Phone}} </el-col>
          </el-row>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBaseUserInfoVisible=false">取消</el-button>
        <el-button type="primary" @click="saveUserInfo()" :loading="saveUserLoading">确认保存</el-button>
      </div>
    </el-dialog>
    <air-contex-menu>
    </air-contex-menu>
  </div>
</template>

<script>
import imagePreview from '@/components/ImagePreview'
import request from '@/utils/request'
export default {
  filters: {
    statusFilter(IsLock) {
      const statusMap = {
        0: 'success',
        1: 'warning'
      }
      return statusMap[IsLock]
    }
  },
  name: 'user',
  components: {
    imagePreview
  },
  data() {
    var validatePw = (rule, value, callback) => {
      if (this.rowData.ChangePw) {
        if (!this.rowData.Password || this.rowData.Password === '') {
          return callback(new Error('请输入密码'))
        } else if (this.rowData.Password.length < 6 || this.rowData.Password.length > 20) {
          return callback(new Error('密码长度6~20'))
        }
      }
      return callback()
    }
    return {
      pageDataUrl: window.Global.POWER_API + '/Power/GetUserRoleList',
      saveUrl: window.Global.POWER_API + '/Power/SaveUser',
      deleteUrl: window.Global.POWER_API + '/Power/DeleteUser',
      dialogBaseUserInfoVisible: false,
      saveUserLoading: false,
      copyRoleUser: {},
      baseUserInfo: {},
      productData: [],
      productID: window.Global.PRODUCTID,
      tableKeyName: 'UserID',
      roleData: [],
      contentHiddenMenus: ['stickUserPower'],
      rowData: {
        UserID: '',
        Account: '',
        ChangePw: false,
        Password: '',
        UserName: '',
        NickName: '',
        JobNo: '',
        Avatar: '',
        IsSuper: 0,
        UserRoleIds: [],
        UserProductIds: [],
        UserRoleIdStr: '',
        UserProductIdStr: ''
      },
      rules: {
        Account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        Password: [{ validator: validatePw, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getContentMenu()
    this.readRoleData()
    if (this.productID === 0) {
      this.readProductData()
    }
    this.readData()
  },
  methods: {
    getProductNames(productids) {
      if (productids) {
        var currProductStr = ''
        productids.forEach(cele => {
          var currProduct = this.productData.filter(ele => { return cele === ele.ProductID })
          if (currProduct && currProduct.length > 0) {
            if (currProductStr !== '') {
              currProductStr += '\\'
            }
            currProductStr += currProduct[0].ProductName
          }
        })
        return currProductStr
      }
    },
    saveUserInfo() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.saveUserLoading = true
          const postData = this.$qs.stringify(this.rowData)
          request({
            url: this.saveUrl,
            method: 'post',
            data: postData
          }).then(response => {
            this.saveLoading = false
            if (response.data.ResultCode !== '0') {
              this.$message.error(response.data.ResultMessage)
            } else {
              // if (this.rowData[this.tableKeyName] === '' || this.rowData[this.tableKeyName] === 0) {
              if (this.rowData['Manage_LogType'] == 1) {
                this.rowData[this.tableKeyName] = response.data.Data[this.tableKeyName]
                this.tableDataInfo.Data.unshift(this.rowData)
              } else {
                for (const v of this.tableDataInfo.Data) {
                  if (v[this.tableKeyName] === this.rowData[this.tableKeyName]) {
                    const index = this.tableDataInfo.Data.indexOf(v)
                    this.tableDataInfo.Data.splice(index, 1, this.rowData)
                    break
                  }
                }
              }
              this.hideEditDialog()
              this.dialogBaseUserInfoVisible = false
              this.$message.success('保存成功')
            }
            this.saveUserLoading = false
          })
        }
      })
    },
    saveInfo() {
      this.saveLoading = true
      if (window.Global.PRODUCTID && window.Global.PRODUCTID > 0 && this.rowData.UserID === '') {
        request({
          url: window.Global.POWER_API + '/Power/GetBaseUserInfo',
          method: 'post',
          params: { account: this.rowData.Account }
        }).then(response => {
          if (response.data.ResultCode !== '0') {
            this.saveUserInfo()
          } else {
            this.baseUserInfo = response.data.Data
            this.dialogBaseUserInfoVisible = true
          }
          this.saveLoading = false
        })
      } else {
        this.saveUserInfo()
      }
    },
    toDataInfo(element) {
      this.$set(element, 'IsCopyPower', 0)
    },
    initReadOptions() {
      this.readOptions = {
        PageIndex: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 0),
        PageSize: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 10),
        Account: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, ''),
        UserID: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.String, ''),
        NickName: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, ''),
        LoginDate: this.setQuerySortValue(this.querySortType.Desc)
      }
    },
    setRowData() {
      this.rowData = {
        UserID: '',
        Account: '',
        ChangePw: false,
        Password: '',
        UserName: '',
        NickName: '',
        JobNo: '',
        Avatar: '',
        IsSuper: 0,
        UserRoleIds: [],
        UserProductIds: [],
        UserRoleIdStr: '',
        UserProductIdStr: ''
      }
    },
    handleTopMenuCommand(commandName, commandParms) {
      switch (commandName) {
        case 'create':
          this.dialogEditTitle = '添加账号'
          this.handleCreate()
          break
        case 'search':
          this.handleSearch()
          break
      }
    },
    handleContentMenuCommand(row, commandName, commandParms) {
      switch (commandName) {
        case 'edit':
          this.dialogEditTitle = '修改账号'
          this.handleEdit(row)
          break
        case 'modifyStatus':
          this.handleModifyStatus(row, commandParms)
          break
        case 'delete':
          this.handleDelete(row, 'UserID', row.UserID)
          break
        case 'resetPassword':
          this.handleResetPassword(row)
          break
        case 'resetLoginFailCount':
          this.handleResetLoginFailCount(row)
          break
        case 'recoveryUserPower':
          this.handleRecoveryUserPower(row)
          break
        case 'copyUserPower':
          this.tableDataInfo.Data.forEach(ele => {
            ele.IsCopyPower = 0
          })
          this.copyRoleUser = Object.assign({}, row)
          row.IsCopyPower = 1
          this.contentHiddenMenus = []
          break
        case 'stickUserPower':
          this.stickUserPower(row)
          break
      }
    },
    stickUserPower(row) {
      if (!this.copyRoleUser) {
        this.$message.warning('请复制一个用户')
        return
      }
      request({
        url: window.Global.POWER_API + '/Power/CopyUserRole',
        method: 'get',
        params: { copyUserID: this.copyRoleUser.UserID, userID: row.UserID }
      }).then(response => {
        if (response.data.ResultCode !== '0') {
          this.$message.error(response.data.ResultMessage)
        } else {
          this.contentHiddenMenus = ['stickUserPower']
          row.UserRoleIds = this.copyRoleUser.UserRoleIds
          row.UserRoleIdStr = this.copyRoleUser.UserRoleIdStr
          this.copyRoleUser = {}
          this.tableDataInfo.Data.forEach(ele => {
            ele.IsCopyPower = 0
          })
          this.$message.success('权限复制成功')
        }
      })
    },
    readRoleData() {
      request({
        url: window.Global.POWER_API + '/Power/GetRoleList',
        method: 'get'
      }).then(response => {
        this.roleData = response.data.Data
      })
    },
    readProductData() {
      request({
        url: window.Global.POWER_API + '/Power/GetAllProductList',
        method: 'get'
      }).then(response => {
        this.productData = response.data.Data
      })
    },
    handleCheckedRoleChange(value) {
      this.rowData.UserRoleIdStr = value.toString()
    },
    handleCheckedProductChange(value) {
      this.rowData.UserProductIdStr = value.toString()
      console.info(this.rowData.UserProductIds)
    },
    handleRecoveryUserPower(row) {
      this.writeLogOperationUrl(this.logOperationType.Other, '回收权限', row.UserID)
      request({
        url: window.Global.POWER_API + '/Power/RemoveUserAllRole?' + 'UserID=' + row.UserID + '&' + this.logParms,
        method: 'get'
      }).then(response => {
        if (response.data.ResultCode !== '0') {
          this.$message.error(response.data.ResultMessage)
        } else {
          row.UserRoleIds = []
          row.UserRoleIdStr = ''
          this.$message.success('操作成功')
        }
      })
    },
    handleModifyStatus(row, status) {
      if (status === 1) {
        this.writeLogOperationUrl(this.logOperationType.Other, '锁定用户', row.UserID)
      } else {
        this.writeLogOperationUrl(this.logOperationType.Other, '解锁用户', row.UserID)
      }
      request({
        url: window.Global.POWER_API + '/Power/ModifyUserStatus?' + 'UserID=' + row.UserID + '&IsLock=' + status + '&' + this.logParms,
        method: 'get'
      }).then(response => {
        if (response.data.ResultCode !== '0') {
          this.$message.error(response.data.ResultMessage)
        } else {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          row.IsLock = status
        }
      })
    },
    handleResetLoginFailCount(row) {
      this.writeLogOperationUrl(this.logOperationType.Other, '重置用户登录失败次数', row.UserID)
      request({
        url: window.Global.POWER_API + '/Power/ResetUserFaildLoginCount?' + 'UserID=' + row.UserID + '&' + this.logParms,
        method: 'get'
      }).then(response => {
        if (response.data.ResultCode !== '0') {
          this.$message.error(response.data.ResultMessage)
        } else {
          this.$message.success('操作成功')
          row.FaildLoginCount = 0
        }
      })
    },
    handleResetPassword(row) {
      this.writeLogOperationUrl(this.logOperationType.Other, '锁定重置密码', row.UserID)
      request({
        url: window.Global.POWER_API + '/Power/ResetUserPassword?' + 'UserID=' + row.UserID + '&' + this.logParms,
        method: 'get'
      }).then(response => {
        if (response.data.ResultCode !== '0') {
          this.$message.error(response.data.ResultMessage)
        } else {
          this.$message.success('重置密码成功')
        }
      })
    }
  }
}
</script>

<style>
.mobile .el-dialog {
  width: 90%;
}
.mobile .el-aside {
  width: 350px !important;
}
</style>

