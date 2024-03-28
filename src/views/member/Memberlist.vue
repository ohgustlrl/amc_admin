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
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                신규 등록
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.name"
                        label="닉네임"
                        :rules = "Rules"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.sex"
                        label="성별"
                        :rules = "sexRules"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.age"
                        label="나이"
                        :rules = "ageRules"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.steamid"
                        label="스팀 아이디"
                        :rules = "Rules"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.discordid"
                        label="디스코드 아이디"
                        :rules = "dicoRules"
                        :disabled = 'editedIndex > -1 ? true : false'
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <label>운영진 여부</label>
                      <v-radio-group v-model="editedItem.manager" row style="margin:0; padding:0;">
                        <v-radio
                          label="Y"
                          value='true'
                        ></v-radio>
                          <v-radio
                          label="N"
                          value='false'
                        ></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  취소
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  저장
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">정말로 삭제하시겠습니까?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">취소</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">삭제</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
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

Vue.use(Vuex)
Vue.config.devtools = true

export default {
  name: "Member-list",

  data() {
    return {
      dialog: false,
      dialogDelete: false,
      search: '',
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
    }
  },
};
</script>

<style scoped>
</style>