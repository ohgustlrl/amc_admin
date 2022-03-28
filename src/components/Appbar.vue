<template>
  <div>
    <v-app-bar
      app
      color="#fff"
      fixed
      height="78"
    >
      <v-app-bar-nav-icon @click.stop="[(drawer = !drawer)]" />
      <v-avatar
        size="50"
      >
        <img
          alt="Avatar"
          src="../assets/logo.jpg"
        >
      </v-avatar>
      <v-spacer />

      <v-btn icon :to="{ path: '/signin' }">
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
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
        <v-list-item-group>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="{ path: items[i].path }"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.text" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
  export default {
    name: 'AppBar',

    data() {
      return {
        drawer: false,
        items: [
          { text: "홈", path: "/home" },
          { text: "클랜원 목록", path: "/memberlist" },
          { text: "전적검색", path: "/record" },
          { text: "일정", path: "/scheduler" },
          { text: "회의록", path: "/meetinglog" },
        ],
      }
    }
  }
</script>
