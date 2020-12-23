<template>
<div class="dashboard-editor-container">
  <el-row class="panel-group" :gutter="40" style="padding:100px;" >
    <el-col :xs="12" :sm="12" :lg="8" :span="100" class="card-panel-col" v-for="(item,index) in productData" :key="index">
      <div class='card-panel' :class="{'currProduct':item.ProductID===productID}" v-if="item.Title==='平台管理'||(item.PowerUrl===''&&item.ManageUrl!=='')||(item.PowerUrl!==''&&item.ManageUrl==='')">
        <a :href="getTargetUrl(item)" target="_blank">
        <div class="card-panel-icon-wrapper icon-people">
           <img src="../../../images/default.png" v-if="item.Title==='平台管理'">
           <img :src="item.ImageUrl" v-else>
        </div>
         <div class="card-panel-title">平台管理
        </div>
        <div class="card-panel-description">基础站点
        </div>
        </a>
      </div>
      <div class='card-panel' @mouseenter="item.ShowPop = true" @mouseleave="item.ShowPop = false" :class="{'currProduct':item.ProductID===productID}" v-else>
        <div class="card-panel-icon-wrapper icon-people">
          <img src="../../../images/default.png" v-if="item.ImageUrl===''">
           <img :src="item.ImageUrl" v-else>
        </div>
        <div class="card-panel-title">{{productID>0?item.Title:item.SubTitle}}
        </div>
        <div class="card-panel-description">{{item.Summary}}
        </div>
          <transition name="el-zoom-in-bottom" v-if="item.Title!=='平台管理'" >
           <div class="card-panel-pop "  v-show="item.ShowPop">
           <div class="card-panel-pop-button card-panel-pop-button-left">
              <el-button type="primary" size="larger" style="vertical-align: middle; "  v-if="item.ProductID!==productID"><a :href="item.PowerUrl" :target="item.IsBrank==1?'_blank':'_self'" >系统管理</a></el-button>
              <br/>
              <el-button type="warning" size="larger" style="vertical-align: middle;"><a :href="item.ManageUrl" :target="item.IsBrank==1?'_blank':'_self'" >业务管理</a></el-button>
            </div>
            <div class="card-panel-pop-button card-panel-pop-button-right">
              <el-button type="danger" size="larger" style="vertical-align: middle; "  v-if="item.HasUserManage" @click="dialogRoleInfoVisible=true;selectProductID=item.ProductID">角色管理</el-button>
               <br/><el-button type="success" size="larger" style="vertical-align: middle;" v-if="item.HasRoleManage" @click="dialogUserInfoVisible=true;selectProductID=item.ProductID">用户管理</el-button>
            </div>
           </div>
         </transition>
      </div>
    </el-col>
  </el-row>
  <el-dialog title="用户管理" :visible.sync="dialogUserInfoVisible" width="70%">
      <user :productID="selectProductID"></user>
  </el-dialog>

  <el-dialog title="角色管理" :visible.sync="dialogRoleInfoVisible" width="70%">
       <role :productID="selectProductID"></role>
  </el-dialog>
 
  </div>
</template>
<script>
import candle from '@/components/Css3-Animation/candle.vue'
import user from './user.vue'
import role from './role.vue'
import request from '@/utils/request'
export default {
  name: 'dashboard-admin',
  components: {
    candle,
    user,
    role
  },
  data() {
    return {
      productData: [],
      productID: window.Global.PRODUCTID,
      dialogUserInfoVisible: false,
      dialogRoleInfoVisible: false,
      selectProductID: 0
    }
  },
  created() {
    this.readProductData()
  },
  methods: {
    getTargetUrl(item) {
      if (item.Title === '平台管理') {
        return window.Global.BASEPOWER_URL
      } else if (item.PowerUrl !== '') {
        return item.PowerUrl
      } else if (item.ManageUrl !== '') {
        return item.ManageUrl
      }
    },
    readProductData() {
      request({
        url: window.Global.POWER_API + '/Power/GetUserProductList',
        method: 'get'
      }).then(response => {
        if (response.data.ResultCode === '0') {
          this.productData = response.data.Data
          this.productData.forEach(ele => {
            this.$set(ele, 'ShowPop', false)
          })
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .currProduct{
      background-color: #dcffff !important;
    }
    
  .card-panel {
  
    border: 2px solid;
    box-shadow: 4px 4px 40px rgba(0,0,0,.05);
    border-color: rgba(0,0,0,.05);
    background-color: #f0f2f5;
    height: 230px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-device {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-device {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper { 
      padding: 13px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      text-align: center;
    }
    .card-panel-icon-wrapper img{
      width:75px;
      height:75px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      margin-top: 20px;
      overflow: hidden;
    height: 50px;
      font-size: 15px;
      font-weight: bold;
      margin-left: 20px;
      color:#979595;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
    .card-panel-title{
       font-size: 25px;
      font-weight: bold;
      text-align: center;
    }
    .card-panel-pop{
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 100%;
      background-color: #69cab9;
    opacity: 0.9;
    }
    .hide{
      display: none;
    }
    .card-panel-pop-button{
       
          margin-top: 70px;
    }
    .card-panel-pop-button-left{
      float:left;
    }
     .card-panel-pop-button-right{
      float:right;
    }
    .card-panel-pop-button-left button,.card-panel-pop-button-right button{
     margin-bottom: 5px; 
    }
  }
}
</style>

