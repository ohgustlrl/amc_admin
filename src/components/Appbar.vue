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

      <v-menu 
        transition="slide-y-transition"
        bottom
        :offset-y="offset"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon 
          v-bind="attrs"
          v-on="on">
            <v-icon v-if="user === undefined"> mdi-account</v-icon>
            <v-img v-if="user = !undefined" :src="userImage"></v-img>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title class="text-h6">
              LOG IN
            </v-list-item-title>
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
                    with Google
                  </v-btn>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-list nav v-show="user = !undefined">
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
                      mdi-google
                    </v-icon>
                    Log Out
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
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import "firebase/compat/auth"
import "firebase/compat/firestore"

  export default {
    name: 'AppBar',

    data() {
      return {
        offset: true,
        drawer: false,
        user: undefined,
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
      clickToLogin() {
        firebase;
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        
        signInWithPopup(auth, provider)
          .then((result) => {
            this.user = result.user; // 로그인 성공
            this.userImage = result.user.photoURL // 로그인 사용자의 이미지
          })
          .catch((err) => {
            console.log(err)
          })    
      },
    },
  }
</script>
