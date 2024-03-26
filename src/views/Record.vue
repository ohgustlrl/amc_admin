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
          @click="getLoopMatchesData(), arrayOfMatchesIds"
        >조회하기</v-btn>
      </v-col>  
    </v-row>
    <v-expansion-panels>
      <v-overlay :class="isHide === false ? 'd-none' : ''">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        >
        </v-progress-circular>
        데이터를 처리 중입니다.
      </v-overlay>
      <template>
        <v-expansion-panel
          v-for="(item, i) in divisionMembers[page - 1]"
          :key="i"
        >
          <v-expansion-panel-header>
            {{ "닉네임 : " + item.name }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <span v-if="memberInResultList(item) == false">
              유저 정보를 찾을 수 없습니다.
            </span>
            <span v-else-if="recentlyMatche(item)">
              최근 2주간 플레이 이력이 없습니다.
            </span>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </template>
    </v-expansion-panels>
      
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div>
  </div> 
</template>

<script>

// data > included > relationships > participants > data[]에 팀원 정보담겨있음

// 플레이어를 기준으로 팀원정보를 가져오기 위해선

// 1. data > included > attributes 객체에서 name 이 steamId랑 같은 객체를 찾는다.
// 2. 찾은 객체에서 id 값을 가져와 변수에 할당
// 3. 해당 id를 다시 data > included > relationships > participants 의 id가 있는지 필터링
// 4. 2번의 id를 제외한 나머지 id를 다시 변수에 할당
// 5. 4번의 id를 data > included 에서 조회 하여 일치하는 객체의 name 을 뽑는다

import { apikey } from '../pubgClientConfig'
import firebase from '@/plugins/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'
import { getMatchesData, getAccntIds } from '../API/pubg'

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
      membersArrayDivisionExecuted  : false
    }
  },
  created() {
    this.getMembers();
    // this.search();
  },
  computed : {
  },
  watch : {
    page() {
      this.membersNames = [];
      this.getMembers();
    }
  },
  methods: {
    async GetAccntIdsAPI(membersNames) {
      try {
        const response = await getAccntIds(membersNames)
        this.result = response.data.map(playerData => {
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
        })
      } catch (error) {
        alert(error, '조회하는 동안 문제가 발생하였습니다.')
      }
    },

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

    // 멤버의 스팀아이디 조회결과 스팀 아이디를 찾을 수 없는 경우를
    // 표시할 때 사용하는 함수
    memberInResultList(item) {
      const res = this.result?.filter((i) => i.name === item.steamid)
      if (res.length == 0) {
        return false
      } else return true
    },

    // 최근 게임 이력 여부를 필터링하는 함수
    recentlyMatche(item) {
      const res = this.result?.filter((i) => i.name === item.steamid)
      if (res[0].matches.length == 0) {
        return true
      } else return false
    },

    getLoopMatchesData() {
      let allMatchData = [];

      this.result.forEach((item) => {
        if (item.matches.length !== 0 ) {
          allMatchData[item.name] = []
          
          item.matches.forEach((obj) => {
            allMatchData[item.name].push({
              id: obj.id
            })
            // this.$axios.get(`${this.baseUrl}matches/${obj.id}`, {
            //   headers: {
            //     'Accept': 'application/vnd.api+json',
            //     'Authorization': apikey
            //   }
            // })
            // .then(res => {
            //   const matchData = res.data.data
            //   allMatchData.push(matchData)
            // })
          })
        }
      })
      console.log(allMatchData)
      getMatchesData(allMatchData)
    },

    // filteredTeamPlayers() {
    //   this.getLoopMatchesData().then(allMatchData => {
    //     console.log(allMatchData)
    //   })
    // },

    getMatchesData() {
      this.result?.forEach((i) => {
        if(i.matches.length !== 0) {
          return
        }
      })
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
    async getMembers() {
      this.showLoading()
      const db = getFirestore(firebase)
      const memberCol = collection(db, 'members');
      const memberSnapShot = await getDocs(memberCol);
      this.$store.state.memberList = memberSnapShot.docs.map(doc => doc.data());
      this.members = this.$store.state.memberList

      if(!this.membersArrayDivisionExecuted) {
        await this.membersArrayDivision();
        this.membersArrayDivisionExecuted = true;
      }

      await this.getMembersIds();
      await this.GetAccntIdsAPI(this.membersNames);
      // await this.getCurrentPageInAccntId();
      this.hideLoading();
    },

    async membersArrayDivision() {
      const size = 10;
      for(let i = 0; i < this.members.length; i += size) {
        this.divisionMembers.push(this.members.slice(i, i+size));
      }
      this.pageCount = this.divisionMembers.length;
    },
    async getMembersIds() {
      for(let i = 0; i < this.divisionMembers[this.page -1].length; i++) {
        this.membersNames.push(this.divisionMembers[this.page - 1][i].steamid);
      }
    },
    arrayOfMatchesIds() {
      this.matchid.forEach((item ,i) => {
        this.getMatchIds[i] = this.matchid[i].map(x => x.id)
      })
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