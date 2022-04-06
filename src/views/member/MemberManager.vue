<template>
  <div>
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
      mdi-shield-crown-outline
    </v-icon>
    운영진 목록
    </v-banner>
    <v-data-table
      :headers="headers"
      :items="this.$store.state.managerList"
      hide-default-footer
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-spacer></v-spacer>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">정말로 삭제하시겠습니까?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text>취소</v-btn>
                <v-btn color="blue darken-1" text >삭제</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:no-data>
        표시할 데이터가 없습니다.
      </template>
    </v-data-table>
  </div>  
</template>

<script>
import firebase from '@/plugins/firebase'
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore/lite'

export default {
  name: "Member-manager",

  data() {
    return {
      dialogDelete: false,
      headers: [
        { text: '닉네임', align: 'start', sortable: false, value: 'name' },
        { text: '성별', align: 'start', value: 'sex' },
        { text: '나이',  align: 'start', value: 'age' },
        { text: '스팀 아이디', align: 'start', value: 'steamid' },
      ],
    };
  },
  computed: {},

  watch: {},

  created() {
    this.getMembers();
  },

  methods: {
    async getMembers() {
      const db = getFirestore(firebase)
      const memberCol = collection(db, 'members');
      const q = query(memberCol, where("manager", "==", "TRUE"))
      const memberSnapShot = await getDocs(q);
      this.$store.state.managerList = memberSnapShot.docs.map(doc => doc.data());
      return
    },
  },
};
</script>
