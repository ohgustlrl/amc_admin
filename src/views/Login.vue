<template>
  <v-container>
    <v-card
      class="mx-auto my-auto"
      min-width="374"
      max-width="500"
    >
      <v-img
        style="background-color: #000000;"
        class="mx-auto"
        width="100%"
        height="320px"
        src="../assets/02-Yellow_Profile.gif"
      ></v-img>
      <v-card-title>AMC ADMIN</v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-card-text>
        <p>본 서비스는 인증된 사용자만 이용가능한 사이트 입니다.</p>
        <p>계속 이용하시려면 로그인 해 주세요.</p>
      </v-card-text>
      <div class="text-center py-5">
        <v-btn
          color="blue"
          dark
          @click="clickToLogin()"
        >
          로그인
        </v-btn>
      </div>
    </v-card>
    <v-dialog
      transition="dialog-bottom-transition"
      max-width="300"
      persistent
      v-model="msgBox"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          로그인 할 수 없습니다.
        </v-card-title>
        <v-card-text>
          본 사이트는 인증 된 사용자만 로그인 할 수 있습니다.
          로그인이 필요한 경우 관리자에게 문의해 주세요.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="msgBox = false"
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      transition="dialog-bottom-transition"
      max-width="300"
      persistent
      v-model="errorBox"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          죄송합니다.
        </v-card-title>
        <v-card-text>
          현재는 로그인이 불가능합니다.
          관리자에게 문의해주세요.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="errorBox = false"
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

import 
{
  getAuth,
  GoogleAuthProvider, 
  signInWithPopup,
} from 'firebase/auth'
import firebase from '../plugins/firebase'
import { getAuthConfirm } from '../API/auth'

export default {
  name : 'Log-in',
  data() {
    return {
      msgBox : false,
      errorBox : false,
    }
  },
  created() {
    
  },
  unmounted() {

  },
  methods : {
    //구글 OAUTH 로그인 한다. 
    async clickToLogin() {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(firebase);
      auth.languageCode = 'korean';
      let googleUID
      const saveUserInfo = (result) => {
        return new Promise((resolve) => {
          let userData = result.user.providerData[0]

          this.$store.commit('setUserInfo', userData)
          resolve()
        })
      }

       signInWithPopup(auth, provider)
        .then((result) => {
          googleUID = result.user.uid
          saveUserInfo(result)
        })
        .then(() => {
          getAuthConfirm(googleUID)
            .then(res => {
              if(res == 200) {
                  this.$router.push('/home')
                } else if(res == 531) {
                  this.msgBox = true
                } else {
                  this.errorBox = true
                }
            })
        })
        .catch((err) => {
          console.log(err)
        })
    },
  }

}
</script>

<style>

</style>