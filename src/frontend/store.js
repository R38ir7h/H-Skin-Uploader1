import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
      /**
       * Аккаунт пользователя в сервисе
       */
      user: null,

      /**
       * Метка проверки сервера
       */
      server: true,
  },
  mutations: {
    SET_USER: (state, payload) => {
        state.user = payload;
    },

    SET_SERVER: (state, payload) => {
      state.server = payload;
    }
  },
  actions: {
    async FETCH_USER(context) {
      const result = await webApi.emit('user get');
      if (!result && !window.location.href.includes('/auth')) {
        window.location.href = '/auth';
      }
      context.commit('SET_USER', result);
    },
    async FETCH_SERVER(context) {
      const result = await webApi.emit('server check');
      context.commit('SET_SERVER', +result);
    }
  },
  getters: {
    USER: ({ user }) => user,
    SERVER: ({ server }) => server
  }
});

