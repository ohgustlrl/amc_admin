<template>
  <v-container>
    <AppBar />
    <router-view />
    <Footer />
  </v-container>
</template>

<script>
import firebase from '@/plugins/firebase'
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore/lite'
import AppBar from '../components/Appbar.vue'
import Footer from '../components/Footer.vue' 
// @ is an alias to /src
export default {
  props: ['user'],
  name: 'MainPage',
  components: {
    AppBar,
    Footer,
  },
  created() {
    this.getInitMembers();
    this.getManagerList();
    this.getParamData();
  },
  methods: {
    getParamData() {
      const params = this.$props.user
      console.log(params)
    },
    async getInitMembers() {
      try {
        const db = getFirestore(firebase)
        const memberCol = collection(db, 'members');
        const memberSnapShot = await getDocs(memberCol);
        const memebers = memberSnapShot.docs.map(doc => doc.data())  
        this.$store.commit('onMemberList', memebers)
      } catch (error) {
        console.error(error)
      }
    },

    async getManagerList() {
      try {
        const db = getFirestore(firebase)
        const memberCol = collection(db, 'members');
        const q = query(memberCol, where("manager", "==", "TRUE"))
        const memberSnapShot = await getDocs(q);
        const managerList = memberSnapShot.docs.map(doc => doc.data())
        this.$store.commit('onManagerList', managerList)  
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
