<template>
  <div class="app-container">
    <top-menu>
    </top-menu>
    <el-table :data="tableDataInfo.Data" row-key="WaterImageID" ref="DataTable" highlight-current-row @select-all="selectAllRow" @sort-change="handleSort" @row-contextmenu="rowContextmenu" border fit style="width: 100%;">
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column align="center" label="水印名称">
        <template slot-scope="scope">
          <span>{{scope.row.WaterName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="水印地址">
        <template slot-scope="scope">
          <img :src="scope.row.WaterImagePath" width="60" />
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
        <el-form-item label="水印图片" prop="WaterName">
          <el-upload-branch class="avatar-uploader" resourceCode="BaseResources" restrictCode="Pic" v-model="rowData.WaterImagePath" uploadType="img" :show-file-list="false">
          </el-upload-branch>
        </el-form-item>
        <el-form-item label="水印名称" prop="WaterName">
          <el-input v-model="rowData.WaterName"></el-input>
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
      pageDataUrl: window.Global.POWER_API + '/File/GetWaterImageList',
      saveUrl: window.Global.POWER_API + '/File/SaveWaterImage',
      deleteUrl: window.Global.POWER_API + '/File/DeleteWaterImage',
      tableKeyName: 'WaterImageID',
      rules: {
        WaterImagePath: [
          { required: true, message: '水印地址不能为空' },
          { type: 'url', message: '水印地址必须为链接' }
        ],
        WaterName: [
          { required: true, message: '水印名称不能为空' },
          { type: 'string', message: '水印名称必须为数字值' }
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
        PageSize: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 10)
      }
    },
    setRowData() {
      this.rowData = {
        WaterImageID: '',
        WaterImagePath: '',
        WaterName: ''
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