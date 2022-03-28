import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    editable:true,
    fireUser:null
  },
  mutations: {
    setEdit(state,edit){
      state.editable = edit
    },
    setFireUser(state,fireU){
      state.fireUser = fireU
    }
  },
  actions: {
  },
  modules: {
  }
});