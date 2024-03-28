<template>
  <div class="home" />
</template>

<script>
import firebase from '@/plugins/firebase'
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore/lite'
// @ is an alias to /src
export default {
  name: 'HomeView',
  components: {

  },
  created() {
    this.getInitMembers();
    this.getManagerList();
  },
  methods: {
    async getInitMembers() {
      const db = getFirestore(firebase)
      const memberCol = collection(db, 'members');
      const memberSnapShot = await getDocs(memberCol);
      const memebers = memberSnapShot.docs.map(doc => doc.data())
      this.$store.commit('onMemberList', memebers)
    },

    async getManagerList() {
      const db = getFirestore(firebase)
      const memberCol = collection(db, 'members');
      const q = query(memberCol, where("manager", "==", "TRUE"))
      const memberSnapShot = await getDocs(q);
      const managerList = memberSnapShot.docs.map(doc => doc.data())
      this.$store.commit('onManagerList', managerList)
    }
  }
}
</script>
