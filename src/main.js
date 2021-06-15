import Vue from 'vue'
import App from './App.vue'
import AsyncComputed from 'vue-async-computed'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VCalendar from 'v-calendar';
import './scss/app.scss'


Vue.use(BootstrapVue)

Vue.use(IconsPlugin)

Vue.use(AsyncComputed)

// Use v-calendar & v-date-picker components
Vue.use(VCalendar);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
