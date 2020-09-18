import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as Api from "./client/api";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

async function preInitialization() {
  await Api.initialize();
}

preInitialization().then(_ => {
  new Vue({
    router,
    store,
    render: h => h(App),
    created() {
      this.$store.dispatch("INITIALIZE");
    }
  }).$mount("#app");
});
