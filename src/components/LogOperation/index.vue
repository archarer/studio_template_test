<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select size="small" class="filter-item" v-model="readOptions.OperationTypeID.Value" clearable placeholder="请选择操作方式">
        <el-option v-for="item in logOperationTypeData" :key="item.LogTypeID" :label="item.LogTypeName" :value="item.LogTypeID">
        </el-option>
      </el-select>
      <el-input size="small" style="width: 200px;" class="filter-item" :placeholder="'标题'" v-model="readOptions.Title.Value">
      </el-input>
      <el-input size="small" style="width: 200px;" class="filter-item" :placeholder="'操作数据'" v-model="readOptions.OperationData.Value">
      </el-input>
      <el-button type="primary" class="filter-item" size="small" @click="handleSearch()">查询</el-button>
    </div>
    <el-table :data="tableDataInfo.Data" row-key="LogOperationID" ref="logInfoTable" highlight-current-row @select-all="selectAllRow" border fit style="width: 100%;">
      <el-table-column type="selection" width="35">
      </el-table-column>
      <el-table-column width="100px" label="操作类型">
        <template slot-scope="scope">
          {{getLogTypeName(scope.row.OperationTypeID)}}
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="操作用户">
        <template slot-scope="scope">
          <span>{{scope.row.Account}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="标题">
        <template slot-scope="scope">
          <span>{{scope.row.Title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作内容">
        <template slot-scope="scope">
          <el-popover placement="right-start" trigger="hover">
            <json-viewer :value="JSON.parse(scope.row.OperationData)" :expand-depth=5 copyable boxed sort></json-viewer>
            <br />

            <el-button type="info" slot="reference">详细信息</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="操作时间">
        <template slot-scope="scope">
          <span>{{scope.row.CreateDate}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" v-show="tableDataInfo.RecordCount>tableDataInfo.PageSize">
      <el-pagination background @size-change="pageSizeChange" @current-change="pageIndexChange" :current-page="tableDataInfo.PageIndex+1" :page-sizes="[10,20,30, 50]" :page-size="tableDataInfo.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableDataInfo.RecordCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'logoperation',
  data() {
    return {
      pageDataUrl: window.Global.POWER_API + '/Log/GetLogOperationList',
      logTypeID: '',
      logOperationTypeData: [
        { 'LogType': 'Insert', 'LogTypeID': '1', 'LogTypeName': '新增' },
        { 'LogType': 'Update', 'LogTypeID': '2', 'LogTypeName': '修改' },
        { 'LogType': 'Delete', 'LogTypeID': '3', 'LogTypeName': '删除' },
        { 'LogType': 'Release', 'LogTypeID': '4', 'LogTypeName': '发布' },
        { 'LogType': 'UnRelease', 'LogTypeID': '5', 'LogTypeName': '取消发布' },
        { 'LogType': 'Audit', 'LogTypeID': '6', 'LogTypeName': '审核' },
        { 'LogType': 'UnAudit', 'LogTypeID': '7', 'LogTypeName': '取消审核' },
        { 'LogType': 'Vouch', 'LogTypeID': '8', 'LogTypeName': '激活' },
        { 'LogType': 'UnVouch', 'LogTypeID': '9', 'LogTypeName': '取消激活' },
        { 'LogType': 'Top', 'LogTypeID': '10', 'LogTypeName': '置顶' },
        { 'LogType': 'CancelTop', 'LogTypeID': '11', 'LogTypeName': '取消置顶' },
        { 'LogType': 'MoveRow', 'LogTypeID': '12', 'LogTypeName': '移动' },
        { 'LogType': 'Other', 'LogTypeID': '1000', 'LogTypeName': '其他' }
      ]
    }
  },
  computed: {
    readOptions() {
      return
    }
  },
  created() {
    this.readData()
  },
  methods: {
    initReadOptions() {
      this.readOptions = {
        PageIndex: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 0),
        PageSize: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 5),
        Title: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, ''),
        OperationData: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, ''),
        OperationTypeID: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, this.logTypeID)
      }
    },
    getLogTypeName(operTypeID) {
      var logTypes = this.logOperationTypeData.filter(ele => { return ele.LogTypeID === operTypeID.toString() })
      if (logTypes.length > 0) {
        return logTypes[0].LogTypeName
      }
      return '未知'
    }
  }

}
</script>
<style>
.jv-container .jv-code {
  max-height: 1000px !important;
}
</style>


