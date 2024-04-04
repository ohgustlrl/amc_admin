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
            <v-icon 
              v-if="$store.state.userInfo === undefined"
            >
              mdi-account
            </v-icon>
            <v-img
              v-else
              :src="$store.state.userInfo.photoURL" 
              absolute
              style="border-radius : 50%"
            >
            </v-img>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                반가워요:)
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ userInfo.displayName }}님
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
import 
{
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider, 
  setPersistence, 
  signInWithPopup,
  signOut, 
} from 'firebase/auth'
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

    },
    methods: {
      getUserInfoState() {
        this.userInfo = this.$store.state.userInfo
      },
      //구글 OAUTH 로그인 한다. 
      clickToLogin() {
        firebase;
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        auth.languageCode = 'korean';
        signInWithPopup(auth, provider)
          .then(result => {
            let resultUserInfo = result.user;
            this.$store.commit('setUserInfo', resultUserInfo)
            setPersistence(auth, browserSessionPersistence)
              .then(() => {})
          })
          .catch((err) => {
            console.log(err)
          })
      },

      //구글 OAUTH 로그아웃 한다. 
      clickToLogout() {
        firebase;
        const auth = getAuth();
        signOut(auth).then(() => {
          this.$store.commit('delUserInfo', undefined)
          console.log('정상적으로 로그아웃 되었습니다.')
        }).catch(() => {
        }).finally(() => {
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
