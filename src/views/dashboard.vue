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
            <span class="text-subtitle-2 text--secondary">업데이트 일자 {{ date }}</span>
          </v-card-title>
          <v-card-text height="20px" class="d-flex pa-3 justify-space-between">
            <p class="d-flex align-center ma-0">
              <v-icon color="black">mdi-account-group</v-icon>
              <span class="text-body-1 text-right ml-2 font-weight-bold">{{ total }} 명</span>
            </p>
            <p class="d-flex align-center ma-0">
              <v-icon color="primary">mdi-human-male</v-icon>
              <span class="text-body-1 text-right font-weight-bold">{{ maleOfTotal }} 명</span>
            </p>
            <p class="d-flex align-center ma-0">
              <v-icon color="pink">mdi-human-female</v-icon>
              <span class="text-body-1 text-right font-weight-bold">{{ feMaleOfTotal }} 명</span>
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
            <span class="text-subtitle-2 text--secondary">업데이트 일자 {{ date }}</span>
          </v-card-title>
          <v-card-text class="d-flex pa-3 justify-space-between" v-if="newMember.length !== 0">
              <p class="ma-0">
                <span class="text-body-1 font-weight-bold">신규 가입일 :</span> 
                <span class="text-body-1 text-right font-weight-bold"> 24.01.23</span>
              </p>
              <p class="ma-0">
                <span class="text-body-1 font-weight-bold">닉네임 :</span>
                <span class="text-body-1 text-right font-weight-bold"> 갓파더</span>
              </p>
          </v-card-text>
          <v-card-text class="d-flex pa-3 justify-space-between" v-else>
              <p class="ma-0">
                <span class="text-body-1 font-weight-bold">서비스 오픈 준비중입니다.</span> 
              </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col md="5">
        <v-card
          class="pa-0"
          outlined
          tile
        >
          <v-card-title class="d-flex justify-space-between blue lighten-2 pa-3">
            <p class="text-h6 ma-0">용병 현황</p>
            <span class="text-subtitle-2 text--secondary">업데이트 일자 {{ date }}</span>
          </v-card-title>
          <v-card-text 
            height="20px" 
            class="d-flex pa-3 justify-space-between"
            v-for="(list, index) in this.mercenaryListProps" :key="list.name"
          >
            <p class="d-flex align-center ma-0">
              <span color="black">닉네임 : </span>
              <span class="text-body-1 text-right ml-2 font-weight-bold">{{ list.name }}</span>
            </p>
            <p class="d-flex align-center ma-0">
              <span color="primary">서버 입장일 : </span>
              <span class="text-body-1 text-right ml-2 font-weight-bold">{{ list.join }}</span>
            </p>
            <p class="d-flex align-center ma-0">
              <span color="pink">체류일</span>
              <span class="text-body-1 text-right ml-2 font-weight-bold">{{ visitDate[index] }} 일</span>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name : 'dashBoard',
  props : ['memberListProps', 'mercenaryListProps'],
  data() {
    return {
      newMember : [],
      date : dayjs().format('YYYY.MM.DD HH:mm:ss')
    }
  },
  component() {
    dayjs
  },
  computed : {
    total() {
      let totlaLength = this.memberListProps.length
      return totlaLength
    },
    maleOfTotal() {
      let maleArray = []
      this.memberListProps.map(obj => {
        if(obj.sex == '남') {
          maleArray.push(obj.name)
        }
      })
      return maleArray.length
    },
    feMaleOfTotal() {
      let feMaleArray = []
      this.memberListProps.map(obj => {
        if(obj.sex == '여') {
          feMaleArray.push(obj.name)
        }
      })
      return feMaleArray.length
    },
    visitDate() {
      const today = dayjs();
      return this.mercenaryListProps.map(obj => {
        const part = obj.join.split('.').map(Number);
        const joinDate = new Date(part[0] + 2000, part[1] - 1, part[2]);
        const oneDay = 24 * 60 * 60 * 1000
        const diffDays = Math.round(Math.abs((today - joinDate) / oneDay))
        return diffDays
      })
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