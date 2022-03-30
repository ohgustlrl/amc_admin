<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="500"
      elevation="5"
      outlined
      style="margin: 15vh 0;"
    >
      <v-card-text>
        <div>AMC ADMIN SIGN IN</div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text align="center" class="my-2">
        <v-btn
          x-large
          elevation="2"
          rounded
          color="primary"
          dark
          @click="google"
        >
          <v-icon
            left
            dark
          >
            mdi-google
          </v-icon>
          Sign in with Google
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Sign-in",

  props: {
    msg : String
  },

  methods: {
    
  },
}
</script>

<style scoped>
  .container {
    margin: auto;
  }
</style>