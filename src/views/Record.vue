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
        <template v-if="!searchLoading">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          >
          </v-progress-circular>
          <span>데이터를 가져오고 있습니다.</span>
        </template>
        <template v-else>
          <span>매치 데이터를 조회 후 다운로드 중 입니다.</span>
          <v-progress-linear
            v-model="progressPercentage"
            height="25"
          >
            <strong>{{ progressPercentage }}%</strong>
          </v-progress-linear>
        </template>
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
              <v-data-table
                :headers="recodHeaders"
                :items="playerData[item.steamid]"
                :items-per-page="5"
                class="elevation-1"
              ></v-data-table>
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
          { text: '플레이 일자', align: 'center', value: 'date', sortable: true, width: 120 },
          { text: '맵', value: 'map', sortable: false, width: 100 },
          { text: '모드', value: 'mode', sortable: false, width: 150 },
          { text: '팀원', value: 'team', sortable: false, width: "auto" },
        ],
      result : [],
      baseUrl : 'https://api.pubg.com/shards/steam/',
      isHide : false,
      membersArrayDivisionExecuted  : false,
      playerData : [],
      searchLoading : false,
      progressPercentage : 0,
      whatsLoading: null,
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
      let isDataLoading = this.$store.state.isGetDataLoading
      isDataLoading
      this.playerData = []
      let stateSearched = this.$store.state.searchedPages
      let page = this.page
      if(stateSearched[page]) {
        let gameData = await this.filteredData()
        let teamMateArr = await this.filteredTeamMate()
        let steamIdNames = await this.findFilterName(teamMateArr)
        let fullData = await this.mergeData(gameData, steamIdNames)
        let itemData = await this.setFormattedData(fullData)
        this.playerData = itemData
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
          const response = await getMatchesData(allMatchData, progress => {
            this.progressPercentage = progress
          })
  
          let searchedPageCommitData = {}
          searchedPageCommitData[page] = true
        
          this.$store.commit('onMatchesData', response)
          this.$store.commit('onSearchedPage', searchedPageCommitData)

          this.searchLoading = !this.searchLoading
          let gameData = await this.filteredData()
          let teamMateArr = await this.filteredTeamMate()
          let steamIdNames = await this.findFilterName(teamMateArr)
          let fullData = await this.mergeData(gameData, steamIdNames)
          let itemData = await this.setFormattedData(fullData)
          this.playerData = itemData

          if(this.progressPercentage === 100) {
            this.hideLoading()
            this.progressPercentage = 0;
          }

        } catch (error) {
          console.error(error)
          this.searchLoading = !this.searchLoading
          this.hideLoading()
        }
      }
    },

    /**
     * 매치 데이터에서 필요한 정보를 필터링 하는 함수
     * 해당 필터링을 통해, 플레이 일자, map, mode를 확인할 수 있다.
     */
    async filteredData() {
      const observerData = this.$store.state.matchesData[this.page - 1]
      const dataSet = JSON.parse(JSON.stringify(observerData))
      let dataArray = {}

      for(let user in dataSet) {
        for(let i = 0; i < dataSet[user].length; i++) {
          const createdAt = dataSet[user].map(item => item.data.attributes.createdAt)     
          const mapName = dataSet[user].map(item => item.data.attributes.mapName)
          const gameMode = dataSet[user].map(item => item.data.attributes.gameMode)

          dataArray[user] = { 
            date : createdAt,
            map : mapName,
            mode : gameMode
          }
        }
      }
      return dataArray
    },

    /**
     * 매치 데이터에서 필요한 정보를 필터링 하는 함수
     * 복잡하지만 단순히 유저가 속한 팀원정보가 담긴 데이터를 반환하는 함수
     * 내부 주석들을 참고
     */
    async filteredTeamMate() {
      const observerData = this.$store.state.matchesData[this.page - 1]
      const dataSet = JSON.parse(JSON.stringify(observerData))
      const rostersArray = {}
      const participantId = {}
      let matchIndexId = []
      let rosterInUserIndex = []
      let allTeamPlayerPartiId = {}
      let teamHeadCount = []
      // 게임데이터가 있는 유저들을 모두 순회하기 위한 for in
      for(let user in dataSet) {

        // 내부에서 가공될 데이터의 변수들을 초기화
        allTeamPlayerPartiId[user] = allTeamPlayerPartiId[user] || [] 
        participantId[user] = participantId[user] || []
        matchIndexId = []
        rostersArray[user] = rostersArray[user] || []
        teamHeadCount[user] = teamHeadCount[user] || []

        // 유저가 플레이한 횟수만큼 씩 반복시킴
        for(let i = 0; i < dataSet[user].length; i++) {
          // 해당 반복문에서 유저의 included의 모든 데이터,
          // included 내 type의 따라 participant, roster의 목록을 분리하여
          // 변수에 담아둠
          let includedData = dataSet[user][i].included
          let participant = includedData.filter(obj => 
            obj.type === 'participant'
          )
          let rosters = includedData.filter(obj => 
            obj.type === 'roster'
          )

          // 아래 for문을 통해 유저의 정보가 담긴 participant 데이터를 찾고
          // 해당 인덱스를 통해서 유저의 participant의 고유 id값을 얻어낸다.
          for(let k = 0; k < participant.length; k++) {
            if(participant[k].attributes.stats.name === user) {
              matchIndexId.push(participant[k].id)
            }
          }
          let realIndex = includedData.findIndex(el => el.id === matchIndexId[i])
          let partiObj = includedData[realIndex]
          for (let key in partiObj) {
            if(key === 'id') {
              participantId[user].push(partiObj[key]) 
            }
          }

          // 아래 for 문은 윗쪽에서 변수에 담아 둔 rosters 리스트와 유저의 participant ID를 통해
          // 유저가 속한 rosters정보를 찾고, 내부에 담겨있는 모든 팀원들의 participant ID를 획득 
          for(let j = 0; j < rosters.length; j++) {
            let rostersInData = rosters.map(el => el.relationships.participants.data)
            let findItem = rostersInData[j].find(el => el.id === participantId[user][i])
            if(findItem) {
              rosterInUserIndex.push(j)
              allTeamPlayerPartiId[user].push(rosters[j].relationships.participants.data)
              teamHeadCount[user].push(rosters[j].relationships.participants.data.length)
            }
          }
        }
      }
      return {allTeamPlayerPartiId, teamHeadCount}
    },
    
    /**
     * 
     * @param {*} userObj 
     * userObj는 filterTeamMate함수에서 반환된 유저의 모든 파티원 목록과
     * 플레이한 팀의 인원수를 가지고 있음
     * 해당 함수는 전달 받은 파라미터를 기준으로 유저의 팀원이였던 플레이어의
     * 스팀ID를 찾아서 변수에 담고, 파라미터에서 들어온 유저 팀원의 카운트를 변수에
     * 담아서 다시 반환한다.
     */
    async findFilterName(userObj) {
      const observerData = this.$store.state.matchesData[this.page - 1]
      const dataSet = JSON.parse(JSON.stringify(observerData))
      let participantList = []
      let partiMemberNames = []
      let teamHeadCount = []
      for(let user in dataSet) {
        participantList[user] = participantList[user] || []
        partiMemberNames[user] = partiMemberNames[user] || []
        
        // 유저가 플레이한 횟수만큼 씩 반복시킴
        for(let i = 0; i < dataSet[user].length; i++) {
          
          // 해당 반복문에서 유저의 included의 모든 데이터,
          // included 내 type의 따라 participant, roster의 목록을 분리하여
          // 변수에 담아둠
          let includedData = dataSet[user][i].included
          let parti = includedData.filter(obj => 
            obj.type === 'participant'
          )
          participantList[user].push(parti)
        }
        let userData = userObj.allTeamPlayerPartiId[user]
        teamHeadCount = userObj.teamHeadCount 
        let id = {}
        userData.forEach((element) => {
          element.forEach(obj => {
            id = obj.id
            const mainArrary = participantList[user]
            mainArrary.forEach(subArray => {
              subArray.forEach(obj => {
                if(obj.id === id) {
                  partiMemberNames[user].push(obj.attributes.stats.name)
                }
              })
            })
          })
        });
      }
      return {partiMemberNames, teamHeadCount}
    },

    /**
     * 
     * @param {*} obj1 
     * @param {*} obj2
     * 
     * 해당 함수는 처음 필터랭했던 매치정보를 담은 객체와
     * 팀원정보가 들어있는 객체를 파라미터로 받고,
     * 두개의 데이터를 하나로 합쳐 반환한다.
     */
    async mergeData(obj1, obj2) {      
      for(const key in obj2.partiMemberNames) {
        obj1[key].team = obj2.partiMemberNames[key]
      }
      for(const key in obj2.teamHeadCount) {
        obj1[key].teamCount = obj2.teamHeadCount[key]
      }

      let parserObj = JSON.parse(JSON.stringify(obj1))
      return parserObj
    },

    /**
     * 
     * @param {*} data
     * mergeData 에서 반환된 객체를 파라미터로 받아서
     * 화면에서 사용자에게 보여줄 데이터로 포매팅한다.
     * vuetify2버전의 dataTable Ui에서 item에 사용될 수 있는
     * 형태로 포매팅시켜서 반환하는 함수 
     */
    async setFormattedData(data) {
      const formattedData = []

      const objToArray = Object.entries(data)

      objToArray.forEach(el => {
        let arrayName = el[0]
        formattedData[arrayName] = []

        for(let index = 0; index < el[1].date.length; index++) {
          const date = el[1].date[index]
          const map = el[1].map[index]
          const mode = el[1].mode[index]
          let team = null
          let startIndex = index == 0 ? 0 : startIndex + el[1].teamCount[index]  
          let endIndex = index == 0 ? el[1].teamCount[index] : endIndex + el[1].teamCount[index]
          
          team = el[1].team.slice(startIndex, endIndex).join(", ")

          formattedData[arrayName].push({
            date : dayjs(date).format("YYYY-MM-DD") || '',
            map : this.mapNameToKorean(map),
            mode : mode === "ibr" ? "인텐스 배틀로얄" : mode,
            team : team === null ? "팀원을 확인할 수 없습니다" : team
          })
        }
      })
      return formattedData
    },

    mapNameToKorean(engName) {
      switch (engName) {
        case "Desert_Main":
          return "미라마"
        case "DihorOtok_Main":
          return "비켄디"
        case "Erangel_Main":
          return "에란겔"
        case "Baltic_Main":
          return "에란겔"
        case "Range_Main":
          return "캠프 자칼"
        case "Savage_Main":
          return "사녹"
        case "Summerland_Main":
          return "카라킨"
        case "Tiger_Main":
          return "태이고"
        case "Neon_Main":
          return "론도"
        case "Chimera_Main":
          return "파라모"
        case "Heaven_Main":
          return "헤이븐"
        case "Kiki_Main":
          return "데스턴"
      }
    },

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