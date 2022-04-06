import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
Vue.config.devtools = true


export const store = new Vuex.Store({

  state: {
    userInfo: undefined,
    drawer: false,
    loading: false,
    memberList: [],
    managerList: [],
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
  },
    // [events.SIGN_IN](state, user) {
    //   state.userInfo = user;
    //   Vue.$cookies.set('token', user.jwt_token);
    // },
    // [events.SIGN_OUT](state) {
    //   state.userInfo = undefined;
    //   Vue.$cookies.remove();
    //   Vue.$cookies.remove();
  actions: {},
  modules: {},
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
})

