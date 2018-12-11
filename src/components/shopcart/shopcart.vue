<template>
    <div>
        <div class="shopcart">
            <div class="content">
                <div class="content-left">
                    <div class="logo-wrapper" @click="toggleList">
                        <div class="logo" :class="{'highlight' :totalCount > 0}">
                            <i class="icon-shopping_cart" 
                            :class="{'highlight' :totalCount > 0}"></i>
                        </div> 
                        <div class="num" v-show="totalCount>0">{{ totalCount }}</div>
                    </div>
                    <div class="price" 
                        :class="{'highlight' :totalCount > 0}">￥{{ totalPrice }}元
                    </div>
                    <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
                </div>
                <div class="content-right" @click.stop.prevent="pay">
                    <div class="pay" :class="payClass">
                        {{ payDesc }}
                    </div>
                </div>
            </div>
            <!-- 购物车详情 -->
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <div class="title">购物车</div>
                        <div class="empty" @click="empty">清空</div>
                    </div>            
                    <div class="list-content" ref="listContent" >
                        <ul>
                            <li class="food" v-for="food in selectFoods">
                                <span class="name">{{food.name}}</span>
                                <div class="price">
                                    <span>￥{{food.price*food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="fade">
                <!-- listShow表示当list详情列表显示的时候mask才显示 -->
                <div class="list-mask" v-show="listShow" @click="hideList()"></div>
        </transition>
    </div>
</template>

<script>
import cartcontrol from "../cartcontrol/cartcontrol";
import BScroll from "better-scroll";
     export default {
        props : {
            deliveryPrice : {
                type : Number,
                default : 0
            },
            minPrice : {
                type : Number,
                default : 0
            },
            selectFoods : {
                type : Array,
                default () {
                    return [{
                        // price : 10,
                        // count : 30
                    }]
                }
            }
        },
        components: {
            cartcontrol
        },
        data () {
            return {
                // 购物车详情的折叠开关
                fold : true
            };
        },

        methods: {
            toggleList() {
                // alert(1)
                if (!this.totalCount) { //购物车没有商品的时候不可点击 
                    return;
                }
                this.fold = !this.fold; //当前是收起状态就展开，展开状态就收起
            },
            empty () {
                this.selectFoods.forEach((food) => { //遍历food，将food的count都置零
                    food.count = 0;
                });
            },
            hideList () {
                this.fold = true;
            },
            pay () {
                if(this.totalPrice < this.minPrice){
                    return;
                }
                window.alert(`需支付${this.totalPrice}元`)
            }
        },

        computed: {
            // 计算总价格
            totalPrice () {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count
                })
                return total;
            }
            // 所选数量总和
            ,totalCount () {
                let count = 0;
                this.selectFoods.forEach(food => {
                    count += food.count;
                });
                return count;
            }
            // 支付
            ,payDesc () {
                if (this.totalPrice === 0 ) {
                    return `￥${this.minPrice}元起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差￥${diff}元起送`;
                }else {
                    return `去结算`;
                }
            }
            ,payClass() {
                if (this.totalPrice < this.minPrice) {
                    return "not-enough";
                } else {
                    return "enough";
                }
            },
            listShow() {
                if (!this.totalCount) {
                    this.fold = true;
                    return false;
                }
                let show =!this.fold;
                if (show) { // true为展示状态
                    this.$nextTick(() => {
                         if (!this.scroll) { // 没有scroll的时候才需要new，否则只需要刷新一下即可
                            this.scroll = new BScroll(this.$refs.listContent, {
                                click: true
                            });
                          } else {
                           this.scroll.refresh();
                        }
                    });
                }
                return show;
            }
        },

   }

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixin.styl'; 
.shopcart 
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    background-color #000
    .content 
        display flex
        background #141d27
        font-size 0
        .content-left 
            flex 1
            .logo-wrapper 
                display inline-block
                position relative
                top -10px
                padding 6px
                margin 0 12px
                width 56px
                height 56px
                box-sizing border-box
                border-radius 50%
                background rgb(20, 29, 39)
                .logo 
                    width 100%
                    height 100%
                    border-radius 50%
                    text-align center
                    background-color #2b343c
                    &.highlight 
                        background rgb(0, 160, 220)
                    .icon-shopping_cart 
                        font-size 24px
                        color #80858a
                        line-height 44px
                        &.highlight 
                            color #fff                
                .num 
                    position absolute
                    top 0
                    right 0
                    width 24px
                    height 16px
                    line-height 16px
                    text-align center
                    border-radius 16px
                    font-size 9px
                    font-weight 700
                    color #ffffff
                    background-color rgb(240, 20, 20)
                    box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
            .price 
                display inline-block
                vertical-align top
                line-height 24px
                margin-top 12px
                box-sizing padding-box
                padding-right 12px
                border-right 1px solid rgba(255, 255, 255, 0.1)
                font-size 16px
                font-weight 700
                color rgba(255, 255, 255, 0.4)

                &.highlight 
                    color #fff
                
            

            .desc 
                display inline-block
                vertical-align top
                line-height 24px
                margin 12px 0 0 12px
                color rgba(255, 255, 255, 0.4)
                font-size 10px
            
        

        .content-right 
            flex 0 0 105px
            width 105px
            .pay 
                font-size 12px
                font-weight 700
                height 48px
                line-height 48px
                text-align center
                color rgba(255, 255, 255, 0.4)
                background #2b333b
                &.not-enough 
                    background #2b333b
                &.enough 
                    background #00b43c
                    color #fff
    .ball-container 
        .ball 
            position fixed
            left 32px
            bottom 32px
            z-index 200
        &.drop-transtion 
            transtion all 0.4s
            .inner 
                width 16px
                height 16px
                border-radius 50%
                background rgb(0,160,220)
    .shopcart-list
        position absolute
        top 0
        left 0
        z-index -1
        width 100%
        transform translate3d(0,-100%,0)
        &.fold-enter-active, &.fold-leave-active
            transition all 0.4s linear
            transform translate3d(0, -100%, 0)
        &.fold-enter, &.fold-leave-active
            transform translate3d(0,0,0)
        .list-header
            height 40px
            line-height 40px
            padding 0 18px
            background #f3f5f7
            border-bottom 1px solid rgba(7,17,27,0.1)
            .title
              float left
              font-size 14px
              color rgb(7,17,27)
            .empty
              float right
              font-size 12px
              color rgb(0,160,220)
        .list-content
          padding 0 18px
          max-height 217px
          background #fff
          overflow hidden
          .food
            position relative
            padding 12px 0
            border-box border-box
            border-1px(rgba(7,17,27,0.1))
            .name
              line-height 24px
              font-size 14px
              color rgb(7, 17, 27)
            .price
              position absolute
              right 90px
              bottom 12px
              font-size 14px
              line-height 24px
              font-weight 700
              color rgb(240,20,20)
            .cartcontrol-wrapper
              position absolute
              right 0px
              bottom 6px
.list-mask
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    z-index 40
    -webkit-backdrop-filter blur(10px)
    background-color rgba(7,17,27,0.6)
    &.fade-enter-active,&fade-leave
        transition all 0.5
    &.fade-enter,&fade-leave-active
        opacity 0
        background-color rgba(7,17,27,0)
</style>