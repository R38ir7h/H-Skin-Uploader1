<template lang="pug">
	v-app#app
		v-expand-transition
			v-alert.ma-0(v-if='!server' type='error' color='teal' ) Сервер временно не отвечает на запросы. Вероятно кто-то загружает иконку :)
		router-view.view() 


</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		async mounted() {
			this.$store.dispatch('FETCH_USER');

			this.fetchServer();
		},
		computed: {
			...mapGetters({
				server: 'SERVER'
			})
		},
		data   : () => ({
			drawer: null,
			routerStack    : router.panel, 
			serverConnected: false
		}),
		methods: {
			async webApiReady() {
				this.serverConnected = true;
			},
			async fetchServer() {
				this.$store.dispatch('FETCH_SERVER');
				setTimeout(() => this.fetchServer(), 1000);
			}
		}
	};
</script>
<style lang="scss">
</style>