<template>
  <div class="app-container">
    <top-menu :menus="topMenuList">
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
      <el-table-column width="150px" label="账号">
        <template slot-scope="scope">
          <span class="link-type" @click="handleEdit(scope.row)">{{scope.row.Account}}</span>
          <el-tag v-if="scope.row.IsSuper === 1">超管</el-tag>
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
      <el-table-column class-name="status-col" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.IsLock | statusFilter">{{scope.row.IsLock==1?"锁定":"正常"}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" v-show="device === 'mobile'" v-if="contentMenuList.length>0" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-for="item in contentMenuList" size="small" :key="item.name" class="filter-item" :type="item.color" v-show="contentMenuFilter(scope.row,item.showCondition)" :icon="'fa fa-'+item.icon" @click="handleContentMenuCommand(scope.row, item.commandName, item.commandParms)">{{item.name}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :hide-on-single-page="false" background @size-change="pageSizeChange" @current-change="pageIndexChange" :current-page="tableDataInfo.PageIndex+1" :page-sizes="[10,20,30, 50]" :page-size="tableDataInfo.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableDataInfo.RecordCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import imagePreview from '@/components/ImagePreview'
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
  name: 'selectUser',
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
      tableKeyName: 'UserID',
      roleData: [],
      contentHiddenMenus: ['stickUserPower'],
      contentMenuList: [
        {
          name: '选择',
          title: '选择',
          icon: 'fa fa-hand-o-up',
          commandName: 'select',
          color: 'info',
          showCondition: '',
          commandParms: ''
        }
      ],
      topMenuList: [
        {
          name: '查询',
          title: '查询',
          icon: 'fa fa-search',
          commandName: 'search',
          color: 'primary',
          showCondition: '',
          commandParms: ''
        }
      ],
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
        UserRoleIdStr: ''
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
    this.readData()
  },
  methods: {
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
    handleTopMenuCommand(commandName, commandParms) {
      switch (commandName) {
        case 'search':
          this.handleSearch()
          break
      }
    },
    handleContentMenuCommand(row, commandName, commandParms) {
      switch (commandName) {
        case 'select':
          this.handleTriggerParentEvent('handleSelectUser', row)
          break
      }
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

