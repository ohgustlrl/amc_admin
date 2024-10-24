<template>
  <v-container fluid>
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
  main {
    padding: 0 !important;
  }

</style>
