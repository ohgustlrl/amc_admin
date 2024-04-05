<template>
  <div>
    <v-app-bar
      app
      color="#fff"
      fixed
      height="78"
      width="100%"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"/>
      <v-avatar
        size="50"
      >
        <img
          alt="Avatar"
          src="../assets/logo.jpg"
        >
      </v-avatar>
      <v-spacer />
      <v-btn
        icon
        large
        @click="onDialog = !onDialog"
      >
        <v-avatar
          size="48"
        >
          <img
            alt="Avatar"
            :src=userInfo?.photoURL
          >
        </v-avatar>
      </v-btn>
    </v-app-bar>
    <Leftdrawer
      :drawerProp = drawer
      @drawer="handleDrawerChnage"
    />
    <v-dialog 
      width="200"
      v-model="onDialog"
    >
      <v-btn @click="clickToLogout">
        로그아웃
      </v-btn>
    </v-dialog>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'
import { getAuth, signOut } from 'firebase/auth'
import Leftdrawer from './Leftdrawer.vue'

export default {
  name: 'AppBar',

  data() {
    return {
      drawer : false,
      userInfo : null,
      onDialog : false,
    }
  },
  components: {
    Leftdrawer
  },
  computed: {
  },
  created() {
 
  },
  unmounted() {

  },
  methods: {
    //구글 OAUTH 로그아웃 한다. 
    async clickToLogout() {
      const auth = getAuth(firebase);
      signOut(auth).then(() => {
        this.$store.commit('resetState')
      }).catch((err) => {
        console.error(err)
      }).finally(() => {
        this.$router.push('/')
      })
    },

    handleDrawerChnage(newValue) {
      this.drawer = newValue
    }
  }
}
</script>

<style scoped>
 .v-responsive {
   position: absolute;
 }
 .v-progress-circular {
  margin: 1rem;
}
</style>
