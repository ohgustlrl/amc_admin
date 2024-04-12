<template>
  <div>
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
    <v-banner
      outlined
      rounded
      shaped
      single-line
    >
      <v-icon
        slot="icon"
        color="primary"
        size="36"
      >
        mdi-account-cog
      </v-icon>
        일반회원 관리 목록
    </v-banner>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="memberList"
      :search="search"
      hide-default-footer
      :page.sync="page"
      :items-per-page="itemsPerPage"
      @page-count="pageCount = $event"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
        <v-row>총 인원 : {{ memberList.length }}명</v-row>
          <v-spacer></v-spacer>
          <template class="d-flex flex-row justify-end pa-0">
            <v-col
              class="d-flex flex-column mb-2"
              sm="2"
            >
              <v-select
                v-model="rowPerList"
                :items = "items"
                label="개수"
                dense
                outlined
                hide-details
                @change="itemsPerPage = parseInt($event, 10)"
              ></v-select>
            </v-col>
          </template>
          <v-btn
            color="primary"
            dark
            class="mb-2 mr-2"
            @click="getDiscordMemberList()"
          >
            멤버 업데이트
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[getItemControl()]="{ item }" >
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        데이터가 없습니다.
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        class="my-4"
        :length="pageCount"
        :total-visible="6"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
// import firebase from '@/plugins/firebase'
// import {getFirestore, doc, setDoc, deleteDoc} from 'firebase/firestore/lite'
// import {getDiscordMemberListAPI} from '../../API/discord'
import dayjs from 'dayjs'

Vue.use(Vuex)
Vue.config.devtools = true

export default {
  name: "Member-list",
  component() {
    dayjs
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      search: '',
      dcMemberList : null,
      memberList : null,
      mercenaryList : null,
      headers: [
        { text: '닉네임', align: 'start', value: 'name' },
        { text: '성별', align: 'start', value: 'sex' },
        { text: '나이',  align: 'start', value: 'age' },
        { text: '스팀 아이디', align: 'start', value: 'steamid' },
        { text: '디코ID', align:'start', value: 'discordid' },
        { text: '수정/삭제', align: 'start',  value: 'actions', sortable: false },
      ],
      discordMemberList : {},
      items: ['5', '10', '15', '100'],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      rowPerList: '10',
      searchLoading : false,
      isHide : false,

    };
  },
  computed: {

  },

  watch: {

  },

  created() {
    this.getMembers()
  },

  mounted() {
  },

  methods: {
    async getMembers() {
      this.memberList = this.$store.state.memberList
    },

    // async getDiscordMemberList() {
    //   this.showLoading()
    //   this.dcMemberList = await getDiscordMemberListAPI();
    //   const currentDate = new Date()
    //   const timestamp = currentDate.getTime()

    //   let firstData = await this.firstFomatting()
    //   console.log("반환리스트", firstData)
    //   let {member, mercenary} = await this.secondFomtting(firstData)
    //   this.hideLoading()

    // },

    // async firstFomatting() {
    //   let formatting = {}
    //   let list = this.dcMemberList
      
    //   list.forEach(user => {
    //     if(user.nickname !== null ) {
    //       let userNickName = user.displayName
    //       let splittedName = userNickName.split('/')
    //       let name = splittedName[0]  
    //       let sex = splittedName[1]
    //       let age = splittedName[2]
    //       let steamid = splittedName[3]
    //       let discordid = user.userId
    //       let joinedTimeStamp = user.joinedTimestamp
    //       let roles = user.roles
    //       let isAdmin = roles.filter(value => value == '478933666266087436')
    //       let admin
    //       if(isAdmin.length > 0) {
    //         admin = "TRUE"
    //       } else {
    //         admin = "FALSE"
    //       }
          
    //       formatting[user.userId] = {
    //         age : age,
    //         discordid : discordid,
    //         name : name,
    //         sex : sex,
    //         steamid : steamid,
    //         join : dayjs(joinedTimeStamp).format('YY.MM.DD'),
    //         manager : admin
    //       }
    //     }
    //   });
    //   return formatting
    // },
    // async secondFomtting(formatting) {
    //   let list = formatting
    //   let bot = []
    //   let member = []
    //   let mercenary = []

    //   for(const key in list) {
    //     if(list[key].age === undefined ) {
    //       bot.push( {name : list[key].name })
    //     } else if (
    //         list[key].steamid !== undefined && list[key].steamid.includes('지인') 
    //         || 
    //         list[key].steamid == undefined && list[key].sex.includes('지인')
    //       ) {
    //       mercenary[list[key].discordid] = {
    //         age : list[key].age == !Number(list[key].age) ? '알수없음' : list[key].age,
    //         discordid : list[key].discordid,
    //         name : list[key].name
    //       }
    //     } else {
    //       member[list[key].discordid] = {
    //         age : list[key].age,
    //         discordid : list[key].discordid,
    //         name : list[key].name,
    //         sex : list[key].sex,
    //         steamid : list[key].steamid
    //       }
    //     }   
    //   }
    //   return {member, mercenary}
    // },
    // setUpdateMembersDB(member) {
    //   const db = getFirestore(firebase)
    //   const collectionName = 'members'

    //   db.collection(collectionName).get()
    //     .then(querySnapshot => {
    //       console.log("이게 에러인가?",querySnapshot)
    //       const deletePromises = [];
    //       querySnapshot.forEach(doc => {
    //         deletePromises.push(doc.ref.delete())
    //       })

    //       return Promise.all(deletePromises)
    //     })
    //     .then(() => {
    //       return db.collection(collectionName).add(member)
    //     })
    //     .then(() => {
    //       alert("멤버데이터가 업데이트 됐습니다.")
    //     })
    //     .catch(error => {
    //       console.error("데이터 처리 중 에러가 발생했습니다.",error)
    //     })
    // },
    // setUpdateMercenaryDB(mercenary) {
    //   const db = getFirestore(firebase)
    //   const collectionName = 'mercenary'

    //   db.collection(collectionName).get()
    //     .then(querySnapshot => {
    //       const deletePromises = [];
    //       querySnapshot.forEach(doc => {
    //         deletePromises.push(doc.ref.delete())
    //       })

    //       return Promise.all(deletePromises)
    //     })
    //     .then(() => {
    //       return db.collection(collectionName).add(mercenary)
    //     })
    //     .then(() => {
    //       alert("용병데이터가 업데이트 됐습니다.")
    //     })
    //     .catch(error => {
    //       console.error("데이터 처리 중 에러가 발생했습니다.",error)
    //     })
    // },
    // setLastUpdateDB(timestamp) {
    //   const db = getFirestore(firebase)
    //   const collectionName = 'timestamp'

    //   db.collection(collectionName).get()
    //     .then(querySnapshot => {
    //       const deletePromises = [];
    //       querySnapshot.forEach(doc => {
    //         deletePromises.push(doc.ref.delete())
    //       })

    //       return Promise.all(deletePromises)
    //     })
    //     .then(() => {
    //       return db.collection(collectionName).add(timestamp)
    //     })
    //     .then(() => {
    //       alert("마지막 업데이트 일자가 업데이트 됐습니다..")
    //     })
    //     .catch(error => {
    //       console.error("데이터 처리 중 에러가 발생했습니다.",error)
    //     })
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
</style>