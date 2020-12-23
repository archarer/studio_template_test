<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import adminDashboard from './admin'
import store from '@/store'
export default {
  name: 'dashboard',
  components: { adminDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      isLogOperate: false
    }
  },
  created() {
    store.dispatch('openLogOption', this.isLogOperate)
  }
}
</script>
