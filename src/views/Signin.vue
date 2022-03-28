<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="500"
      elevation="5"
      outlined
      style="margin: 15vh 0; padding: 0 0 4vh 0"
    >
      <v-card-text>
        <div>AMC ADMIN SIGN IN</div>
      </v-card-text>
      <v-divider></v-divider>
        <v-container class="d-flex justify-center">
          <div class="g-signin2" id="google-signin-btn" data-onsuccess="onsSignIn"></div>
        </v-container>
    </v-card>
  </div>
</template>

<script>


export default {
  name: "Sign-in",

  props: {
    msg: String
  },
  created() {
    window.onSignIn = this.onSignIn;
  },
  methods: {
    onSignIn(googleUser) {
      const profile = googleUser.getBasicProfile();
      console.log('ID Token: ', googleUser.getAuthResponse().id_token);
      console.log('ID: ' + profile.getId());
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ', + profile.getEmail());
    }
  }
};
</script>

<style scoped>
  .container {
    margin: auto;
  }
</style>