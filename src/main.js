// eslint-disable-next-line no-console
const originalConsoleError = console.error;

// eslint-disable-next-line no-console
console.error = function(message, ...args) {
 
  const ignoreMessages = [
    'Lockdown failed',
    'harden is not defined',
   
  ];


  if (!ignoreMessages.some(ignoreMessage => message.includes(ignoreMessage))) {
   
    originalConsoleError(message, ...args);
  }
};


import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import './assets/main.css'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
