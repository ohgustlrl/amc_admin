<template>
  <div>
    <v-app-bar
      app
      color="#fff"
      fixed
      height="78"
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
      <!-- 앱바 로그인 메뉴 시작-->
      <v-menu 
        bottom
        origin="center center"
        transition="scale-transition"
        max-width="60vw"
        style="right: 12px !important;"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            icon 
            v-bind="attrs"
            v-on="on"
          >
            <v-img
              :src=userInfo.photoURL
              absolute
              style="border-radius : 50%"
            >
            </v-img>
          </v-btn>
        </template>
        <v-list v-if="userInfo">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                반가워요:)
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ userInfo?.displayName }}님
              </v-list-item-subtitle>
            </v-list-item-content> 
          </v-list-item>  
          <v-divider />
          <v-list nav>
            <v-btn
              small
              elevation="2"
              rounded
              color="error"
              dark
              @click="clickToLogout"
            >
              <v-icon
                left
                dark
              >
                mdi-logout-variant
              </v-icon>
              로그아웃
            </v-btn>
          </v-list>
        </v-list>
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
    }
  },
  components: {
    Leftdrawer
  },
  computed: {
  },
  created() {
    this.getUserInfoState()
  },
  methods: {
    getUserInfoState() {
      this.userInfo = this.$store.state.userInfo
    },
    //구글 OAUTH 로그아웃 한다. 
    async clickToLogout() {
      const auth = getAuth(firebase);
      signOut(auth).then(() => {
        this.$store.commit('onLogin', false)
        this.$store.commit('delUserInfo', undefined)
        this.$router.push('/')
      }).catch((err) => {
        console.error(err)
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
