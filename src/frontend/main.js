import 'vuetify/dist/vuetify.min.css';

import App from '@frontend/main.vue';
import Auth from '@frontend/components/auth.vue';
import View from '@frontend/components/viewer.vue';

import Vue from 'vue';
import Vuetify from 'vuetify'
import Store from './store';
import Clipboard from 'v-clipboard';
import IO from 'socket.io-client';
import WebApi from 'osmium-webapi';
import VueRouter from 'vue-router';

Vue.use(Vuetify);
Vue.use(Clipboard);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [{ 
    path: '/panel/view',
    component: View,
  }, {
    path: '/auth',
    component: Auth
  }],
});

window.webApi = new WebApi.WebApiClient(IO('/'));
window.router = router;
new Vue({
  vuetify: new Vuetify({}),
  router,
  store: Store,
  render: (h) => h(App),
  async mounted() {
    await window.webApi.ready();

    // @ts-ignore
    this.$children[0].webApi = {};
    // @ts-ignore
    this.$children[0].webApi = window.webApi;

    // @ts-ignore
    if (this.$children[0].webApiReady) {
      // @ts-ignore
      this.$children[0].webApiReady();
    }
  },
}).$mount('#app');
