<template lang='pug'>
    v-app#app(style='background-color: whitesmoke')
      v-container
        v-row(v-if='user' align='start' justify='center' no-gutters)
          // В левом верхнем углу
          v-col.pa-2(cols='6')     
            // Профиль человека 
            profile

            // Его залитые картинки
            my-icons.mt-2
            

          v-col.pa-2(cols='6')
            // Загрузка нового скина      
            uploader
</template>

<script>
  import { mapGetters } from 'vuex'; 
import Profile from './profile.vue';
import MyIcons from './myIcons.vue';
import Uploader from './uploader.vue';

export default {
  components: {
    Profile,
    MyIcons,
    Uploader
  },

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
  },
};
</script>
<style>
  p {
      margin: 0 !important;;
  }
</style>
