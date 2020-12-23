<template>
  <div class="app-container">
    <top-menu>
    </top-menu>
    <div class="filter-container">
      <el-input size="small" style="width: 200px;" class="filter-item" :placeholder="'文件资源名称'" v-model="readOptions.FileResourceName.Value">
      </el-input>
    </div>
    <el-table :data="tableDataInfo.Data" row-key="FileResourceID" ref="DataTable" highlight-current-row @select-all="selectAllRow" @sort-change="handleSort" @row-contextmenu="rowContextmenu" border fit style="width: 100%;">
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column align="center" label="文件资源名称">
        <template slot-scope="scope">
          <span>{{scope.row.FileResourceName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文件资源代码">
        <template slot-scope="scope">
          <span>{{scope.row.FileResourceCode}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.CreateDate}}</span>
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
        <el-form-item label="文件资源名称" prop="FileResourceName">
          <el-input v-model="rowData.FileResourceName"></el-input>
        </el-form-item>
        <el-form-item label="文件资源代码" prop="FileResourceCode">
          <el-input v-model="rowData.FileResourceCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideEditDialog()">取消</el-button>
        <el-button type="primary" @click="saveInfo()" :loading="saveLoading">提交</el-button>
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
      pageDataUrl: window.Global.POWER_API + '/File/GetResourceList',
      saveUrl: window.Global.POWER_API + '/File/SaveResource',
      deleteUrl: window.Global.POWER_API + '/File/DeleteResource',
      tableKeyName: 'FileResourceID',
      rules: {
        FileResourceName: [
          { required: true, message: '文件资源名称不能为空' },
          { type: 'string', message: '文件资源名称必须为数字值' }
        ],
        FileResourceCode: [
          { required: true, message: '文件资源代码不能为空' },
          { type: 'string', message: '文件资源代码必须为数字值' }
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
        FileResourceName: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, ''),
        CreateDate: this.setQuerySortValue(this.querySortType.Desc)
      }
    },
    setRowData() {
      this.rowData = {
        FileResourceID: '',
        FileResourceName: '',
        FileResourceCode: ''

      }
    },
    handleTopMenuCommand(commandName, commandParms) {
      switch (commandName) {
        case 'search':
          this.handleSearch()
          break
        case 'create':
          this.dialogEditTitle = '添加数据'
          this.handleCreate()
          break
      }
    },
    handleContentMenuCommand(row, commandName, commandParms) {
      switch (commandName) {
        case 'edit':
          this.dialogEditTitle = '修改数据'
          this.handleEdit(row)
          break
        case 'delete':
          this.handleDelete(row)
          break
      }
    }
  }
}
</script>
