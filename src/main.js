// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

// 引入index.styl ,该文件可以引用所有的styl文件
import './common/stylus/index.styl'

// 引入 商品 评论 商家
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from './components/seller/seller'

Vue.use(VueRouter)
Vue.use(VueResource)

// 路由
let router = new VueRouter({
  mode : 'history',
  routes : [
    {
      path : '/',
      component : goods
    },
    {
      path : '/goods',
      component : goods
    },
    {
      path : '/seller',
      component : seller
    },
    {
      path : '/ratings',
      component : ratings
    }
  ],
  linkActiveClass : 'active'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
