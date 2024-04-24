<template>
  <v-container fluid class="grey lighten-5 h-80vh">
    <v-row class="justify-center">
      <v-col md="5">
        <v-card
          class="pa-0 mb-3"
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
        <v-card
          class="pa-0 mb-3"
          outlined
          tile
        >
          <v-card-title class="d-flex justify-space-between blue lighten-2 pa-3">
            <p class="text-h6 ma-0">용병 현황</p>
            <span class="text-subtitle-2 text--secondary">업데이트 일자 {{ date }}</span>
          </v-card-title>
          <template>
          </template>
          <template v-if="this.mercenaryListProps.length > 0">
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
          </template>
          <template v-else>
            <v-card-text 
              height="20px" 
              class="d-flex pa-3 justify-space-between"
            >
              <span class="text-body-1 text-right ml-2 font-weight-bold">
                현재 활동 중인 용병이 없습니다.
              </span>
            </v-card-text>
          </template>
        </v-card>
      </v-col>
      <v-col md="7">
        <v-card
          class="pa-0"
          outlined
          tile
        >
          <v-card-title class="d-flex justify-space-between blue lighten-2 pa-3">
            <p class="text-h6 ma-0">신규 클랜원</p>
            <span class="text-subtitle-2 text--secondary">업데이트 일자 {{ date }}</span>
          </v-card-title>
          <template v-if="newMember.length > 0">
            <v-card-text class="d-flex pa-3 justify-space-between"
             v-for="list in newMember"
             :key="list.name"
            >
                <p class="ma-0 text-left">
                  <span class="text-body-1 font-weight-bold mr-1">닉네임 :</span>
                  <span class="text-body-1 font-weight-bold">{{ list.name }}</span>
                </p>
                <p class="ma-0 text-left">
                  <span class="text-body-1 font-weight-bold mr-1">나이 :</span>
                  <span class="text-body-1 font-weight-bold">{{ list.age + '년생' }}</span>
                </p>
                <p class="ma-0 text-left">
                  <span class="text-body-1 font-weight-bold mr-1">스팀아이디 :</span>
                  <span class="text-body-1 font-weight-bold">{{ list.steamid }}</span>
                </p>
                <p class="ma-0 text-left">
                  <span class="text-body-1 font-weight-bold mr-1">입장일 :</span> 
                  <span class="text-body-1 font-weight-bold">{{ list.join }}</span>
                </p>
            </v-card-text>
          </template>
          <v-card-text class="d-flex pa-3 justify-space-between" v-else>
              <p class="ma-0">
                <span class="text-body-1 font-weight-bold">신규 멤버가 없습니다.</span> 
              </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col md="5">
        
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
      date : dayjs().format('YYYY.MM.DD HH:mm:ss'),
    }
  },
  component() {
    dayjs
  },
  created() {
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
    },
    newMember() {
      let newMember = []
      const today = dayjs();
      this.memberListProps.map(obj => {
        const part = obj.join.split('.').map(Number);
        const joinDate = new Date(part[0] + 2000, part[1] - 1, part[2]);
        const oneDay = 24 * 60 * 60 * 1000
        const diffDays = Math.round(Math.abs((today - joinDate) / oneDay))
        if (diffDays <= 10) {
          newMember.push({
            age : obj.age,
            name : obj.name,
            sex : obj.sex,
            steamid : obj.steamid,
            join : obj.join
          })
        }
      })
      return newMember
    },
  },
  methods: {
  }
}
</script>

<style>
  .h-80vh {
    height: 80vh;
  }
  .width200 {
    width: 200px;
  }
  .width180 {
    width: 180px;
  }
  .width150 {
    width: 150px;
  }
  .width100 {
    width: 100px;
  }
  .width120 {
    width: 120px;
  }
</style>