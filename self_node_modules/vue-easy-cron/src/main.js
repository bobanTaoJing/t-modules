import Vue from 'vue'
import App from './App.vue'
import cron from './lib/index.js'
debugger
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(iView)
Vue.use(cron)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  render: h => h(App)
})
/*
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})*/