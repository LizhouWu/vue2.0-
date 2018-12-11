<template>
    <div class="header">
        <div class="header-wrapper">
            <!-- 左侧 avatar -->
            <div class="avatar">
                <img width="64" height="64" :src="seller.avatar">
            </div>
            <!-- 右侧内容 -->
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{ seller.description }} / {{seller.deliveryTime}}分钟送达
                </div>
                <div class="support" v-if="seller.supports">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
            </div>
            <!-- count -->
            <div class="support-count" @click="showDetail">
                <span class="count">5个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
            <div class="header-bg">
                <img :src="seller.avatar" width="100%" height="100%" alt="">
            </div>
        </div>
        <!-- 公告 -->
        <div class="bulletin-wrapper" @click="showDetail">
            <span class="bulletin-brand"></span>
            <span class="bulletin-text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right" ></i>
        </div>
        
        <!-- 弹窗 -->
        <transition name="fadeDetail">
            <div class="detail" v-show="detailShow">
                <div class="detail-wrapper">
                    <div class="detail-main">
                        <h1 class="name">{{seller.name}}</h1>
                        <!-- 星星评分组件 -->
                        <div class="star-wrapper">
							<star :size="48" :score="seller.score"></star>
						</div>
                        <!-- 优惠信息 -->
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>

                        <ul v-if="seller.supports" class="supports">
                            <li class="support-item" v-for="(item,index) in seller.supports">
                                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                                <span class="text">{{seller.supports[index].description}}</span>
                            </li>
                        </ul>

                        <!-- 商家公告 -->
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">
                            <p class="content"> {{seller.bulletin}} </p>
                        </div>
                    </div>
                </div>
                <!-- 关闭 -->
                <div class="detail-close" @click="hideDetail">
                    <i class="icon-close"></i>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import star from '../star/star'
    export default {
        props : {
            seller : {}
        },
        components : {
            star
        },
        data () {
            return {
                detailShow : false,
            }
        },
        methods : {
            hideDetail () {
                this.detailShow = false
            },
            showDetail () {
                this.detailShow = true
            }
        },
        created () {
            this.classMap = [
                'decrease',
                'discount',
                'guarantee',
                'invoice',
                'special',
            ]
        }
    }
</script>

<style lang="stylus" rel = "stylesheet/stylus" scoped>
    @import '../../common/stylus/mixin.styl'
    .header
        color #FFF
        background-color rgba(7,17,27,0.5)
        .header-wrapper
            padding 24px 12px 18px 24px
            position relative
            font-size 0
            .avatar
                display inline-block
                // background-color red
                margin-right 16px
                img
                    border-radius 2px
            .content
                display inline-block
                // background-color red
                vertical-align top
                margin-top 2px
                .title
                    margin-bottom 8px
                    .brand
                        display inline-block
                        width 30px
                        height 18px
                        bg-image("brand")
                        background-size 30px 18px
                        background-repeat no-repeat
                        vertical-align top
                        margin-right 6px
                    .name
                        font-size 16px
                        color rgb(255,255,255)
                        font-weight 700
                        line-height 18px
                .description
                    font-size 12px
                    color rgb(255,255,255)
                    font-weight 200
                    line-height 12px
                    margin-bottom 10px
                .support
                    .icon
                        display inline-block
                        vertical-align: -1px
                        width 12px
                        height 12px
                        margin-right 4px
                        background-size 12px 12px 
                        background-repeat: no-repeat
                        &.decrease
                            bg-image('decrease_1')
                        &.discount
                             bg-image('discount_1')  
                        &.guarantee
                             bg-image('guarantee_1')  
                        &.invoice
                             bg-image('invoice_1')  
                        &.special
                             bg-image('special_1')
                    .text
                        font-size 10px
                        color rgb(255,255,255)
                        font-weight 200
                        line-height 12px
            .support-count
                position absolute
                right 12px
                bottom 14px
                color rgb(255,255,255)
                height 24px
                line-height 24px
                background-color rgba(0,0,0,0.2)
                padding  0 8px
                text-align center
                border-radius 14px
                .count
                    font-size 10px
                    // background-color blue
                    vertical-align top
                .icon-keyboard_arrow_right
                    font-size 10px   
                    line-height 24px
                    vertical-align top
        .header-bg 
            position absolute 
            top 0
            left 0
            width 100%
            height 100%
            z-index -1
            filter:blur(10px)
        .bulletin-wrapper
            height 28px
            line-height 28px
            padding 0 22px 0 12px
            white-space nowrap 
            overflow hidden
            text-overflow ellipsis
            position relative
            background rgba(7,17,27,0.2)
            .bulletin-brand
                display inline-block
                width 22px
                height 12px
                bg-image('bulletin')
                background-size 22px 12px
                background-repeat no-repeat
                vertical-align top
                margin-top 8px
            .bulletin-text
                font-size 10px
                font-weight 200
                margin 0 4px
                vertical-align top
            .icon-keyboard_arrow_right
                position absolute
                font-size 10px
                top 8px
                right 12px 
        .detail 
            position fixed
            top 0
            left 0
            width 100%
            height 100%
            overflow auto
            background-color rgba(7,17,27,0.8)   
            z-index 200
            // 给其父集添加类
            &.fadeDetail-enter-active, &.fadeDetail-leave-active
                transition:all 1s
            &.fadeDetail-enter, &.fadeDetail-leave-active
                opacity 0
                background-color rgba(7,17,27,0)       
            .detail-wrapper
                width 100%
                min-height 100%
                .detail-main
                    padding 64px 36px 32px
                    // background red
                    .name
                        font-size 16px
                        font-weight 700
                        color rgb(255,255,255)
                        line-height 16px
                        text-align center
                        margin-bottom 16px
                    .star-wrapper
                        text-align center
                    .star
                        height 24px
                        line-height 24px
                        margin-bottom 28px
                    .title
                        display flex
                        margin 0 auto 24px auto
                        text-align center
                        .line
                            flex 1
                            position relative
                            border-bottom 1px solid rgba(255,255,255,.2)
                            top -6px
                        .text
                            padding:0 12px
						    font-weight:700
						    font-size:14px
        .supports
                        margin:0 auto
                        .support-item
                            padding 0 12px
                            margin-bottom 12px
                            font-size 0
                            &:last-child
                                margin-bottom 16px
                            
                            .icon
                                display inline-block
                                width 16px
                                height 16px
                                vertical-align top
                                margin-right 6px
                                background-size 16px 16px
                                background-repeat no-repeat
                            .decrease

                                bg-image('decrease_2')
                            
                            .discount
                                bg-image('discount_2')
                            
                            .guarantee
                                bg-image('guarantee_2')
                            
                            .invoice
                                bg-image('invoice_2')
                            
                            .special
                                bg-image('special_2')
                            
                            .text
                                line-height 16px
                                font-size 12px
        .bulletin
            padding 0px 12px
            .content            
                font-size 12px
                font-weight 200
                color rgb(255,255,255)
                line-height 24px

    .detail-close
        position absolute
        width 32px
        height 32px
        margin -50px auto 0 auto
        clear both
        font-size: 32px
        left 0
        right 0



            

</style>

