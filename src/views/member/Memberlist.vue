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
        일반회원 목록
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
        </v-toolbar>
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
  props: ['memberListProps'],
  data() {
    return {
      search: '',
      headers: [
        { text: '닉네임', align: 'start', value: 'name' },
        { text: '성별', align: 'start', value: 'sex' },
        { text: '나이',  align: 'start', value: 'age' },
        { text: '스팀 아이디', align: 'start', value: 'steamid' },
        { text: '디코ID', align:'start', value: 'discordid' },
        { text: '수정/삭제', align: 'start',  value: 'actions', sortable: false },
      ],
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