<template lang='pug'>
    v-card.pa-4.elevation-0
        v-row(align='center' justify='start' no-gutters)
            v-avatar.mr-5(
                color='primary'
                size='50'
            )
                img(:src='user.avatar')
            div(cols='auto')
                p.font-weight-regular {{ user.displayName }}
                p.font-weight-light Загружено — 
                    strong {{ user.images.length }} иконок

            v-spacer

            v-bottom-navigation.elevation-0(style='width: auto !important;')
                v-btn(text @click='logout')
                    span.font-weight-light Выход
                    v-icon() mdi-logout-variant
</template>

<script>
import { mapGetters } from 'vuex'; 

export default {
  async mounted() {
  },
  computed: {
    ...mapGetters({
      user: 'USER'
    })
  },
  data: () => ({
  }),
  methods: {
    logout() {
      window.location.href = '/auth/logout';
    },
  },
};
</script>
<style>
  p {
      margin: 0 !important;
  }
</style>
