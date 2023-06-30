<template lang='pug'>
    v-container(fill-height)
      v-row(align='center' justify='center' no-gutters)
        v-icon(style='font-size: 180px' color='#4a76a8' @click='startAuth()') mdi-vk
</template>

<script>
export default {
  async mounted() {
  },
  computed: {
  },
  data: () => ({
  }),
  methods: {
    /**
     * Перейти к авторизации
     */
    startAuth() {
      window.location.href = '/auth/vkontakte';
    }
  },
};
</script>
<style>
  p {
      margin: 0 !important;
  }
</style>
