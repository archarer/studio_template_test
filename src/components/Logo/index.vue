<template>
  <div class="index-logo">
    <a 
      href="/"   
      :class="isActive?'logo':'minlogo'" 
      :style="{backgroundImage: 'url(' + (isActive?(banner_logo ? banner_logo : logo):miniLogo) + ')'}"
    ></a>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
  name: 'logo',
  props: {
    isActive: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      logo: '/static/img/innerLogo.png',
      miniLogo: '/static/img/innerMiniLogo.png',
    }
  },
  computed: {
    ...mapGetters([
      'banner_logo'
    ])
  }
}
</script>

<style scoped>
.index-logo{height: 55px;}
.index-logo a
{

 height: 56px;
 background-repeat: no-repeat;
 display: inline-block;
}

.index-logo .logo {
 width: 180px;
 /* background-image: url("../../images/logo.png"); */
 background-size: cover;

}

.index-logo .minlogo {
  width: 50px;
  background-image: url("../../images/logo-min.png");


}
</style>
