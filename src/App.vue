<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <router-view/> -->
    <!-- <div class="header">header区域</div> -->
    <!-- 因为 header 为h5 标签，所以修改下名称 -->
    <v-header :seller = "seller"></v-header>
    <!-- <div class="content">content区域</div> -->
    <!-- <div class="footer">footer区域</div> -->
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link :to="'/goods'">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{path:'/ratings'}">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{path:'/seller'}">商家</router-link>
      </div>
    </div>
    <!-- 路由外链 keep-alive 缓存,不用每次请求刷新-->
    <keep-alive>
        <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
// 引入header 组件
import header from './components/header/header'
import {urlParse} from './common/js/utils'
const ERR_OK = 0;
export default {
  // 暴露header 组件
  components : {
    'v-header' : header,
  },
  data () {
    return {
      seller:{
                id:(() => {
                    let queryParam = urlParse();
                    return queryParam.id;
				})()
			}
      }
    },
  created () {
    //请求的ajex地址,成功的回调，拿到一个response
    this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
      //response是一个属性，将其转化为json对象
      response = response.body;
      //console.log(response);
      if (response.errno === ERR_OK) {
        // 数据在data字段中,将seller对象传给header组件，通过:seller
        // this.seller = response.data;
        this.seller = Object.assign({}, this.seller, response.data);
        // console.log(this.seller);
        console.log(this.seller.id);
      }else {
        console.log('no data');
      }
    });
  }

}
</script>

<style lang="stylus" rel = "stylesheet/stylus" scoped>
  @import './common/stylus/mixin.styl'
    .tab
      display flex
      width 100%
      height 40px
      line-height 40px
      border-1px(rgba(7,17,27,0.1))
      
      .tab-item
        flex 1
        text-align center 
        & > a
          display block
          font-size 14px
          color rgb(77,85,93)
          &.active
            color rgb(240,20,20)
</style>
