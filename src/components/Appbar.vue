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
      <v-menu
        open-on-hover
        left
        max-width="150px"
      >
        <template v-slot:activator="{on}">
          <v-btn
            class="mr-2"
            icon
            large
            v-on="on"
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
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <h3>{{ userInfo?.displayName + '님' }}</h3>
            <p class="text-caption mt-1">{{ userInfo?.email }}</p>
            <v-divider class="my-3" />
            <v-btn
              class="ma-2"
              outlined
              color="indigo"
              @click="clickToLogout"
            >
              <v-icon>
                mdi-logout
              </v-icon>
              로그아웃
            </v-btn>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-app-bar>
    <Leftdrawer
      :drawerProp = drawer
      @drawer="handleDrawerChnage"
    />
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
    this.getStateUserInfo()
  },
  unmounted() {

  },
  methods: {
    getStateUserInfo() {
      this.userInfo = this.$store.state.userInfo
    },
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
