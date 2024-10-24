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
          로그인 실패
        </v-card-title>
        <v-card-text>
          {{ errorMessage }}
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
import {getAuthConfirm} from '../API/auth'

export default {
  name : 'Log-in',
  data() {
    return {
      msgBox : false,
      errorBox : false,
      userData : null,
      errorMessage : null,
    }
  },
  mounted() {
    const code = this.$route.query.code;
    if (code) {
      this.getDiscordUser(code);
    }
  },
  methods : {
    async clickToLogin() {
      // 디스코드 OAUTH 처리. 
      const clientId = process.env.VUE_APP_CLIENT_ID;
      const redirectUri = encodeURIComponent(process.env.VUE_APP_REDIRECT_URI_LOCAL); // 운영 시 process.env.VUE_APP_REDIRECT_URI <-로 교체
      const scope = 'identify';

      const discordOAuthURL = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`
      
      window.location.href = discordOAuthURL;
    },

    async getDiscordUser(code) {
      try {
        const result = await getAuthConfirm(code)
        const status = result.status

        if (status == 200) {
          this.userData = result.data
          this.$store.commit('setUserInfo', this.userData);
          this.$router.push('/Home').then(() => {this.$nextTick(() => {})});
        } else {
          this.errorMessage = "로그인 실패"
        }
      } catch (error) {
        this.errorBox = true;
        this.errorMessage = '서버와 통신하는데 실패하였습니다. 잠시 후 다시 시도해 주세요.'
      }
    }
  },
}
</script>

<style>

</style>