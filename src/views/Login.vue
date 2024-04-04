<template>
  <v-card
    class="mx-auto my-auto"
    min-width="374"
    max-width="500"
  >
    <v-img
      style="background-color: #000000;"
      class="mx-auto"
      width="100%"
      height="100%"
      src="https://media.discordapp.net/attachments/485360498200805387/1116717050191159397/02-Yellow_Profile.gif?ex=661933cc&is=6606becc&hm=30c7c55971ebf0fc7f702cae83a0f36ff584f7b41b17f019bf2dbabf2d96efb5&=&format=webp"
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
</template>

<script>

import 
{
  getAuth,
  GoogleAuthProvider, 
  signInWithPopup,
} from 'firebase/auth'

import router from 'vue-router';

export default {
  name : 'Log-in',
  data() {
    return {
      
    }
  },
  methods : {
    //구글 OAUTH 로그인 한다. 
    clickToLogin() {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      auth.languageCode = 'korean';
      signInWithPopup(auth, provider)
        .then(result => {
          let resultUserInfo = result.user;
          this.$store.commit('setUserInfo', resultUserInfo)
          this.moveToHome()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    moveToHome() {
      router.push({
        path: '/home',
      })
    }

  }

}
</script>

<style>

</style>