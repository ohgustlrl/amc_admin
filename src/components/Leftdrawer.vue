<template>
  <v-navigation-drawer
      v-model="$store.state.drawer"
      width="300"
      app
      temporary
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="../assets/logo.jpg" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              AMC ADMIN
            </v-list-item-title>
            <v-list-item-subtitle>
              pubg apple mango clan admin
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list nav>
        <v-list-item link :to="{ path: '/home'}" color="primary">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title style="text-align:left">
              홈
          </v-list-item-title>
          <v-list-item-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-group
          :value="true"
        >
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon>mdi-account-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title  style="text-align:left">
              회원관리
            </v-list-item-title>
          </template>
          <template>
            <v-list-item :to="{ path: '/managerlist' }" color="primary">
              <v-list-item-title>
                운영진
              </v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ path: '/memberlist' }" color="primary">
              <v-list-item-title>
                일반회원
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list-group>
        <v-list-item link :to="{ path: '/record'}">
          <v-list-item-icon>
            <v-icon>mdi-magnify</v-icon>
          </v-list-item-icon>
          <v-list-item-title  style="text-align:left">
              전적조회
          </v-list-item-title>
          <v-list-item-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item link :to="{ path: '/scheduler'}">
          <v-list-item-icon>
            <v-icon>mdi-calendar-month</v-icon>
          </v-list-item-icon>
          <v-list-item-title  style="text-align:left">
              스케쥴러
          </v-list-item-title>
          <v-list-item-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item link :to="{ path: '/notice'}">
          <v-list-item-icon>
            <v-icon>mdi-note</v-icon>
          </v-list-item-icon>
          <v-list-item-title  style="text-align:left">
              게시판
          </v-list-item-title>
          <v-list-item-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'Left_drawer',

    data() {
      return {
        selectedItem: 1
      }
    },
  }
</script>

<style scoped>
 .v-responsive {
   position: absolute;
 }
</style>