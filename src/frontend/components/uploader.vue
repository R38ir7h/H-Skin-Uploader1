<template lang='pug'>
    v-card.pa-4.elevation-0      
      p.px-2.font-weight-light.title Загрузка новых иконок
      p.px-2.font-weight-light.subtitle Нажмите на плюс, и выберите все иконки которые вы хотите загрузить
      v-row.px-1(align='start' justify='start' no-gutters)
        template(v-for='(value, index) in loadingImage.uris')
          v-col.pa-1(cols='2')
            v-card.elevation-0.pa-2(width='100%' height='100%' style='background-color: whitesmoke')
              v-img( 
                :src='value.uri'
                style='opacity: 1'
              )
              v-overlay(absolute :color='value.status == -1 ? "orange lighten-1" : value.status == 0 ? "red lighten-1" : "green lighten-1"')
                template(v-if='value.status == -1')
                  v-progress-circular(indeterminate)
                template(v-if='value.status == 1')
                  v-bottom-navigation.elevation-0(style='background-color: #FFFFFF00 !important;' color='white' v-clipboard="() => value.response")
                    v-btn(text color='white' x-large)
                      span.font-weight-light Копировать
                      v-icon() mdi-content-copy
                template(v-if='value.status == 0')
                  v-icon mdi-close
        v-col.pa-1(cols='2')
          v-card.elevation-0.pa-2(width='100%' height='100%')
            v-img( 
              :src='this.loadingImage.uri ? this.loadingImage.uri : "https://steamuserimages-a.akamaihd.net/ugc/267220742944760540/F9A6C3924DB85EF0362E6D8E1002B95E8A79B134/"'
              style='opacity: 0.5'
            )
            v-overlay(:value='!this.loadingImage.uri' absolute color='green lighten-1')
              v-icon(style='font-size: 100px;' @click='chooseFile()' :disabled='!!this.loadingImage.uris.find(v => v.status == -1)') mdi-plus
      v-divider.ma-4.mx-2
      p.px-2.font-weight-light.title Строгое соответствие правилам
      p.px-2.font-weight-light.subtitle Загружаемые иконки должны быть правильного размера, формата и соответствовать правилам Steam
      v-row(align='start' justify='start' no-gutters)
        v-col(cols='12')
          v-list(two-lines)
            template(v-for='(value, index) in rules')
              v-list-item
                v-list-item-avatar
                  v-icon {{ value.icon }}
                v-list-item-content
                  v-list-item-title {{ value.name }}
                  v-list-item-subtitle {{ value.description }}
        
        input(type="file" accept="image/png" @change='uploadFiles' ref='uploadBox' style='display: none !important;' multiple)

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
    rules: [{
      name: 'Размер изображения должен быть 512х512 px',
      description: 'Изображения других размеров не будут загружены из-за ограничений',
      icon: 'mdi-image-size-select-large'
    }, {
      name: 'Правильный формат',
      description: 'Прозрачный .PNG файл',
      icon: 'mdi-file-image'
    }, {
      name: 'Содержание картинки',
      description: 'Без мата, порнографии, рассизма и прочего',
      icon: 'mdi-steam'
    }],

    loadingImage: {
      uris: [],
      name: ''
    }
  }),
  methods: {
    chooseFile() {
      this.$refs.uploadBox.click();
    },

    /**
     * Загрузка изображений
     */
    async loadImages() {
      const filter = this.loadingImage.uris
        .filter(async (v) => v.status == -1);

      for(let i = 0; i < filter.length; i++) {
        const v = filter[i];

        const reader = new FileReader();
        reader.readAsDataURL(v.blob);

        reader.onloadend = async () => {
          const base64 = reader.result;

          const result = await webApi.emit('image load', {
            image: base64
          });

          v.status = result.status;
          v.response = result.response;
            
          setTimeout(() => {
            this.$store.dispatch('FETCH_USER');
          }, 1000);
        };
      }

    },

    /**
     * Обработка добавления новго изображения
     */
    async uploadFiles(e) {
      const URL = window.webkitURL || window.URL;
      
      for (let i = 0; i < e.target.files.length; i++) {
        var file = e.target.files[i];

        const uri = await URL.createObjectURL(file);

        this.loadingImage.uris.push({
          uri: uri,
          blob: file,

          status: -1,
          response: ''
        });
      }
      await this.loadImages();
    }
  },
};
</script>
<style>
  p {
      margin: 0 !important;
  }
</style>
