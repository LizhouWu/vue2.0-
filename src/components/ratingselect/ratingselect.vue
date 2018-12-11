<template>
    <div class="ratingselect">
        <div class="rating-type border-1px">
            <span class="positive block" :class="{'active':selectType===2}"
                 @click="select(2,$event)">{{desc.all}}
                <span class="count">{{ratings.length}}</span>
            </span>
            <span class="positive block" :class="{'active':selectType===0}"
                 @click="select(0,$event)">{{desc.positive}}
                <span class="count">{{positive.length}}</span>
            </span>
            <span class="negative block" :class="{'active':selectType===1}"
                 @click="select(1,$event)">{{desc.negative}}
                <span class="count">{{negative.length}}</span>
            </span>
        </div>
        <div class="switch" :class="{'on':onlyContent}"
            @click="toggleContent">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script>
    const positive = 0;
    const negative = 1;
    const all = 2;

     export default {
        props : {
            ratings : {
                type : Array,
                default () {
                    return []
                }
            },
            // 
            selectType : {
                type  : Number,
                default : all
            },
            onlyContent :{
                type : Boolean,
                default : false
            },
            desc : {
                type : Object,
                default () {
                    return {
                        all : '全部',
                        positive : '满意',
                        negative : '不满意'
                    }
                }
            }
             
        },
        methods : {
            select(type,event) {
                if (!event._constructed) {
                    return;
                }
                // this.selectType = type; 
                // 父组件就能监听到子组件的事件
                this.$emit('select',type);
            },
            toggleContent () {
                // alert(1)
                if (!event._constructed) {
                    return;
                }
                // this.onlyContent = !this.onlyContent; 报错
                this.$emit('onlyContent',this.onlyContent );
            }
        },
        // 计算属性
        computed : {
            positive () {
                return this.ratings.filter((rating) => {
                    return rating.rateType === positive;
                })
            },
            negative () {
                return this.ratings.filter((rating) => {
                    return rating.rateType === negative;
                })
            },
        }
     }

</script>
<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin.styl';
.ratingselect
    .rating-type
        padding 18px 0
        margin 0 18px
        border-1px(rgba(7,17,27,0.1))
        font-size 0
        .block
            display inline-block
            padding 8px 12px
            border-radius 2px
            margin-right 8px
            color rgb(77,85,93)
            font-size 12px
            line-height 16px
            &.active
                   color #FFF
            .count
                margin-left 2px
                font-size 8px
            &.positive
                background-color rgba(0,160,220,.2)
                &.active
                   background-color rgb(0,160,220) 
            &.negative
                background-color rgba(77,85,93,.2)
                &.active
                   background-color rgb(77,85,93)
    .switch
        padding 12px 18px
        line-height 24px
        border-bottom 1px solid rgba(7,17,27,.2)
        color rgb(147,153,159)
        font-size 0
        &.on
            .icon-check_circle
                color #00c850
        .icon-check_circle
            display inline-block
            vertical-align top
            font-size 24px
            margin-right 4px
        .text
            display inline-block
            vertical-align top
            font-size 12px
</style>