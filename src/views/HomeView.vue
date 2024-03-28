<template>
  <div class="home" />
</template>

<script>
import firebase from '@/plugins/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'
// @ is an alias to /src
export default {
  name: 'HomeView',
  components: {

  },
  created() {
    this.getInitMembers();
  },
  methods: {
    async getInitMembers() {
      const db = getFirestore(firebase)
      const memberCol = collection(db, 'members');
      const memberSnapShot = await getDocs(memberCol);
      const memebers = memberSnapShot.docs.map(doc => doc.data())
      this.$store.commit('onMemberList', memebers)
    }
  }
}
</script>
