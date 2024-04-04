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
    managerList: null,
    matchesData : [],
    searchedPages : {},
    login : false,
    userInfo : undefined,
    isGetDataLoading : false,
  },
  getters: {
    matchesData : state => {
      return state.matchesData
    }
  },
  mutations: {
    onToggleDrawer(state, boolean) {
      state.drawer = boolean;
    },
    setUserInfo(state, user) {
      state.userInfo = user;
    },
    delUserInfo(state, data) {
      state.userInfo = data;
    },
    onLogin(state, boolean) {
      state.login = boolean
    },
    onloading(state, boolean) {
      state.loading = boolean;
    },
    onMemberList(state, data) {
      state.memberList = data
    },
    onMatchesData(state, matchInfor) {
      state.matchesData.push(matchInfor);
    },
    onSearchedPage(state, data) {
      state.searchedPages = { ...state.searchedPages, ...data };
    },
    onManagerList(state, data) {
      state.managerList = data
    },
    onIsGetDataLoading(state, boolean) {
      state.isGetDataLoading = boolean
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