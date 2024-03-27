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
          @click="getLoopMatchesData()"
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
        <span v-if="!searchLoading">데이터를 가져오고 있습니다.</span>
        <span v-else>유저의 매치 데이터 및 인터넷 상태에 따라 데이터 처리에 오랜 시간이 소요될 수 있습니다.</span>
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
            <template v-else>

            </template>
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

// import { apikey } from '../pubgClientConfig'
import firebase from '@/plugins/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'
import { getMatchesData, getAccntIds } from '../API/pubg'
import dayjs from 'dayjs'

export default {
  name: "record_search",
  component() {
    dayjs
  },
  data() {
    return {
      members: [],
      divisionMembers: [],
      membersNames: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      recodHeaders: [
          { text: '날짜', align: 'start', value: 'date', sortable: true },
          { text: '맵', value: 'map', sortable: false },
          { text: '모드', value: 'mode', sortable: false },
          { text: '팀원', value: 'teamPlayer', sortable: false },
        ],
      result : [],
      baseUrl : 'https://api.pubg.com/shards/steam/',
      isHide : false,
      membersArrayDivisionExecuted  : false,
      playerData : [],
      searchLoading : false
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
    /**
     * 1. 파이어베이스에서 모든 멤버 데이터를 가지고 온다.
     * 2. 가져온 멤버 데이터를 10개씩 배열로 쪼개어 저장한다.
     * 3. getMembers는 뷰 인스턴스가 생성(created) 될 때 지속적으로
     *    가져오므로 멤버데이터를 나누는 함수는 한번만 동작하도록 처리
     * 4. 멤버데이터를 나눈 후 api서버에 account Id와 name, match데이터를 요청하여 받아온다.
     */    
    async getMembers() {
      this.showLoading()
      const db = getFirestore(firebase)
      const memberCol = collection(db, 'members');
      const memberSnapShot = await getDocs(memberCol);
      this.$store.commit('onMemberList', memberSnapShot.docs.map(doc => doc.data()));
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

    /**
     * getMembers에서 사용하는 멤버데이터를 나누는 함수
     */
    async membersArrayDivision() {
      const size = 10;
      for(let i = 0; i < this.members.length; i += size) {
        this.divisionMembers.push(this.members.slice(i, i+size));
      }
      this.pageCount = this.divisionMembers.length;
    },

    /**
     * 위에서 나눠진 멤버스 데이터에서 고유의 StreamID를 모아서
     * membersNames의 배열로 헐당하는 함수
     */
    async getMembersIds() {
      for(let i = 0; i < this.divisionMembers[this.page -1].length; i++) {
        this.membersNames.push(this.divisionMembers[this.page - 1][i].steamid);
      }
    },

    /**
     * 1. API 서버로 멤버의 stream ID를 보내어 필요한 데이터를 요청
     * 2.응답받은 데이터에서 match, accnt-id, name의 데이터만 뽑아내어 result 변수에 할당
     */
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

    /**
     * 멤버의 스팀아이디 조회결과 스팀 아이디를 찾을 수 없는 경우를
     * 표시할 때 사용하는 함수
     * @param {*} item 은 membersArrayDivision함수에서 나눠진 10명의 데이터
     */
    memberInResultList(item) {
      const res = this.result?.filter((i) => i.name === item.steamid)
      if (res.length == 0) {
        return false
      } else return true
    },

    /**
     * result에 저장된 match 배열의 length를 판별하여
     * 최근 게임 이력 여부를 필터링하는 함수
     * @param {*} item 은 membersArrayDivision함수에서 나눠진 10명의 데이터
     */
    recentlyMatche(item) {
      const res = this.result?.filter((i) => i.name === item.steamid)
      if (res[0].matches.length == 0) {
        return true
      } else return false
    },

    /**
     * result 데이터에서 match 배열을 뽑아내어
     * API 서버에 보내고, match의 상세정보를 받아오는 함수
     */
    async getLoopMatchesData() {
      let stateSearched = this.$store.state.searchedPages
      if(stateSearched[this.page - 1]) {
        await this.filteredCreatedAt()
      } else {
        this.searchLoading = !this.searchLoading
        this.showLoading()
        try {
          let allMatchData = {};
  
          const promises = this.result.map(async (item) => {
            if(item.matches.length !== 0) {
              const matches = item.matches.map(obj => obj.id)
              allMatchData[item.name] = matches
            }
          })
  
          await Promise.all(promises)
          const response = await getMatchesData(allMatchData)
  
          if(response) {
            this.$store.commit('onMatchesData', response)
            this.$store.commit('onSearchedPage', stateSearched[this.page - 1] = true)
          }
  
          this.searchLoading = !this.searchLoading
          this.hideLoading()

        } catch (error) {
          console.log(error)
          this.searchLoading = !this.searchLoading
          this.hideLoading()
        }
      }
    },

    async filteredCreatedAt() {
      const dataSet = this.$store.getters.matchesData[this.page - 1]
      console.log(dataSet)
      this.playerData = {};
      
      for(let key in dataSet) {
        const dataArray = [];

        dataSet[key].forEach(el => {
          let createdAt = el.data.attributes.createdAt
          dataArray.push(dayjs(createdAt).format("YYYY-MM-DD"))

        });
        
        this.playerData[key] = { date : dataArray }
      }
    },

    // async filteredPlayInfo() {
    //   const dataSet = this.$store.getters.matchesData
      
    //   for(let key in dataSet){
    //     const mapArray = [];
    //     const modeArray = [];
        
    //     dataSet[key].forEach(el => {
    //       let mapName = el.data.attributes.mapName
    //       let gameMode = el.data.attributes.gameMode

    //       mapArray.push(mapName)
    //       modeArray.push(gameMode)
    //     })

    //     Object.assign(this.playerData[key], { mapName : mapArray, gameMode : modeArray })
    //   }
    // },

    showLoading() {
      this.isHide = true
    },
    hideLoading() {
      this.isHide = false
    },
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