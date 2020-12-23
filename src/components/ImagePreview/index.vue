<template>
<div class="div_preview">
  <img class="image_preview" @click="showImageUrl=imageUrl;showImageVisible=true" :width="width" v-if="imageUrl!==''" :src="imageUrl">
 <img class="image_preview" v-else v-for="item in imageUrls" :key="item" :src="item" :width="width" @click="showImageUrl=item;showImageVisible=true">
  <el-dialog :append-to-body="true"  :visible.sync="showImageVisible" width="40%">
    <img :src="showImageUrl" width="95%" />
  </el-dialog>
</div>
 
</template>


<script>
export default {
  name: 'imagePreview',
  props: {
    imageUrls: {
      type: Array,
      default() {
        return []
      }
    },
    imageUrl: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default() {
        return '60'
      }
    }
  },
  data() {
    return {
      showImageVisible: false,
      showImageUrl: ''
    }
  }
}
</script>

<style scoped>
.div_preview {display:inline-block;}
.image_preview{cursor: pointer;border: 1px dashed #d9d9d9;vertical-align: middle;}
</style>
