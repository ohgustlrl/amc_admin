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
    mercenaryList : [],
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
    },
    onMercenaryList(state, data) {
      state.mercenaryList = data
    },
    
    resetState(state) {
      const initialState ={
        drawer: false,
        loading: false,
        memberList: [],
        managerList: null,
        matchesData : [],
        searchedPages : {},
        login : false,
        userInfo : undefined,
        isGetDataLoading : false,
        mercenaryList: [],
      };
      Object.assign(state, initialState)
    }
  },
  actions: {

  },
  modules: {},
  plugins: 
  [
    createPersistedState({
    key: 'vuex',
    storage: window.sessionStorage,
    reducer : (state) => ({
        memberList: state.memberList,
        managerList: state.managerList,
        mercenaryList : state.mercenaryList,
        login : state.login,
        userInfo : state.userInfo,
      })
    }),
    createLogger()
  ],
  strict: process.env.NODE_ENV !== 'production'
})