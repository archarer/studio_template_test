<template>
  <div class="app-container">
    <top-menu>
    </top-menu>
    <div class="filter-container">
      <el-input size="small" style="width: 200px;" class="filter-item" :placeholder="'资源代码'" v-model="readOptions.ResourceCode.Value">
      </el-input>
      <el-input size="small" style="width: 200px;" class="filter-item" :placeholder="'限制名称'" v-model="readOptions.RestrictName.Value">
      </el-input>
    </div>
    <el-table :data="tableDataInfo.Data" row-key="FileRestrictID" ref="DataTable" highlight-current-row @select-all="selectAllRow" @sort-change="handleSort" @row-contextmenu="rowContextmenu" border fit style="width: 100%;">
      <el-table-column :label="'文件资源代码:'+ResourceCode" header-align="center">
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column width="200px" align="center" label="限制名称">
          <template slot-scope="scope">
            <span>{{scope.row.RestrictName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="限制码">
          <template slot-scope="scope">
            <span>{{scope.row.RestrictCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="文件扩展名">
          <template slot-scope="scope">
            <span>{{scope.row.FileExtension}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="文件大小">
          <template slot-scope="scope">
            <span>{{scope.row.FileMaxSize}}</span>
          </template>
        </el-table-column>
        <el-table-column width="80px" align="center" label="水印">
          <template slot-scope="scope">
            <span :class="{'red':scope.row.IsWaterMark===0}">{{scope.row.IsWaterMark===1?"有":"无"}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="宽高">
          <template slot-scope="scope">
            <span>{{scope.row.ImageWidth}}|{{scope.row.ImageHeight}}</span>
          </template>
        </el-table-column>
        <el-table-column width="250px" align="center" label="存储位置">
          <template slot-scope="scope">
            <span>{{getStoragePathName(scope.row.FileStoragePathID)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="330" v-if="device === 'mobile'&&contentMenuList.length>0" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-for="item in contentMenuList" size="small" :key="item.name" class="filter-item" :type="item.color" v-show="contentMenuFilter(scope.row,item.showCondition)" :icon="'fa fa-'+item.icon" @click="handleContentMenuCommand(scope.row, item.commandName, item.commandParms)">{{item.name}}</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :hide-on-single-page="false" background @size-change="pageSizeChange" @current-change="pageIndexChange" :current-page="tableDataInfo.PageIndex+1" :page-sizes="[10,20,30, 50]" :page-size="tableDataInfo.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableDataInfo.RecordCount">
      </el-pagination>
    </div>
    <el-dialog :title="dialogEditTitle" :visible.sync="dialogEditVisible">
      <el-form :rules="rules" ref="editForm" :model="rowData" label-width="120px" size="small" style='margin-left:50px;'>
        <el-tabs v-model="tabName">
          <el-tab-pane label="基础信息" name="first">
            <el-form-item label="限制名称" prop="RestrictName">
              <el-input v-model="rowData.RestrictName"></el-input>
            </el-form-item>
            <el-form-item label="限制码" prop="RestrictCode">
              <el-input v-model="rowData.RestrictCode"></el-input>
            </el-form-item>
            <el-form-item label="存储路经标识" prop="FileStoragePathID">
              <el-select v-model="rowData.FileStoragePathID" @change="changeFileStoragePath" placeholder="请选择">
                <el-option v-for="item in storagePathData" :key="item.FileStoragePathID" :label="item.StoragePathName" :value="item.FileStoragePathID">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文件访问方式">
              <el-radio-group v-model="rowData.AccessModeCodeType">
                <el-radio :label="0">虚拟访问方式</el-radio>
                <el-radio :label="1">虚拟原文件访问方式</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="目录存储格式">
              <el-radio-group v-model="rowData.PathFormatCodeType">
                <el-radio :label="0">创建日期</el-radio>
                <el-radio :label="1">创建日期加小时</el-radio>
                <el-radio :label="2">唯一标识分组</el-radio>
                <el-radio :label="3">不分组</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传类型">
              <el-radio-group v-model="rowData.FileType">
                <el-radio :label="1">文件</el-radio>
                <el-radio :label="2">图片</el-radio>
                <el-radio :label="3">Flash动画</el-radio>
                <el-radio :label="4">多媒体文件</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="文件扩展名">
              <el-tooltip content="(gif,jpg,bmp,jpeg,png)" placement="top">
                <el-input v-model="rowData.FileExtension"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="文件大小">
              <el-tooltip content="单位(K)0不限制" placement="top">
                <el-input v-model="rowData.FileMaxSize"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="记录文件历史">
              <el-switch v-model="rowData.IsHistory" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="是否返回尺寸">
              <el-switch v-model="rowData.IsReturnSize" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="是否Md5">
              <el-switch v-model="rowData.IsMd5" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="压缩设置" name="second">
            <el-form-item label="图片宽度">
              <el-tooltip content="单位(px)0不限制" placement="top">
                <el-input v-model="rowData.ImageWidth"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="图片高度">
              <el-tooltip content="单位(px)0不限制" placement="top">
                <el-input v-model="rowData.ImageHeight"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="质量压缩">
              <el-tooltip content="0或100不压缩" placement="top">
                <el-input v-model.number="rowData.QualityValue"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="格式化成Jpeg">
              <el-switch v-model="rowData.IsFormatJpeg" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="水印设置">
            <el-form-item label="创建水印" name="thrid">
              <el-switch v-model="rowData.IsWaterMark" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="水印类型">
              <el-radio-group v-model="rowData.WatermarkType">
                <el-radio :label="0">水印图片</el-radio>
                <el-radio :label="1">水印文字</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="水印图标" v-show="rowData.WatermarkType==0">
              <el-select v-model="rowData.WaterImageID" placeholder="请选择">
                <el-option v-for="item in WaterImageData" :key="item.WaterImageID" :label="item.WaterName" :value="item.WaterImageID">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="水印文字" v-show="rowData.WatermarkType==1">
              <el-input v-model="rowData.WatermarkText"></el-input>
            </el-form-item>
            <el-form-item label="水平位置">
              <el-radio-group v-model="rowData.HorizontalAlign">
                <el-radio :label="0">左对齐</el-radio>
                <el-radio :label="1">居中</el-radio>
                <el-radio :label="2">右对齐</el-radio>
                <el-radio :label="3">左右边距对齐</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="垂直位置">
              <el-radio-group v-model="rowData.VerticalAlign">
                <el-radio :label="0">顶部对齐</el-radio>
                <el-radio :label="1">居中对齐</el-radio>
                <el-radio :label="2">底部对齐</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
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
import request from '@/utils/request'
export default {
  data() {
    return {
      pageDataUrl: window.Global.POWER_API + '/File/GetRestrictList',
      saveUrl: window.Global.POWER_API + '/File/SaveRestrict',
      deleteUrl: window.Global.POWER_API + '/File/DeleteRestrict',
      tableKeyName: 'FileRestrictID',
      tabName: 'first',
      ResourceCode: '',
      storagePathData: [],
      WaterImageData: [],
      rules: {
        FileStoragePathID: [
          { required: true, message: '请选择存储路径', trigger: 'change' }
        ],
        RestrictCode: [
          { required: true, message: '限制码不能为空', trigger: 'blur' }
        ],
        RestrictName: [
          { required: true, message: '限制名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getContentMenu()
    this.getResourceInfo()
    this.readData()
    this.readStoragePathData()
    this.readWaterImageData()
  },
  methods: {
    initReadOptions() {
      this.readOptions = {
        PageIndex: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 0),
        PageSize: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 10),
        ResourceCode: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, ''),
        RestrictName: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, '')
      }
    },
    getStoragePathName(id) {
      var currStorage = this.storagePathData.filter(ele => { return ele.FileStoragePathID === id })
      if (currStorage.length > 0) {
        return currStorage[0].StoragePathName
      }
      return ''
    },
    getResourceInfo() {
      request({
        url: window.Global.POWER_API + '/File/GetResourceInfo',
        method: 'get'
      }).then(response => {
        this.ResourceCode = response.data.Data.FileResourceCode
      })
    },
    readStoragePathData() {
      request({
        url: window.Global.POWER_API + '/File/GetStoragePathData',
        method: 'get'
      }).then(response => {
        this.storagePathData = response.data.Data
      })
    },
    readWaterImageData() {
      request({
        url: window.Global.POWER_API + '/File/GetWaterImageData',
        method: 'get'
      }).then(response => {
        this.WaterImageData = response.data.Data
      })
    },
    setRowData() {
      this.rowData = {
        FileRestrictID: '',
        FileStoragePathID: '',
        AccessModeCodeType: 0,
        PathFormatCodeType: 0,
        RestrictName: '',
        RestrictCode: '',
        FileType: 1,
        FileExtension: '',
        FileMaxSize: 0,
        IsReturnSize: 0,
        IsMd5: 0,
        IsHistory: 0,
        IsWaterMark: 0,
        IsFormatJpeg: 0,
        WatermarkText: '',
        HorizontalAlign: 0,
        VerticalAlign: 0,
        ImageWidth: 0,
        ImageHeight: 0,
        QualityValue: 0,
        WatermarkType: 0,
        WaterImageID: ''
      }
    },
    changeFileStoragePath(val, item) {
    },
    handleTopMenuCommand(commandName, commandParms) {
      switch (commandName) {
        case 'search':
          this.handleSearch()
          break
        case 'create':
          this.dialogEditTitle = '添加数据'
          this.tabName = 'first'
          this.handleCreate()
          break
      }
    },
    handleContentMenuCommand(row, commandName, commandParms) {
      switch (commandName) {
        case 'edit':
          this.dialogEditTitle = '修改数据'
          this.tabName = 'first'
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

<style>
.el-dialog__body {
  padding: 0px 20px !important;
}
</style>