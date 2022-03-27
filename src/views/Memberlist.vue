<template>
  <div>
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
      sort-by="nickname"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>클랜원 리스트</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          >
          </v-divider>
          <v-spacer></v-spacer>
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
                        v-model="editedItem.nickname"
                        label="닉네임"
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
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.kakaoid"
                        label="카카오 아이디"
                      ></v-text-field>
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
        <v-btn
          color="primary"
          @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </div>  
</template>

<script>
export default {
  name: "Member-list",

  data() {
    return {
      dialog: false,
      dialogDelete: false,
      loading: true,
      search: '',
      headers: [
        {
          text: '닉네임',
          align: 'end',
          sortable: false,
          value: 'nickname',
        },
        { text: '성별', align: 'end', value: 'sex' },
        { text: '나이',  align: 'end', value: 'age' },
        { text: '스팀 아이디', align: 'end', value: 'steamid' },
        { text: '카카오 아이디', align: 'end',  value: 'kakaoid' },
        { text: '수정/삭제', align: 'end',  value: 'actions', sortable: false },
      ],
      memberList: [],
      editedIndex: -1,
      editedItem: {
        nickname: '',
        sex: '',
        age: '',
        steamid: '',
        kakaoid: '',
      },
      defaultItem: {
        nickname: '',
        sex: '',
        age: 0,
        steamid: '',
        kakaoid: '',
      },
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
    this.initialize()
  },

  methods: {
    initialize () {
      // for (let i = 1; i <= 100; i++) {
      //   this.memberList.push({
      //     nickname: '현시기',
      //     sex: '남',
      //     age: 37,
      //     steamid: 'ohgustlrl',
      //     kakaoid: 'fps_tjr',
      //   })
      // }
      this.memberList.push({
          nickname: '현시기',
          sex: '남',
          age: 37,
          steamid: 'ohgustlrl',
          kakaoid: 'fps_tjr',
      },
      {
          nickname: '달콤',
          sex: '남',
          age: 37,
          steamid: 'ohgustlrl',
          kakaoid: 'fps_tjr',
      },
      {
          nickname: '새콤',
          sex: '남',
          age: 37,
          steamid: 'ohgustlrl',
          kakaoid: 'fps_tjr',
      },
      {
          nickname: '영이',
          sex: '남',
          age: 37,
          steamid: 'ohgustlrl',
          kakaoid: 'fps_tjr',
      },
      {
          nickname: '프덕',
          sex: '남',
          age: 37,
          steamid: 'ohgustlrl',
          kakaoid: 'fps_tjr',
      },
      {
          nickname: '현이',
          sex: '남',
          age: 37,
          steamid: 'ohgustlrl',
          kakaoid: 'fps_tjr',
      },
      {
          nickname: '슬이',
          sex: '남',
          age: 37,
          steamid: 'ohgustlrl',
          kakaoid: 'fps_tjr',
      },
      {
          nickname: '장그래',
          sex: '남',
          age: 37,
          steamid: 'ohgustlrl',
          kakaoid: 'fps_tjr',
      },
      {
          nickname: '제티',
          sex: '남',
          age: 37,
          steamid: 'ohgustlrl',
          kakaoid: 'fps_tjr',
      },)
    },

    editItem (item) {
      this.editedIndex = this.memberList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.memberList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.memberList.splice(this.editedIndex, 1)
      this.closeDelete()
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

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.memberList[this.editedIndex], this.editedItem)
      } else {
        this.memberList.push(this.editedItem)
      }
      this.close()
    },
    getItemControl() {
      return `item.actions`
    }
  },
};
</script>
