<template lang='pug'>
    v-card.pa-4.elevation-0
      p.px-2.font-weight-light.title Мои загруженные иконки
      p.px-2.font-weight-light.subtitle Вы можете просмотреть ранее загруженные иконки, и скопировать их SkinID нажав на них
      v-row(align='start' justify='start' no-gutters)
        template(v-for='(value, index) in user.images.filter(v => v.status != -1)')
          v-col.pa-2(cols='2')
            v-hover(v-slot:default='{ hover }')
              v-card.pa-2.elevation-0(:style='"background-color:" + (value.status == 1 ? "whitesmoke" : "#ff000026") + ";border-radius: 10px;"')
                v-img(
                  :src='value.base64'
                )
                v-overlay(absolute :value='hover')
                  v-bottom-navigation.elevation-0(style='background-color: #FFFFFF00 !important;' color='white')
                    template(v-if='value.status == 1')
                      v-btn(text color='white' x-large v-clipboard="() => value.response")
                        span.font-weight-light Копировать
                        v-icon() mdi-content-copy
                    template(v-if='value.status == 0')
                      v-btn(text color='white' x-large)
                        span.font-weight-light Ошибка
                        v-icon() mdi-close


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
