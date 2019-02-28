import Vue from 'vue';
import App from './App.vue';
//import $ from 'jquery';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//import iView from 'iview';
//import 'iview/dist/styles/iview.css';
//Vue.use(iView);

// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
// Vue.use(Antd);

import VueResource from 'vue-resource';
Vue.use(VueResource);

//self-defined shared css
import './css/basic.css';
import './css/iconfont.css';

import router from './router/routes.js';

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

