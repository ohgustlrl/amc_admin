<template>
  <div>
    <template>
      <v-banner
        outlined
        rounded
        shaped
        single-line
        mb="2"
      >
        <v-icon
          slot="icon"
          color="primary"
          size="36"
        >
          mdi-record-rec
        </v-icon>
          활동 내역 조회
      </v-banner>
    </template>
    <v-row>
      <v-col
        class="d-flex justify-end align-center"
      >
        <v-btn
          color="primary"
          elevation="2"
          class="ma-3"
          large
          @click="getCurrentPageInAccntId(), arrayOfMatchesIds"
        >매치 목록 만들기</v-btn>
        <v-btn
          color="primary"
          elevation="2"
          class="ma-3"
          large
          @click="search(), matchesData"
        >일괄 검색</v-btn>
      </v-col>  
    </v-row>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(item, i) in divisionMembers[page - 1]"
        :key="i"
      >
        <v-expansion-panel-header>
          {{ "닉네임 : " + item.name }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          내용
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- <v-data-table
      :headers="recodHeaders"
      :items="members"
      item-key="name"
      class="elevation-1"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      @page-count="pageCount = $event"
    >
    </v-data-table> -->
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div>
    <v-overlay :class="isHide === false ? 'd-none' : ''">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      >
      </v-progress-circular>
      데이터를 처리 중입니다.
    </v-overlay>
  </div> 
</template>

<script>
import { apikey } from '../pubgClientConfig'

export default {
  name: "record_search",

  data() {
    return {
      members: [],
      divisionMembers: [],
      membersNames: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      recodHeaders: [
          { text: '닉네임', align: 'start', value: 'name', sortable: false },
          { text: '14일간 게임 활동', value: 'state', sortable: false },
          { text: '클랜원과의 게임 활동', value: 'withmember', sortable: false },
        ],
      matchid : [],
      matchesTimeData : [],
      matchesTeamData : [],
      assignTime: [],
      assignTeam: [],
      getMatchIds : [],
      userId : [],
      result : [],
      baseUrl : 'https://api.pubg.com/shards/steam/',
      teamlist : [],
      isHide : false,
    }
  },
  created() {
    this.getMembers();
    this.membersArrayDivision();
    this.getMembersIds();
    // this.search();
  },
  computed : {
  },
  watch : {
    page() {
      this.membersNames = [];
      this.getMembersIds();
    }
  },
  methods: {
    async getCurrentPageInAccntId() {
      await this.$axios.get(`${this.baseUrl}players?filter[playerNames]=${this.membersNames}`, {
        headers : {
          'Accept': 'application/vnd.api+json',
          'Authorization': apikey
        }
      })
        .then(res => {
          this.result = res.data.data.map(playerData => {
            const name = playerData.attributes.name;
            const accntId = playerData.id;
            const matches = playerData.relationships.matches.data

            if(this.membersNames.includes(name)) {
              return {
                name,
                accntId,
                matches
              }
            }

            return '해당 아이디는 조회가 되지 않습니다.'
          });
        }) .catch(e => {
          console.log(e, "조회하는 동안 문제가 발생하였습니다.")
        })
        // .then(() => {
        //   // Matches IDs 배열 만들기
        //   this.result.forEach((item, i) => {
        //     // this.matchid.push(item.relationships.matches.data)
        //     this.matchid[i] = 
        //     Object.values(item.relationships.matches.data)
        //   })
        // })
    },

    async matchesData() {
      this.showLoading();
      for (let i=0; i < this.getMatchIds.length; i++) {
        for await (const [i, item] of this.getMatchIds[i].entries()) {
          console.log(item, i)
          this.$axios.get(this.baseUrl+'matches/'+item, {
            headers : {
              'Accept': 'application/vnd.api+json',
            }
          })
          .then(res => {
            this.matchesTimeData.push(Object.freeze(res.data.data.attributes.createdAt))
            this.matchesTeamData.push(Object.freeze(res.data.included))
          })
          .catch(e => console.log(e))
          .finally(() => {
            this.assignData();
            this.hideLoading();
          })
        }
        // this.getMatchIds[i].forEach((item) => {
        //   this.$axios.get(this.baseUrl+'matches/'+item, {
        //     headers : {
        //       'Accept': 'application/vnd.api+json',
        //     }
        //   })
        //   .then(res => {
        //     this.matchesTimeData.push(res.data.data.attributes.createdAt)
        //     this.matchesTeamData.push(res.data.included)
        //     this.hideLoading();
        //   })
        //   .catch(e => console.log(e))
        // })
      }
    },
    getMembers() {
      this.members = this.$store.state.memberList
    },
    membersArrayDivision() {
      const size = 10;
      for(let i = 0; i < this.members.length; i += size) {
        this.divisionMembers.push(this.members.slice(i, i+size));
      }
      this.pageCount = this.divisionMembers.length;
    },
    getMembersIds() {
      for(let i = 0; i < this.divisionMembers[this.page -1].length; i++) {
        this.membersNames.push(this.divisionMembers[this.page - 1][i].steamid);
      }
    },
    arrayOfMatchesIds() {
      this.matchid.forEach((item ,i) => {
        this.getMatchIds[i] = this.matchid[i].map(x => x.id)
      })
    },
    getMatchids() {
      
    },
    showLoading() {
      this.isHide = true
    },
    hideLoading() {
      this.isHide = false
    },
    assignData() {
      for(let i=0; i < this.matchid.length; i++) {
        this.matchid[i].forEach((item, j) => {
          this.assignTime[i] = Object.freeze(this.matchesTimeData.slice(0, j))
          this.assignTeam[i] = Object.freeze(this.matchesTeamData.slice(0, j))
        })
      }
    }
  },
};
</script>

<style scoped>
  table {
    width: 100%;
  }
  table td, th {
    border: 0px solid #000;
  }
</style>