import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
Vue.config.devtools = true


export const store = new Vuex.Store({

  state: {
    drawer: false,
    loading: false,
    memberList: [],
    managerList: [],
    playerNames : {},
    matchData : [],
  },
  getters: {

  },
  mutations: {
    onToggleDrawer(state) {
      state.drawer = !state.drawer;
    },
    setUserInfo(state, user) {
      state.userInfo = user;
    },
    delUserInfo(state) {
      state.userInfo = undefined;
    },
    onloading(state) {
      state.loading = !state.loading;
    },
    onUserIdData(state, userId) {
      state.playerNames = userId;
    },
    onMatchesData(state, matchInfor) {
      state.matchData = matchInfor;
    },
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
})