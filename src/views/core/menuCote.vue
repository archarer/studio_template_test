<template>
  <div class="app-container">
    <top-menu>
    </top-menu>
    <div class="filter-container">
      <el-input size="small" style="width: 200px;" class="filter-item" :placeholder="'栏目名称'" v-model="readOptions.CoteTitle.Value">
      </el-input>
      <el-input size="small" style="width: 200px;" class="filter-item" :placeholder="'栏目表名'" v-model="readOptions.CoteTableName.Value">
      </el-input>
      <el-input size="small" style="width: 200px;" class="filter-item" :placeholder="'链接键值'" v-model="readOptions.ConnectionStringName.Value">
      </el-input>
    </div>
    <el-table :data="tableDataInfo.Data" row-key="MenuCoteID" ref="DataTable" highlight-current-row @select-all="selectAllRow" @row-contextmenu="rowContextmenu" border fit style="width: 100%;">
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column min-width="150px" label="栏目名称">
        <template slot-scope="scope">
          <span class="link-type" @click="handleEdit(scope.row)">{{scope.row.CoteTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="栏目表名">
        <template slot-scope="scope">
          <span>{{scope.row.CoteTableName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="链接字符串">
        <template slot-scope="scope">
          <span>{{scope.row.ConnectionStringName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="字段标识">
        <template slot-scope="scope">
          <span>{{scope.row.IDName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="字段名称">
        <template slot-scope="scope">
          <span>{{scope.row.Name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="330" v-if="device === 'mobile'&&contentMenuList.length>0" class-name="small-padding fixed-width">
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
      <el-form :rules="rules" ref="editForm" :model="rowData" label-width="120px" style='width:500px;margin-left:50px;'>
        <el-form-item label="栏目名称" prop="CoteTitle">
          <el-input v-model="rowData.CoteTitle"></el-input>
        </el-form-item>
        <el-form-item label="栏目表名" prop="CoteTableName">
          <el-input v-model="rowData.CoteTableName"></el-input>
        </el-form-item>
        <el-form-item label="主键名" prop="IDName">
          <el-input v-model="rowData.IDName"></el-input>
        </el-form-item>
        <el-form-item label="字段名称" prop="Name">
          <el-input v-model="rowData.Name"></el-input>
        </el-form-item>
        <el-form-item label="链接字符串" prop="ConnectionStringName">
          <el-input v-model="rowData.ConnectionStringName"></el-input>
        </el-form-item>
        <el-form-item label="条件" prop="Condtion">
          <el-input v-model="rowData.Condtion"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="SortExpression">
          <el-input v-model="rowData.SortExpression"></el-input>
        </el-form-item>
        <el-form-item label="ID类型" prop="IDDataType">
          <el-radio-group v-model="rowData.IDDataType">
            <el-radio label="1">整型</el-radio>
            <el-radio label="2">字符串</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="父节点字段名" prop="ParentIDName">
          <el-input v-model="rowData.ParentIDName"></el-input>
        </el-form-item>
        <el-form-item label="ID路经名称" prop="IDPathName">
          <el-input v-model="rowData.IDPathName"></el-input>
        </el-form-item>
        <el-form-item label="根节点ID值" prop="RootIDValue">
          <el-input v-model="rowData.RootIDValue"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideEditDialog()">取消</el-button>
        <el-button type="primary" @click="saveInfo()">提交</el-button>
      </div>
    </el-dialog>
    <air-contex-menu>
    </air-contex-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageDataUrl: window.Global.POWER_API + '/Power/GetMenuCoteList',
      saveUrl: window.Global.POWER_API + '/Power/SaveMenuCote',
      deleteUrl: window.Global.POWER_API + '/Power/DeleteMenuCote',
      tableKeyName: 'MenuCoteID',
      rowData: {
        MenuCoteID: '',
        CoteTitle: '',
        CoteTableName: '',
        IDName: '',
        Name: '',
        ParentIDName: '',
        IDPathName: '',
        ConnectionStringName: '',
        RootIDValue: '',
        IDDataType: '0',
        IsParentUrl: '0',
        SortExpression: '',
        Condtion: ''
      },
      rules: {
        CoteTitle: [
          { required: true, message: '栏目名称', trigger: 'blur' }
        ],
        CoteTableName: [
          { required: true, message: '栏目表名', trigger: 'blur' }
        ],
        IDName: [
          { required: true, message: '主键名', trigger: 'blur' }
        ],
        Name: [
          { required: true, message: '字段名称', trigger: 'blur' }
        ],
        ConnectionStringName: [
          { required: true, message: '链接字符串', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getContentMenu()
    this.readData()
  },
  methods: {
    initReadOptions() {
      this.readOptions = {
        PageIndex: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 0),
        PageSize: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 10),
        CoteTitle: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, ''),
        CoteTableName: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, ''),
        ConnectionStringName: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, '')
      }
    },
    setRowData() {
      this.rowData = {
        MenuCoteID: '',
        CoteTitle: '',
        CoteTableName: '',
        IDName: '',
        Name: '',
        ParentIDName: '',
        IDPathName: '',
        ConnectionStringName: '',
        RootIDValue: '',
        IDDataType: '0',
        IsParentUrl: '0',
        SortExpression: '',
        Condtion: ''
      }
    },
    afterReadData() {
      this.tableDataInfo.Data.forEach(element => {
        element.IDDataType = element.IDDataType.toString()
      })
      this.$emit('listenChildEvent', false)
    },
    handleTopMenuCommand(commandName, commandParms) {
      switch (commandName) {
        case 'create':
          this.dialogEditTitle = '添加栏目数据'
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
          this.dialogEditTitle = '修改栏目数据'
          this.handleEdit(row)
          break
        case 'delete':
          this.handleDelete(row)
          break
      }
      this.toggleShow = false
    }
  }
}
</script>

</style>
<style>
.mobile .el-dialog {
  width: 90%;
}
.mobile .el-form {
  margin-left: 0px !important;
}
.mobile .el-aside {
  width: 225px;
}
</style>