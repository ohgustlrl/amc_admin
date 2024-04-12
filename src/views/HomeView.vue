<template>
  <v-container fluid :class="[isDashBoard ? 'my-0 py-0 grey lighten-5' : '']">
    <AppBar />
      <v-main>
        <router-view :memberListProps="memberList" :mercenaryListProps="mercenaryList" :managerListProps="managerList" />
      </v-main>
    <Footer />
  </v-container>
</template>

<script>
// import firebase from '@/plugins/firebase'
// import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore/lite'
import {getDiscordMemberListAPI} from '../API/discord'
import dayjs from 'dayjs'
import AppBar from '../components/Appbar.vue'
import Footer from '../components/Footer.vue' 
// @ is an alias to /src
export default {
  name: 'MainPage',
  data() {
    return {
      memberList : [],
      mercenaryList : [],
      managerList : [],
      dcMemberList : null,
    }
  },
  components: {
    AppBar,
    Footer,
  },
  created() {
    this.getDiscordMemberList()
    // this.getInitMembers()
  },
  computed: {
    isDashBoard() {
      return this.$route.name == 'DashBoard' ? true : false
    }
  },
  methods: {
    // async getInitMembers() {
    //   try {
    //     const db = getFirestore(firebase)
    //     const memberCol = collection(db, 'members');
    //     const memberSnapShot = await getDocs(memberCol);
    //     const memebers = memberSnapShot.docs.map(doc => doc.data())  
    //     this.$store.commit('onMemberList', memebers)
    //     this.memberList = this.$store.state.memberList
    //   } catch (error) {
    //     console.error(error)
    //   }
    // },

    // async getManagerList() {
    //   try {
    //     const db = getFirestore(firebase)
    //     const memberCol = collection(db, 'members');
    //     const q = query(memberCol, where("manager", "==", "TRUE"))
    //     const memberSnapShot = await getDocs(q);
    //     const managerList = memberSnapShot.docs.map(doc => doc.data())
    //     this.$store.commit('onManagerList', managerList)  
    //   } catch (error) {
    //     console.error(error)
    //   }
    // },

    async getDiscordMemberList() {
      if(this.$store.state.memberList.length !== 0) {
        this.memberList = this.$store.state.memberList
      } else {
        this.showLoading()
        this.dcMemberList = await getDiscordMemberListAPI();
        // const currentDate = new Date()
        // const timestamp = currentDate.getTime()
  
        let firstData = await this.firstFomatting()
        console.log("반환리스트", firstData)
        let {member, mercenary, managerList} = await this.secondFomtting(firstData)
        console.log("정회원", member)
        console.log("용병", mercenary)
        this.$store.commit('onMemberList', member)
        this.$store.commit('onMercenaryList', mercenary)
        this.$store.commit('onManagerList', managerList)
  
        this.memberList = this.$store.state.memberList
        this.mercenaryList = this.$store.state.mercenaryList
        this.managerList = this.$store.state.managerList
        this.hideLoading()
      }
    },

    async firstFomatting() {
      let formatting = {}
      let list = this.dcMemberList
      
      list.forEach(user => {
        if(user.nickname !== null ) {
          let userNickName = user.displayName
          let splittedName = userNickName.split('/')
          splittedName = splittedName.map(name => name.trim())
          let name = splittedName[0]  
          let sex = splittedName[1]
          let age = splittedName[2]
          let steamid = splittedName[3]
          let discordid = user.userId
          let joinedTimeStamp = user.joinedTimestamp
          let roles = user.roles
          let isAdmin = roles.filter(value => value == '478933666266087436')
          let isMaster = roles.filter(value => value == '483129386204135434')
          let admin
          if(isAdmin.length > 0) {
            admin = "TRUE"
          } else {
            admin = "FALSE"
          }
          let master
          if(isMaster.length > 0) {
            master = "TRUE"
          } else {
            master = "FALSE"
          }
          
          formatting[user.userId] = {
            age : age,
            discordid : discordid,
            name : name,
            sex : sex,
            steamid : steamid,
            join : dayjs(joinedTimeStamp).format('YY.MM.DD'),
            manager : admin,
            master
          }
        }
      });
      return formatting
    },
    async secondFomtting(formatting) {
      let list = formatting
      let bot = []
      let member = []
      let mercenary = []
      let managerList = []

      for(const key in list) {
        if(list[key].age === undefined ) {
          bot.push( {name : list[key].name })
        } else if (
            list[key].steamid !== undefined && list[key].steamid.includes('지인') 
            || 
            list[key].steamid == undefined && list[key].sex.includes('지인')
          ) {
          mercenary.push(
            {
              age : list[key].age == !Number(list[key].age) ? '알수없음' : list[key].age,
              discordid : list[key].discordid,
              name : list[key].name,
              join : list[key].join
            }
          ) 
        } else if(list[key].manager === "TRUE" || list[key].master === 'TRUE') {
          managerList.push({
            age : list[key].age,
            discordid : list[key].discordid,
            name : list[key].name,
            sex : list[key].sex,
            steamid : list[key].steamid,
            join : list[key].join
          })
        } else {
          member.push(
            {
              age : list[key].age,
              discordid : list[key].discordid,
              name : list[key].name,
              sex : list[key].sex,
              steamid : list[key].steamid,
              join : list[key].join
            }
          ) 
        }   
      }
      return {member, mercenary, managerList}
    },
    showLoading() {
      this.isHide = true
    },
    hideLoading() {
      this.isHide = false
    },
  }
}
</script>

<style scoped>

</style>
