<template>
  <v-container fluid :class="[isDashBoard ? 'my-0 py-0 grey lighten-5' : '']">
    <AppBar />
      <v-main>
        <router-view />
      </v-main>
    <Footer />
  </v-container>
</template>

<script>
// import dayjs from 'dayjs'
import AppBar from '../components/Appbar.vue'
import Footer from '../components/Footer.vue' 
// @ is an alias to /src
export default {
  name: 'MainPage',
  data() {
    return {
      memberList : [],
      mercenaryList : [],
      managerList : [],
      dcMemberList : null,
    }
  },
  components: {
    AppBar,
    Footer,
  },
  created() {
  },
  computed: {
    isDashBoard() {
      return this.$route.name == 'DashBoard' ? true : false
    }
  },
  methods: {
    showLoading() {
      this.isHide = true
    },
    hideLoading() {
      this.isHide = false
    },
  }
}
</script>

<style scoped>

</style>
