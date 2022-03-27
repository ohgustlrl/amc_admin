<template>
  <v-footer
    app
    fixed
    dark
    padless
  >
    <v-card
      class="flex text-center"
      flat
      tile
    >
      <v-card-text class="py-2 white--text">

        <v-btn
          v-for="icon in icons"
          :key="icon"
          class="mx-4"
          dark
          icon
        >
          <v-icon size="24px">
            {{ icon }}
          </v-icon>
        </v-btn>
      </v-card-text>

      <v-card-text class="py-2 white--text text-center">
        {{ new Date().getFullYear() }} — <strong>PUBG APPLE MANGO CLAN ADMIN</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
  export default {
    name: 'amang_Footer',

    data() {
      return {
        icons: [
          'mdi-chat',
          'mdi-discord',
        ],
      }
    }
  }
</script>