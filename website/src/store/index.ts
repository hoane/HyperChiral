import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const INITIALIZE = "INITIALIZE";

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    async [INITIALIZE]({ dispatch }) {
      console.debug("Initialized.");
    }
  },
  modules: {}
});
