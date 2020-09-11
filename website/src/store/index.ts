import Vue from "vue";
import Vuex from "vuex";
import * as Api from "../client/api";
import Cookies from "js-cookie";

Vue.use(Vuex);

const SET_COGNITO_ID = "SET_COGNITO_ID";
const GET_COGNITO_ID = "GET_COGNITO_ID";
const INITIALIZE = "INITIALIZE";

export default new Vuex.Store({
  state: {
    identity: {
      cognitoId: ""
    }
  },
  getters: {
    cognitoId: state => state.identity.cognitoId
  },
  mutations: {
    [SET_COGNITO_ID](state, id) {
      Api.setCognitoId(id);
      Cookies.set("CognitoId", id, { expires: 1 });
      state.identity.cognitoId = id;
    }
  },
  actions: {
    async [GET_COGNITO_ID]({ commit }) {
      const cookie = Cookies.get("CognitoId");
      if (cookie === undefined) {
        const id = await Api.getCognitoId();
        commit(SET_COGNITO_ID, id);
      } else {
        commit(SET_COGNITO_ID, cookie);
      }
    },
    async [INITIALIZE]({ dispatch }) {
      await dispatch(GET_COGNITO_ID);
    }
  },
  modules: {}
});
