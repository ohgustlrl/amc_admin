<template>
  <div>
    <v-overlay :class="isHide === false ? 'd-none' : ''">
      <template>
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        >
        </v-progress-circular>
        <span>데이터를 조회중 입니다.</span>
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
    <v-card-title class="d-flex-jc-between">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        clearable="true"
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
        <v-row>총 인원 : {{ totalMembers }}명</v-row>
          <v-spacer></v-spacer>
          <template class="d-flex flex-row justify-end pa-0">
            <v-col
              class="d-flex"
              sm="2"
            >
              <v-btn
                depressed
                color="primary"
                class="mr-3"
                dense
                @click="setManualUpdateMemberList"
              >
                멤버 수동 업데이트
              </v-btn>
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
        :length="totalPages"
      ></v-pagination>
    </div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title class="text-h5">
            안내
          </v-card-title>
          <v-card-text v-if="dialogCode">에러 코드 : {{ dialogCode }}</v-card-text>
          <v-card-text>{{ dialogMsg }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
            >
              확인
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import {getManualUpadteUserApi} from '../../API/member/getManualUpdateMemberList'
import {getMemberListApi} from '../../API/member/getMemberList'
import dayjs from 'dayjs'

Vue.use(Vuex)

export default {
  name: "Member-list",
  component() {
    dayjs
  },
  data() {
    return {
      search: '',
      headers: [
        { text: '닉네임', align: 'start', value: 'nickName' },
        { text: '성별', align: 'start', value: 'sex' },
        { text: '나이',  align: 'start', value: 'age' },
        { text: '스팀 아이디', align: 'start', value: 'steamNickname' },
        { text: '디코ID', align:'start', value: 'discordId' },
        { text: '서버 입장일', align: 'start',  value: 'joinedAt',},
      ],
      items: ['5', '10', '20', '50'],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      rowPerList: '10',
      searchLoading : false,
      isHide : false,
      memberList : [],
      totalMembers : 0,
      totalPages : 0,
      dialog : false,
      dialogCode : null,
      dialogMsg : null
    };
  },
  computed: {

  },

  watch: {
    rowPerList() {
      this.getMemberList();
    },
    page() {
      this.getMemberList();
    }
  },
  created() {
    this.getMemberList();
  },

  mounted() {
  },

  methods: {
    async setManualUpdateMemberList() {
      const result = await getManualUpadteUserApi();

      if(result.status == 200) {
        this.dialog = true;
        this.dialogMsg = result.msg
        this.getMemberList();
      } else {
        this.dialog = true;
        this.dialogCode = result.code;
        this.dialogMsg = result.msg;
      }
    },

    async getMemberList() {
      this.showLoading();
      let params = {
        page : this.page,
        limit : Number(this.rowPerList),
        search : this.search
      }
      const result = await getMemberListApi(params)

      this.memberList = result.memberList;
      this.totalPages = result.totalPages;
      this.totalMembers = result.totalMembers
      this.pageCount = result.currentPage;
      this.hideLoading();
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
.d-flex-jc-between {
  justify-content: space-between;
}
.w50p_and_non_felx {
  width: 50%;
  flex : initial;
}
</style>