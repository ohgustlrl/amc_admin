<template>
  <v-app id="app">
    <Login v-if="!login"/>
    <v-container v-else>
      <AppBar/>
        <router-view />
      <Footer/>
    </v-container>
  </v-app>
</template>

<script>
import AppBar from './components/Appbar.vue'
import Footer from './components/Footer.vue'
import Login from './views/Login.vue'
import { mapState } from 'vuex'

export default {
  name: 'AMC_ADMIN',
  components: {
    AppBar,
    Footer,
    Login,
  },
  computed: {
    ...mapState(['login'])
  },
  methods: {
   
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.container {
  margin: 10vh 0;
}

.v-application--wrap {
  align-items: center;
}
</style>
