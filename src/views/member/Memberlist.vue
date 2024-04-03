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
            디스코드 멤버 업데이트
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
import firebase from '@/plugins/firebase'
import {getFirestore, doc, setDoc, deleteDoc} from 'firebase/firestore/lite'
import {getDiscordMemberListAPI} from '../../API/discord'

Vue.use(Vuex)
Vue.config.devtools = true

export default {
  name: "Member-list",

  data() {
    return {
      dialog: false,
      dialogDelete: false,
      search: '',
      dcMemberList : null,
      memberList : null,
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
      editedIndex: -1,
      editedItem: {
        name:'',
        sex:'',
        age:0,
        steamid:'',
        manager: 'false',
        discordid:'',
      },
      defaultItem: {
        name: '',
        sex: '',
        age: 0,
        steamid: '',
        manager: 'false',
        discordid:'',
      },
      Rules: [
        value => !!value || '필수항목'
      ],
      sexRules: [
        value => !!value || '필수항목',
        value => (value === '남') || (value === '여') || '성별이 이상하다?'
      ],
      ageRules: [
        value => !!value || '필수항목',
        value => value >= 25 || '나이가 적다 생각하지 않음?',
        value => value <= 65 || '나이가 많다 생각하지 않음?'
      ],
      dicoRules: [
        value => !!value || '나중에 수정 안되니깐 정확히 입력해야 함',
        value => /^[0-9]*$/.test(value) || '숫자만입력 가능함',
      ],
    };
  },
  computed: {
    formTitle () {
        return this.editedIndex === -1 ? '신규 등록' : '수정 등록'
      },
  },

  watch: {
    dialog (val) {
        val || this.close()
      },
    dialogDelete (val) {
      val || this.closeDelete()
    },
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
    
    editItem (item) {
      this.editedIndex = this.$store.state.memberList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.$store.state.memberList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
      
    },

    deleteItemConfirm () {
      const db = getFirestore(firebase)
      const deleteId = this.editedItem.discordid
      const deleteRef = doc(db, 'members', deleteId)
      try {
          deleteDoc(deleteRef)
        } catch (e) {
          console.log(e)
        } finally {
          this.getMembers();
          this.$store.state.memberList.splice(this.editedIndex, 1)
          this.closeDelete()
        }
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save () {
      const db = getFirestore(firebase)
      const docuid = this.editedItem.discordid
      try {
        await setDoc(doc(db, "members", docuid), {
          name: this.editedItem.name,
          sex: this.editedItem.sex,
          age: this.editedItem.age,
          steamid:this.editedItem.steamid,
          manager: this.editedItem.manager,
          discordid:this.editedItem.discordid
        }, {merge: true});
      } catch {
        alert('권한이 필요한 작업입니다.')
      } finally {
        this.getMembers();
        this.close();
      }
    },
    getItemControl() {
      return `item.actions`
    },

    async getDiscordMemberList() {
      this.dcMemberList = await getDiscordMemberListAPI();
      console.log("디코 멤버 리스트", this.dcMemberList)
    },
  },
};
</script>

<style scoped>
</style>