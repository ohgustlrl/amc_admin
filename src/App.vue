<template>
  <v-app id="app">
    <AppBar/>
    <v-container>
      <router-view />
    </v-container>
    <Footer/>
  </v-app>
</template>
<script>
import AppBar from './components/Appbar.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'AMC_ADMIN',
  
  components: {
    AppBar,
    Footer,
  },
  methods: {},
  
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
