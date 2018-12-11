<template>
    <transition name="fade">
        <div class="food" v-show="showFlag" ref="foodcontent">
            <div class="food-content" >
                <!-- header -->
                <div class="image-header">
                    <img :src="food.image" alt="">
                    <!-- 后退按钮 -->
                    <div class="back" @click="hide">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>

                <!-- 内容区 -->
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span>
                        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>

                        <!-- 购物车 -->
                    <div class="cartcontrol-wrapper" v-show="food.count > 0">
                         <cartcontrol :food="food"></cartcontrol>
                    </div> 
                    <div class="buy" v-show="!food.count || food.count === 0"
                        @click.stop.prevent="addFist">加入购物车
                    </div>
                </div>

                    <!-- split 组件 -->
                    <split></split>

                    <!-- 商品介绍 -->
                    <div class="info">
                        <div class="title">商品介绍</div>
                        <p class="text">{{ food.info }}</p>
                    </div>
                    <split></split>

                    <!-- 商品评价 -->
                    <div class="rating">
                        <div class="title">商品评价</div>
                        <ratingselect  
                            :select-type="selectType"
                            :only-content="onlyContent"
                            :desc="desc" 
                            :ratings="food.ratings"
                            @select="selectRating"
                            @onlyContent="toggleContent">
                        </ratingselect>
                    </div>
                    <!-- 评价列表 -->
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li class="rating-item" v-for="rating in food.ratings"
                                v-show="needShow(rating.rateType,rating.text)">
                                <div class="time">{{ rating.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType===0,
                                                'icon-thumb_down':rating.rateType===1}">
                                    </span>
                                    <span>{{rating.text}}</span>
                                </p>
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" width="12" height="12" :src="rating.avatar" >
                                </div>
                            </li>
                        </ul>
                        <!-- 暂无评价 -->
                        <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                    </div>
                
            </div>
        </div>
    </transition>
</template>

<script>
    import split from '../split/split'
    import BScroll from "better-scroll";
    import ratingselect from '../ratingselect/ratingselect'
    import {formatDate} from '../../common/js/utils';
    import cartcontrol from "../cartcontrol/cartcontrol";
    import Vue from 'vue';

    const positive = 0;
    const negative = 1;
    const all = 2;

     export default {
         props : {
             food : {
                 type : Object
             }
         },
        components: {
            split,
            ratingselect,
            cartcontrol
        },
        data () {
          return {
              showFlag : false,
              // ratingselect 数据覆盖
              selectType : all,
              onlyContent : true,
              desc : {
                  all : '全部',
                  positive : '推荐',
                  negative : '吐槽'
              }
            };
        },
        //过滤器方法
		filters:{
			formatDate(time){
			    let date = new Date(time);
			    return formatDate(date,'yyyy-MM-dd hh:mm');
			}
		},
        methods: {
            show () {
                this.showFlag = true;
                // 再次初始化
                this.selectType = all;
                this.onlyContent = false;

                // base-scroll
                    this.$nextTick ( () => {
                        if(!this.scroll) {
                            this.scroll = new BScroll(this.$refs.foodcontent,{
                                click : true
                            })
                        }else {
                            this.scroll.refresh();
                        }
                    })
            },
            hide () {
                this.showFlag = false;
            },
            selectRating (type) {
                this.selectType = type;
			    this.$nextTick(()=> {   // 异步更新
					this.scroll.refresh();
				})
            },
            // 只看有内容的评价
            toggleContent (onlyContent) {
                var self = this;
			    this.onlyContent = !onlyContent;

				this.$nextTick(()=> {   // 异步更新
					this.scroll.refresh();
				})
            },
            // ratingselect 数据联动
            needShow(type,text) {
                if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === all) {
					return true;
				} else {
					return type === this.selectType;
				}
            },
            addFist (event) {
                if(event._contructed) {
                    return;
                }
                this.$emit('cart-add',event.target);
                Vue.set(this.food,'count',1)
                
            },
        },

   computed: {},

   }

</script>
<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl"
.food
    position fixed
    left 0
    top 0
    bottom 48px  /* 购物车留白*/ 
    z-index 30
    width 100%
    background #fff
    &.fade-enter-active, &.fade-leave-active
        transition all .3s linear //为动画过程添加缓动和最终状态
        transform translate3d(0,0,0)
    &.fade-enter, &.fade-leave-active
        opacity 0
        transform translate3d(100%, 0, 0) //动画x轴方向移动
    .image-header
        position relative    
        width 100%
        height 0
        padding-top 100% /* 宽高相等 */
        img
            position absolute
            top 0
            left 0
            width 100%
            height 100%
        .back
            position absolute
            top 10px
            left 0
            .icon-arrow_lift
                display block
                padding 10px
                font-size 20px
                color #FFF
    .content
        padding 18px
        position relative
        .title
            line-height 14px
            margin-bottom 8px
            font-size 14px
            font-weight 700
            color rgb(7,17,27)
        .detail
            margin-bottom 18px
            height 10px
            line-height 10px
            font-size 0
            .sell-count,.rating
                font-size 10px
                color rgb(147,153,159)
            .sell-count
                margin-right 12px
        .price 
            font-weight 700
            line-height 24px
            .now 
                margin-right 8px
                font-size 14px
                color rgb(240, 20, 20)
                text-descration line-through
                font-weight 700
            .old
                text-decoration line-through
                font-size 10px
                color rgb(147, 153, 159)
        .cartcontrol-wrapper	    
            position absolute        
            right 12px
            bottom 12px
        .buy
            position absolute
            right 18px
            bottom 18px
            z-index 10
            height 24px
            line-height 24px
            padding 0 12px
            box-sizing border-box
            font-size 10px
            border-radius 12px
            color #FFF
            background-color rgb(0,160,220)
    .info
        padding 18px
        .title
            line-height 14px
            margin-bottom 6px
            font-size 16px
            color rgb(7,17,27)
        .text
            line-height 24px
            padding 0 8px
            font-size 12px
            color rgb(77,85,93)        
    .rating
        padding-top 18px
        .title
            line-height 14px
            margin-left 18px
            font-size 16px
            color rgb(7,17,27)
            // font-weight 700
    .rating-wrapper
        padding 0 18px
        .rating-item
            position relative 
            padding 16px 0
            border-1px(rgba(7,17,27,0.1))
            .user
                position absolute
                right 0
                top 16px
                font-size 0
                line-height 12px
                .name
                    display inline-block
                    margin-right 6px
                    vertical-align top
                    font-size 10px
                    color rgb(147,153,159)
                .avatar
                    border-radius 50%
            .time
                line-height 12px
                font-size 10px
                color rgb(147,153,159)
                margin-bottom 6px
            .text
                line-height 16px
                font-size 12px
                color rgb(7,17,27)
                .icon-thumb_up,.icon-thumb_down
                    line-height 16px
                    margin-right 4px
                    font-size 12px
                .icon-thumb_up
                    color rgb(0,160,220)
                .icon-thumb_down
                    color rgb(147,153,159)
        .no-ratings
            padding 16px 0
            font-size 12px
            color rgb(147,153,159)
</style>
