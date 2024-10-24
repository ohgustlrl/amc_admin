<template>
  <v-container>
    <v-row class="flex-child">
      <v-col
        class="d-flex" 
        md="5"
      >
        <v-row>
          <v-col
            cols="12"
          >
            <v-card
              class="pa-0"
              tile
              elevation="2"
            >
              <v-card-title class="d-flex justify-space-between blue lighten-2 pa-3">
                <p class="text-h6 ma-0">클랜원 현황</p>
                <p class="text-subtitle-2 text--secondary">업데이트 일자 {{ date + ' 06:00 기준' }}</p>
              </v-card-title>
              <v-card-text height="20px" class="d-flex pa-3 justify-space-between">
                <p class="d-flex align-center ma-0">
                  <v-icon color="black">mdi-account-group</v-icon>
                  <span class="text-body-1 text-right ml-2 font-weight-bold">{{ memberCount.total }} 명</span>
                </p>
                <p class="d-flex align-center ma-0">
                  <v-icon color="primary">mdi-human-male</v-icon>
                  <span class="text-body-1 text-right font-weight-bold">{{ memberCount.man }} 명</span>
                </p>
                <p class="d-flex align-center ma-0">
                  <v-icon color="pink">mdi-human-female</v-icon>
                  <span class="text-body-1 text-right font-weight-bold">{{ memberCount.woman }} 명</span>
                </p>
              </v-card-text>
            </v-card>
          </v-col>  
          <v-col>  
            <v-card
              class="pa-0"
              elevation="2"
              tile
            >
              <v-card-title class="d-flex justify-space-between blue lighten-2 pa-3">
                <p class="text-h6 ma-0">미가입자 리스트<span class="caption"> ( 서버입장은 했으나 가입절차를 밟지 않은 인원 - 신입채널에서 확인 가능 )</span></p>
                <span class="text-subtitle-2 text--secondary">{{ date + ' 06:00 기준' }}</span>
              </v-card-title>
              <v-simple-table
                fixed-header
                dense
              >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-center">
                        닉네임
                      </th>
                      <th class="text-center">
                        나이
                      </th>
                      <th class="text-center">
                        스팀아이디
                      </th>
                      <th class="text-center">
                        입장일
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="list in notJoinMember"
                      :key="list.id"
                    >
                      <td>{{ list.nickName }}</td>
                      <td>{{ list.age }}</td>
                      <td>{{ list.steamNickname }}</td>
                      <td>{{ dayjs(list.joinedAt).format('YYYY.MM.DD HH:mm') }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="7"
      >
        <v-card
          class="pa-0"
          elevation="2"
          tile
        >
          <v-card-title class="d-flex justify-space-between blue lighten-2 pa-3">
            <p class="text-h6 ma-0">신규 클랜원</p>
            <span class="text-subtitle-2 text--secondary">업데이트 일자 {{ date + ' 06:00 기준' }}</span>
          </v-card-title>
          <v-simple-table
            dense
          >
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">
                    닉네임
                  </th>
                  <th class="text-center">
                    나이
                  </th>
                  <th class="text-center">
                    스팀아이디
                  </th>
                  <th class="text-center">
                    입장일
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="list in newMember"
                  :key="list.id"
                >
                  <td>{{ list.nickName }}</td>
                  <td>{{ list.age }}</td>
                  <td>{{ list.steamNickname }}</td>
                  <td>{{ dayjs(list.joinedAt).format('YYYY.MM.DD HH:mm') }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from 'dayjs'
import {getDashboardApi} from '../API/member/getDashboard'

export default {
  name : 'dashBoard',
  data() {
    return {
      dayjs,
      date : dayjs().format('YYYY.MM.DD'),
      memberCount : {
        total : null,
        man : null,
        woman : null
      },
      newMember : [],
      notJoinMember : [],
    }
  },
  component() {
    dayjs
  },
  created() {
    this.getDashboardData();
  },
  computed : {

  },
  methods: {
    async getDashboardData () {
      const result = await getDashboardApi();

      this.memberCount.total = result ? result.totalMembers : 0; 
      this.memberCount.man = result ? result.maleMembers : 0;
      this.memberCount.woman = result ? result.femaleMembers : 0;
      this.newMember = result ? result.newMembers : [];
      this.notJoinMember = result ? result.notJoinMember : [];
    }
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

  li::marker {
    display: none;
  }
</style>