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
    matchesData : [],
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
    onMatchesData(state, matchInfor) {
      state.matchesData = matchInfor;
    },
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
})