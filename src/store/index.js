import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
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
    searchedPages : [],
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
    onMemberList(state, data) {
      state.memberList = data
    },
    onMatchesData(state, matchInfor) {
      state.matchesData = matchInfor;
    },
    onSearchedPage(state, data) {
      state.searchedPages.push(data)
    }
  },
  actions: {},
  modules: {},
  plugins: 
  [
    createPersistedState({
    key: 'vuex',
    storage: window.sessionStorage,
    reducer : (state) => ({
      drawer : state.drawer,
      loading : state.loading,
      memberList : state.memberList
    })
  }),
  createLogger()
],
  strict: process.env.NODE_ENV !== 'production'
})