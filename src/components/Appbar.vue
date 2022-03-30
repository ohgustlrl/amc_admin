<template>
  <div>
    <v-app-bar
      app
      color="#fff"
      fixed
      height="78"
    >
      <v-app-bar-nav-icon @click.stop="[(drawer = !drawer)]" />
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
        transition="slide-y-transition"
        bottom
        :offset-y="offset"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            icon 
            v-bind="attrs"
            v-on="on"
          >
            <v-icon v-if="memberName === undefined">mdi-account</v-icon>
            <v-img
              :src="userImage" 
              absolute
              v-else
            >
            </v-img>
          </v-btn>
        </template>
        <v-list v-if="memberName === undefined">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                반가워요:)
              </v-list-item-title>
              <v-list-item-subtitle>
                아직 로그인을 안하셨네요?
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>  
          <v-divider />
          <v-list nav>
            <v-list-item-group>
              <v-list-item>
                <v-list-item-content>
                  <v-btn
                    small
                    elevation="2"
                    rounded
                    color="primary"
                    dark
                    @click="clickToLogin"
                  >
                    <v-icon
                      left
                      dark
                    >
                      mdi-google
                    </v-icon>
                    구글 로그인
                  </v-btn>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-list>
        <v-list v-else>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                반가워요:)
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ memberName }}님
              </v-list-item-subtitle>
            </v-list-item-content> 
          </v-list-item>  
          <v-divider />
          <v-list nav>
            <v-list-item-group>
              <v-list-item>
                <v-list-item-content>
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
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-list>
      </v-menu>
      
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      width="300"
      app
      temporary
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="../assets/logo.jpg" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              AMC ADMIN
            </v-list-item-title>
            <v-list-item-subtitle>
              pubg apple mango clan admin
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list nav>
        <v-list-item-group>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="{ path: items[i].path }"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.text" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'
import 
{
  getAuth,
  GoogleAuthProvider, 
  signInWithPopup,
  signOut, 
} from 'firebase/auth'


  export default {
    name: 'AppBar',

    data() {
      return {
        offset: true,
        drawer: false,
        memberName: undefined,
        userImage: '',
        items: [
          { text: "홈", path: "/home" },
          { text: "클랜원 목록", path: "/memberlist" },
          { text: "전적검색", path: "/record" },
          { text: "일정", path: "/scheduler" },
          { text: "회의록", path: "/meetinglog" },
        ],
      }
    },
    methods: {
      //구글 OAUTH 로그인 한다. 
      clickToLogin() {
        firebase;
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        auth.languageCode = 'ko';
        signInWithPopup(auth, provider)
          .then((result) => {
            this.memberName = result.user.displayName;
            this.userImage = result.user.photoURL;
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
          console.log('정상적으로 로그아웃 되었습니다.')
        }).catch((e) => {
          console.log(e)
        }).finally(() => {
          this.clear()
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
      // 회원 정보를 초기화 한다.
      clear() {
        this.memberName = undefined;
        this.userImage = '';
      }  
    }
  }
</script>

<style scoped>
 .v-responsive {
   position: absolute;
 }
</style>
