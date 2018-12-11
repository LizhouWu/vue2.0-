<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item,index) in goods"
                    class="menu-item"
                    @click="selectMenu(index,$event)"
                    :class="{'current' : currentIndex === index}">
                    <span class="text">
                        <span class="icon" 
                             :class="classMap[item.type]"
                             v-show="item.type>0">
                        </span>
                        {{ item.name }}
                    </span>
                </li>
            </ul>
        </div>  
        <div class="foods-wrapper" ref="foodsWrapper">
            <ul>
                <li v-for="item in goods" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="food in item.foods" class="food-item"
                            @click="selectFood(food,$event)">  
                            <div class="icon">
                                <img width="57" height="57" :src="food.icon" alt="">
                            </div>
                            <div class="content">
                                <div class="name">{{food.name}}</div>
                                <div class="desc">{{food.description}}</div>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}</span>
                                    <span>好评{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span>
                                    <span class="old" 
                                         v-show="food.oldPrice">
                                         ￥{{food.oldPrice}}
                                    </span>
                                </div>
                                <!-- cartcontrol 组件 -->
                                <div class="cartcontrol-wapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </div>
                            
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="shopcart-wrapper">
            <shopcart :delivery-price="seller.deliveryPrice" 
                      :min-price="seller.minPrice"
                      :select-foods="selectFoods">
            </shopcart>
        </div>
        <food :food="selectedFood" ref="food"></food>
    </div>
    
</template>

<script>
import Bscroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol'
import shopcart from '../shopcart/shopcart'
import food from "../food/food"
    const ERR_OK = 0;
    export default {
        props : {
            seller : {
                type : Object
            }
        },
        components: {
            cartcontrol,
            shopcart,
            food
        },
        data () {
            return {
                goods : [],
                foods : [],
                // 存放左侧列表高度的数组
                listHeight : [],
                scrollY : 0,
                selectedFood : {},

            };
        },
        methods: {
            // 使用bscroll 给页面添加滚动
            _initScroll () {
                this.menuScroll = new Bscroll(this.$refs.menuWrapper,{
                    click : true,
                    probeType : 3 //BScroll滚动时，能实时告诉我们滚动的位置，类似探针的效果
                })
                this.foodsScroll = new Bscroll(this.$refs.foodsWrapper,{
                    click : true,
                    probeType : 3 //BScroll滚动时，能实时告诉我们滚动的位置，类似探针的效果
                })
                this.foodsScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y))
                })
            },
            _calculateHeight () {
                let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
                let height = 0;
                this.listHeight.push(height);

                for (let i=0;i<foodList.length;i++) {
                    let item = foodList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            // 左侧列表点击事件
            selectMenu(index,event) {
                if (!event._constructed) {
                    return;
                }
                let foodList = this.$refs.foodsWrapper.getElementsByClassName(
                    "food-list-hook"
                );
                let el = foodList[index];
                this.foodsScroll.scrollToElement(el,500);
            },
            selectFood(food,event) {
                if (!event._constructed) {
                    return;
                }
                this.selectedFood = food;
                //调用子组件的show()方法展开food组件
                this.$refs.food.show();
            },
            
            
        },
        // 计算属性
        computed: {
            /* 左侧 currentIndex */
            currentIndex () {
                for(let i=0; i<this.listHeight.length;i++ ) {
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i+1];

                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
                        return i;
                    }
                }
                return 0;
            },
              selectFoods() { //遍历foods，看看选中了哪些商品
                let foods = [];
                this.goods.forEach((good) => { //先取到每一个分类
                    good.foods.forEach((food) => { //后取到每一个分类下的不同food
                        if (food.count) {
                        foods.push(food); //两层遍历，取到所有被选中的foods
                        }
                    });
                });
                return foods; //将结果传回到shopcart
            }
            

        },
        created () {
            this.classMap = [
                'decrease',
                'discount',
                'guarantee',
                'invoice',
                'special',
            ],

            //请求的ajex地址,成功的回调，拿到一个response
            this.$http.get('/api/goods').then((response) => {
            //response是一个属性，将其转化为json对象
            response = response.body;
            //console.log(response);
            if (response.errno === ERR_OK) {
                // 数据在data字段中,将seller对象传给header组件，通过:seller
                this.goods = response.data;
                // console.log(this.goods);
                this.$nextTick( () => {
                    this._initScroll();
                    this._calculateHeight();
                })
            }else {
                console.log('no data');
            }
            });
            
        }
   }

</script>
<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin.styl'
.goods
    display flex
    position absolute
    width 100%
    top 174px
    bottom 46px
    overflow hidden
    .menu-wrapper
        flex 0 0 80px
        width 80px
        background #f3f5f7
        .menu-item
            display table
            height 54px
            width 56px
            line-height 14px
            padding 0 12px
            &.current
                background-color #fff    
            .text
                display table-cell
                vertical-align middle
                font-size 12px
                font-weight 200
                line-height 14px
                color black
                border-1px(rgba(7, 17, 27, 0.1));
                .icon
                    display inline-block
                    vertical-align: -1px
                    width 12px
                    height 12px
                    margin-right 4px
                    background-size 12px 12px 
                    background-repeat: no-repeat
                    &.decrease
                        bg-image('decrease_3')
                    &.discount
                        bg-image('discount_3')  
                    &.guarantee
                        bg-image('guarantee_3')  
                    &.invoice
                        bg-image('invoice_3')  
                    &.special
                        bg-image('special_3')
                    

    .foods-wrapper
        flex 1
        // background #fff
        .title
            font-size 12px
            color rgb(147,153,159)
            line-height 26px
            height 26px
            padding-left 14px
            background-color #f3f5f7
            border-left 2px solid #d9dde1
        .food-item
            display flex
            padding 18px
            border-1px(rgba(7, 17, 27, 0.1))
            position relative
            &.last-child
                border-none()
                margin-bottom 0
            .cartcontrol-wapper
                position absolute
                right 12px
                bottom 12px
                // background-color red
            .icon
                // padding 18px 10px 0 18px
                flex 0 0 57px
                display inline-block
                // vertical-align top
                margin-right 10px
            .content
                display inline-block
                // padding 18px 18px 18px 0
                flex 1
                .name
                    font-size 14px
                    height 17px
                    line-height 17px
                    color rgb(7,17,27)
                    margin -5px 0 8px 0
                .desc
                    font-size 10px
                    line-height 12px
                    margin 8px 0
                    color rgb(147,153,159)
                .extra
                    font-size 10px
                    color rgb(147,153,159)
                    line-height 12px
                    .count
                        padding-right 12px
                .price
                    line-height 24px
                    // font-weight 700
                    .now
                        font-size 14px
                        color red
                        line-height 24px
                        padding-right 8px
                    .old
                        font-size 10px
                        color rgb(147,153,159)
                        line-height 24px
                        text-decoration line-through



    
    .shopcart-wrapper
        position fixed
        left 0
        bottom 0
        width 100%
        height 48px
        z-index 50
</style>