import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'toastr/build/toastr.min.css'
import jsPDF from 'jspdf'
import 'toastr/build/toastr.min.js'
// import router from './router/index'


Vue.config.productionTip = false

new Vue({
    router,
    vuetify,
    jsPDF,
    render: h => h(App)
}).$mount('#app')