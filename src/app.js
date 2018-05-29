/**
 * Created by Su on 2017/12/23.
 */
import Vue from 'vue';
import App from './app.vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import store from './store/index'
import routes from './routes';

Vue.use(VueRouter);
Vue.use(ElementUI);

const router = new VueRouter({
  mode: 'history',
  routes // （缩写）相当于 routes: routes
});


const app = new Vue({
  // el: '#app',
  router: router,
  store,
  render: h => h(App)
});

export default {
  router: router,
  store:store,
  app:app
}

//router.push('goods');

