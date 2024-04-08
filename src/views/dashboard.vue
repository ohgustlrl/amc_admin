<template>
  <v-container fluid class="grey lighten-5 h-80vh">
    <v-row class="justify-center">
      <v-col md="5">
        <v-card
          class="pa-0"
          outlined
          tile
        >
          <v-card-title class="d-flex justify-space-between blue lighten-2 pa-3">
            <p class="text-h6 ma-0">클랜원 현황</p>
            <span class="text-subtitle-2 text--secondary">업데이트 일자 2024.08</span>
          </v-card-title>
          <v-card-text class="d-flex pa-3 justify-space-between">
            <p class="d-flex align-center ma-0">
              <v-icon color="black">mdi-account-group</v-icon>
              <span class="text-body-1 text-right ml-2 font-weight-bold">89 명</span>
            </p>
            <p class="d-flex align-center ma-0">
              <v-icon color="primary">mdi-human-male</v-icon>
              <span class="text-body-1 text-right font-weight-bold">89 명</span>
            </p>
            <p class="d-flex align-center ma-0">
              <v-icon color="pink">mdi-human-female</v-icon>
              <span class="text-body-1 text-right font-weight-bold">89 명</span>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="5">
        <v-card
          class="pa-0"
          outlined
          tile
        >
          <v-card-title class="d-flex justify-space-between blue lighten-2 pa-3">
            <p class="text-h6 ma-0">신규 클랜원</p>
            <span class="text-subtitle-2 text--secondary">업데이트 일자 2024.08</span>
          </v-card-title>
          <v-card-text class="d-flex pa-3 justify-space-between">
              <p class="my-1">
                <span class="text-body-1 font-weight-bold">신규 가입일 :</span> 
                <span class="text-body-1 text-right font-weight-bold"> 24.01.23</span>
              </p>
              <p class="my-1">
                <span class="text-body-1 font-weight-bold">닉네임 :</span>
                <span class="text-body-1 text-right font-weight-bold"> 갓파더</span>
              </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name : 'dashBoard',
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style>
  .h-80vh {
    height: 80vh;
  }
</style>