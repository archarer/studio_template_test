<template>
  <div class="app-container">
    <top-menu>
    </top-menu>
    <div class="filter-container">
      <el-select placeholder="请选择" class="filter-item" clearable v-model="readOptions.FileType.Value" size="small">
        <el-option label="文件" value="1"></el-option>
        <el-option label="图片" value="2"></el-option>
        <el-option label="flash" value="3"></el-option>
        <el-option label="mid" value="4"></el-option>
      </el-select>
      <el-input size="small" style="width: 200px;" class="filter-item" :placeholder="'文件名'" v-model="readOptions.FileTitle.Value">
      </el-input>
    </div>
    <el-table :data="tableDataInfo.Data" row-key="FileHistoryID" ref="DataTable" highlight-current-row @select-all="selectAllRow" @sort-change="handleSort" @row-contextmenu="rowContextmenu" border fit style="width: 100%;">
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column align="center" label="文件类型" width="100px">
        <template slot-scope="scope">
          <span>{{getFileTypeName(scope.row.FileType)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文件名" width="350px">
        <template slot-scope="scope">
          <span>{{scope.row.FileTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片地址">
        <template slot-scope="scope">
          <el-tag @click.native="handleClick(scope.row.FileUrl,$event)" style="cursor: pointer;">{{scope.row.FileUrl}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文件地址" width="200px">
        <template slot-scope="scope">
          <image-preview :imageUrl="scope.row.FileUrl" v-if="scope.row.FileType==2"></image-preview>
          <a :href="scope.row.FileUrl" v-else target="_blank"> <i class="fa fa-file" aria-hidden="true"></i></a>
        </template>
      </el-table-column>
      <el-table-column width="170px" align="center" label="创建时间">
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
    <air-contex-menu>
    </air-contex-menu>
  </div>
</template>

<script>
import clip from '@/utils/clipboard'
import clipboard from '@/directive/clipboard/index.js'
import imagePreview from '@/components/ImagePreview'
export default {
  components: {
    imagePreview,
    clipboard
  },
  data() {
    return {
      fileType: '',
      pageDataUrl: window.Global.POWER_API + '/File/GetHistoryList',
      saveUrl: window.Global.POWER_API + '/File/SaveHistory',
      deleteUrl: window.Global.POWER_API + '/File/DeleteHistory',
      tableKeyName: 'FileHistoryID'
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
        FileType: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.String, this.fileType),
        FileTitle: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, ''),
        Start_CreateDate: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.Date, ''),
        End_CreateDate: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.Date, '')
      }
    },
    getFileTypeName(fileType) {
      switch (fileType) {
        case 1:
          return '文件'
        case 2:
          return '图片'
        case 3:
          return 'flash'
        case 4:
          return 'mid'
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
    },
    handleClick(file, event) {
      clip(file, event)
    }
  }
}
</script>
