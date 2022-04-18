<template>
  <div>
    <template>
      <v-banner
        outlined
        rounded
        shaped
        single-line
        mb="2"
      >
        <v-icon
          slot="icon"
          color="primary"
          size="36"
        >
          mdi-record-rec
        </v-icon>
          전적조회
      </v-banner>
    </template>
    <v-row>
      <v-col
        class="d-flex justify-end align-center"
      >
        <v-btn
          color="primary"
          elevation="2"
          large
          @click="search"
        >일괄 검색</v-btn>
      </v-col>  
    </v-row>
    <v-data-table
      :headers="recodHeaders"
      :items="members"
      item-key="name"
      show-expand
      class="elevation-1"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      @page-count="pageCount = $event"
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          More info about {{ item.name }}
        </td>
      </template>
    </v-data-table>
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div>
  </div> 
</template>

<script>
import { apikey } from '../pubgClientConfig'

export default {
  name: "record_search",

  data() {
    return {
      members: [],
      divisionMembers: [],
      membersIds: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      recodHeaders: [
          { text: '닉네임', align: 'start', value: 'name', sortable: false },
          { text: '14일 이내 게임 활동', value: 'calories', sortable: false },
          { text: '클랜원과의 게임 활동', value: 'fat', sortable: false },
        ],
      matchid : [],
      userId : {},
      baseUrl : 'https://api.pubg.com/shards/steam/'
    }
  },
  created() {
    this.getMembers();
    this.membersArrayDivision();
  },
  computed: {
  },
  methods: {
    async search() {
      this.getMembersIds();1
      await this.$axios.get(this.baseUrl+'players?filter[playerNames]='+
          this.membersIds[0]+','+
          this.membersIds[1]+','+
          this.membersIds[2]+','+
          this.membersIds[3]+','+
          this.membersIds[4]+','+
          this.membersIds[5]+','+
          this.membersIds[6]+','+
          this.membersIds[7]+','+
          this.membersIds[8]+','+
          this.membersIds[9], {
        headers : {
          'Accept': 'application/vnd.api+json',
          'Authorization': apikey
        }
      })
        .then(res => {
          this.userId = res.data.data[0].relationships.matches.data
          this.$store.commit("onUserIdData", this.userId)
          this.membersIds = [];
          // this.matchesData();
        })
    },

    async matchesData() {
      this.matchid = this.$store.state.playerNames
      for(let i = 0; i <= this.matchid.length; i++) {
        await this.$axios.get(this.baseUrl + 'matches/' + this.matchid[i].id, {
          headers : {
            'accept': 'application/vnd.api+json',
          }
        })
          .then(res => {
            console.log(res)
          })
      }
        // this.$axios.get(this.baseUrl + 'matches/' + item[index].id, {
        //   headers : {
        //     'accept': 'application/vnd.api+json',
        //   }
        // })
        //   .then(res => {
        //     console.log(res)
        //   })
      // this.$axios.get(this.baseUrl + 'matches/' + this.matchid, {
      //     headers : {
      //       'accept': 'application/vnd.api+json',
      //     }
      //   })
      //     .then(res => {
      //       this.matchInfor = res.data.data.attributes
      //       console.log(this.matchInfor)
      //       this.$store.commit("onMatchesData", this.matchInfor)
      //     })
    },
    getMembers() {
      this.members = this.$store.state.memberList
    },
    membersArrayDivision() {
      const size = 10;
      for(let i = 0; i < this.members.length; i += size) {
        this.divisionMembers.push(this.members.slice(i, i+size));
      }   
    },
    getMembersIds() {
      for(let i = 0; i < this.divisionMembers[this.page -1].length; i++) {
        this.membersIds.push(this.divisionMembers[this.page - 1][i].steamid);
      }
    }
  }
};
</script>