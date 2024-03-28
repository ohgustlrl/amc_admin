<template>
  <div>
    <v-app-bar
      app
      color="#fff"
      fixed
      height="78"
    >
      <v-app-bar-nav-icon @click.stop="onToggle"/>
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
          <v-progress-circular
              indeterminate
              color="primary"
              v-show="$store.state.loading === true"
          ></v-progress-circular>
          <v-btn 
            icon 
            v-bind="attrs"
            v-on="on"
          >
            <v-icon v-if="$store.state.userInfo === undefined" :class="isHide ? 'd-none' : ''">mdi-account</v-icon>
            <v-img
              :src="$store.state.userInfo.photoURL" 
              absolute
              v-else
              style="border-radius : 50%"
            >
            </v-img>
          </v-btn>
        </template>
        <v-list v-if="$store.state.userInfo === undefined">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                헐?
              </v-list-item-title>
              <v-list-item-subtitle>
                아직 로그인을
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                안하셨네요?
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>  
          <v-divider />
          <v-list nav>
            <v-btn
              small
              elevation="2"
              rounded
              color="primary"
              dark
              @click="clickToLogin"
            >
              <v-icon
                bottom
                dark
              >
                mdi-google
              </v-icon>
              구글 로그인
            </v-btn>
          </v-list>
        </v-list>
        <v-list v-else>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                반가워요:)
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $store.state.userInfo.displayName }}님
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
    <Leftdrawer></Leftdrawer>
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
        isHide: false
      }
    },
    components: {
      Leftdrawer
    },
    computed: {
    },
    methods: {
      //구글 OAUTH 로그인 한다. 
      clickToLogin() {
        firebase;
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        auth.languageCode = 'korean';
        this.isHide = true;
        this.$store.commit('onloading', true)
        signInWithPopup(auth, provider)
          .then((result) => {
            let resultUserInfo = result.user;
            this.$store.commit('setUserInfo', resultUserInfo)
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.$store.commit('onloading', false)
            this.isHide = false;
            setPersistence(auth, browserSessionPersistence)
              .then(() => {})
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
          this.isHide = false;
        })
      },

      // 앱 초기화 시 로그인 정보가 있는지 확인.
      init() {
        firebase;
        const auth = getAuth();
        auth.languageCode = 'ko';
        auth.onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log(user)
          } 
        })
      },
      onToggle() {
        this.$store.commit('onToggleDrawer', false)
      },
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
