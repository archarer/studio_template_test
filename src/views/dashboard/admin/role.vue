<template>
  <div class="app-container">
    <top-menu :menus="topMenuList">
    </top-menu>
    <div class="filter-container">
       <el-input size="small"  style="width: 200px;" class="filter-item" :placeholder="'角色名'" v-model="readOptions.RoleName.Value">
      </el-input>
    </div>

    <el-table  :data="tableDataInfo.Data" row-key="RoleID"  ref="DataTable"  v-loading="listLoading" highlight-current-row   @select-all="selectAllRow"    @row-contextmenu="rowContextmenu" border fit 
      style="width: 100%;"   >
      <el-table-column
      type="selection"
      width="35" >
      </el-table-column>
       <el-table-column min-width="150px" label="角色名">
        <template slot-scope="scope">
          {{scope.row.RoleName}}
        </template>
      </el-table-column>
       <el-table-column width="200px" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.Summary}}</span>
        </template>
      </el-table-column>
        <el-table-column width="200px" align="center" label="修改用户">
        <template slot-scope="scope">
          <span>{{scope.row.ModifyUser}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.ModifyDate}}</span>
        </template>
      </el-table-column>
  
      <el-table-column align="center" label="操作"  v-if="contentMenuList.length>0" width="330" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-for="item in contentMenuList" size="small" :key="item.name" class="filter-item" :type="item.color" v-show="contentMenuFilter(scope.row,item.showCondition)" :icon="'fa fa-'+item.icon" @click="handleContentMenuCommand(scope.row, item.commandName, item.commandParms)">{{item.name}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :hide-on-single-page="false" background @size-change="pageSizeChange" @current-change="pageIndexChange" :current-page="tableDataInfo.PageIndex+1" :page-sizes="[10,20,30, 50]" :page-size="tableDataInfo.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableDataInfo.RecordCount">
      </el-pagination>
    </div>

    <el-dialog :title="dialogEditTitle" :visible.sync="dialogEditVisible" :append-to-body="true">
      <el-container>
        <el-container>
          <el-header height="150px">
            <el-form :rules="rules" ref="editForm" :model="rowData"  label-width="70px" style='margin-left:50px;'>
                  <el-form-item label="角色名" prop="RoleName">
                    <el-input v-model="rowData.RoleName"></el-input>
                  </el-form-item>
                  <el-form-item label="简介" >
                    <el-input v-model="rowData.Summary" type="textarea"  rows="3"></el-input>
                  </el-form-item>
                </el-form>
          </el-header>
          <el-main> 
            <el-checkbox-group v-model="rowData.RoleUserIds" @change="handleCheckedRoleChange">
                <el-checkbox v-for="role in userData" :label="role.UserID" :key="role.RoleID">{{role.UserName===''?role.Account:role.UserName}}</el-checkbox>
            </el-checkbox-group>
          </el-main>
        </el-container>
        <el-aside>
          <el-main >
            <el-tree
              :data="menuData"
              show-checkbox
              node-key="id"
              @check-change="setTreeKey"
              :default-checked-keys="rowData.RoleMenuIds"
              :render-content="renderMenuContent"
              :expand-on-click-node="false"
              ref="menuTree"
              :check-strictly="true"
              v-loading="readMenuLoading"
              highlight-current>
            </el-tree>
          </el-main>
        </el-aside>
      </el-container>

    
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideEditDialog()">取消</el-button>
        <el-button  type="primary" @click="saveInfo()" :loading="saveLoading">提交</el-button>
      </div>
    </el-dialog>

    <air-contex-menu>
    </air-contex-menu>
  </div>
</template>

<script>

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
  name: 'role',
  props: {
    productID: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  watch: {
    productID(val) {
      this.manageProductID = val
      this.init()
    }
  },
  data() {
    return {
      pageDataUrl: window.Global.POWER_API + '/Power/GetRoleUserList',
      saveUrl: window.Global.POWER_API + '/Power/SaveRole',
      deleteUrl: window.Global.POWER_API + '/Power/DeleteRole',
      tableKeyName: 'RoleID',
      userData: [],
      menuData: [],
      readMenuLoading: false,
      isLogOperate: false,
      rowData: {
        RoleID: '',
        RoleName: '',
        Summary: '',
        RoleUserIds: [],
        RoleUserIdStr: '',
        RoleMenuIds: [],
        RoleMenuIdStr: ''
      },
      contentMenuList: [
        {
          name: '修改',
          title: '修改',
          icon: 'fa fa-edit',
          commandName: 'edit',
          color: 'info',
          showCondition: '',
          commandParms: ''
        },
        {
          name: '删除',
          title: '删除',
          icon: 'fa fa-trash-o',
          commandName: 'delete',
          color: 'danger',
          showCondition: '',
          commandParms: ''
        }
      ],
      topMenuList: [
        {
          name: '新增',
          title: '新增',
          icon: 'fa fa-plus-circle',
          commandName: 'create',
          color: 'primary',
          showCondition: '',
          commandParms: ''
        },
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
      rules: {
        RoleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.manageProductID = this.productID
      this.readData()
      this.readUserData()
      this.readMenuData()
    },
    initReadOptions() {
      this.readOptions = {
        PageIndex: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 0),
        PageSize: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 10),
        RoleID: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.String, ''),
        RoleName: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, '')
      }
    },
    setRowData() {
      this.rowData = {
        RoleID: '',
        RoleName: '',
        Summary: '',
        RoleUserIds: [],
        UserRoleIdStr: '',
        RoleMenuIds: [],
        RoleMenuIdStr: ''
      }
    },
    readUserData() {
      request({
        url: window.Global.POWER_API + '/Power/GetUserList',
        method: 'get',
        manageProductID: this.manageProductID
      }).then(response => {
        this.userData = response.data.Data
      })
    },
    readMenuData() {
      this.readMenuLoading = true
      this.menuData = []
      request({
        url: window.Global.POWER_API + '/Power/PowerMenuTree',
        method: 'get',
        manageProductID: this.manageProductID
      }).then(response => {
        var currTreeData = response.data.Data
        for (var i = 0; i < currTreeData.length; i++) {
          var currTreeDataItem = currTreeData[i]
          var currTreeNode = this.toMenuDataInfo(currTreeDataItem)
          this.getChildTreeList(currTreeNode, currTreeDataItem.ChildList, this.toMenuDataInfo)
          this.menuData.push(currTreeNode)
        }
        this.readMenuLoading = false
      })
    },
    setTreeKey(data, check) {
      if (data.parentID && check) {
        var currID = data.parentID
        if (data.id.indexOf('$') > -1 && data.parentID.indexOf('$') === -1) {
          currID = data.parentID + '$' + data.id.split('$')[1]
        } else if (currID.indexOf('$') > -1 && currID.split('$')[1] === '0' || currID.split('$')[1] === '') {
          currID = currID.split('$')[0]
        }

        this.menuData.forEach(ele => {
          if (ele.id === currID) {
            this.$refs.menuTree.setChecked(ele.id, true)
          } else {
            this.searchChildTreeItem(ele.children, currID)
          }
        })
      }
      if (!check) {
        data.children.forEach(element => {
          this.selectAllNode(element, check)
        })
      }
    },
    searchChildTreeItem(childitems, menuid) {
      childitems.forEach(ele => {
        if (ele.id === menuid) {
          if (ele.id.indexOf('$') > -1 && ele.parentID.indexOf('$') === -1) {
            this.$refs.menuTree.setChecked(ele.id, true)
            this.searchChildTreeItem(this.menuData, ele.parentID + '$' + ele.id.split('$')[1])
          } else {
            this.$refs.menuTree.setChecked(ele.id, true)
            var currID = ele.parentID
            if (currID.indexOf('$') > -1 && currID.split('$')[1] === '0' || currID.split('$')[1] === '') {
              currID = currID.split('$')[0]
            }
            this.searchChildTreeItem(this.menuData, currID)
          }
        } else {
          this.searchChildTreeItem(ele.children, menuid)
        }
      })
    },
    handleCheckedRoleChange(value) {
      this.rowData.RoleUserIdStr = value.toString()
    },
    beforeSaveInfo() {
      this.rowData.RoleMenuIds = []
      this.$refs.menuTree.getCheckedNodes(false, true).forEach(element => {
        this.rowData.RoleMenuIds.push(element.id)
      })
      this.rowData.RoleMenuIdStr = this.rowData.RoleMenuIds.toString()
    },
    handleTopMenuCommand(commandName, commandParms) {
      switch (commandName) {
        case 'create':
          this.dialogEditTitle = '添加角色'
          if (this.$refs.menuTree) {
            this.$refs.menuTree.setCheckedKeys([])
          }
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

          this.dialogEditTitle = '修改角色'
          this.handleEdit(row)
          if (this.$refs.menuTree !== undefined) {
            this.$refs.menuTree.setCheckedKeys(row.RoleMenuIds)
          }
          break
        case 'delete':
          this.handleDelete(row)
          break
      }
      this.toggleShow = false
    },
    renderMenuContent(h, { node, data, store }) {
      return (
        <div class='custom-tree-node' >
          <div><i class={'fa fa-' + data.menuIcon}></i> {data.menuName}
            <el-button size='mini' type='text' class={data.children.length > 0 ? '' : 'hide'} on-click={ () => this.selectAllNode(data, true) }>All</el-button>
            <el-button size='mini' type='text' class={data.children.length > 0 ? '' : 'hide'} on-click={ () => this.selectAllNode(data, false) }>Cancel</el-button>
          </div>
        </div>)
    },
    selectAllNode(data, check) {
      this.$refs.menuTree.setChecked(data.id, check)
      data.children.forEach(element => {
        this.selectAllNode(element, check)
      })
    },
    toMenuDataInfo(currData) {
      return {
        id: currData.MenuID,
        menuName: currData.MenuName,
        menuIcon: currData.MenuIcon,
        parentID: currData.ParentID,
        menuType: currData.MenuType.toString(),
        isShow: currData.IsShow,
        apiPath: currData.ApiPath,
        viewPath: currData.ViewPath,
        targetUrl: currData.TargetUrl,
        idPath: currData.IDPath,
        menuNamePath: currData.MenuNamePath,
        children: []
      }
    }
  }
}
</script>

<style>
.mobile .el-dialog{
width: 90%;
}
.mobile .el-form{
  margin-left: 0px !important;
}
.mobile .el-aside{
  width:225px;
}
</style>