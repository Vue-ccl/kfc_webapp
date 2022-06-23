<template>
    <div class="order">
        <!-- 头部 -->
        <van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="onClickLeft" fixed z-index="999" placeholder/>  
        <!-- 红色背景 -->
        <div class="bg-red"></div>
        <!-- 大盒子 -->
        <div class="big-box">
            <!-- 三个状态 -->
            <div class="three-choose">
                <van-tabs v-model="active" @change="changeThree">
                <van-tab title=" 全 部" name="2"></van-tab>
                <van-tab title="进行中" name="0"></van-tab>
                <van-tab title="已完成" name="1"></van-tab>
                </van-tabs>
            </div>
            
            <!-- 无数据时显示 -->
            <div v-if="order.length==0">
                <van-empty description="订单空空的">
                <van-button round type="danger" class="bottom-button" :to="{name:'Home'}">去首页逛一逛吧!</van-button>
                </van-empty>
            </div>

            <!-- 订单产品内容  有数据时显示-->
            <div class="pro-box" v-for="item in order" :key="item.orderId" v-else>
                <!-- 订单编号和状态 -->
                <div class="num-box">
                    <div class="no">订单编号:{{item.orderNo}}</div>
                    <div class="status" v-if="item.stutas == 0" @click="take(item.orderId)" style="background:red">待收货</div>
                    <div class="status" v-else @click="deleteOrder(item.orderId)">
                        <div>已完成</div>
                        <div>
                            <van-icon size="20" name='delete-o' />
                        </div>
                    </div>
                </div>
                <!-- 商品 -->
                <div class="product-msg">   
                    <!-- 商品件 -->
                    <div class="product-box" v-for="k in item.product" :key="k.carId">
                        <img :src="k.product.largeImg" alt="">
                        <div class="product-right">
                            <!-- 商品名 -->
                        <div class="title">
                            {{k.product.name}}
                        </div>
                        <!-- 价格和数量 -->
                        <div class="price-num">
                            <!-- 价格 -->
                            <div class="price">￥{{k.product.Price}}</div>
                            <!-- 数量 -->
                            <div class="count">x{{k.count}}</div>
                        </div>
                        </div>
                    </div>
                </div>
                <!-- 商品底部信息 -->
                <div class="footer">
                <div class="time">{{item.created_at}}</div>
                    <div class="count-all">
                        <div class="count">共计：x</div>
                        <div class="allPrice">合计：<div class="redPrice">￥{{item.allPrice}}</div></div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
import { Dialog} from 'vant'
import {Toast} from 'vant'
    export default {
        name:'Order',
        data() {
            return {              
                active:2,
                //装订单数据
                order:[]
            }
        },
        created(){
            this.getOrder()
        },
        methods:{
           onClickLeft(){
                 this.$router.go(-1)
            },
            //改变切换tab标签状态
            changeThree(){
                // console.log(this.active)
                this.getOrder()//切换时就请求一次订单
            },
            //查询订单
            getOrder(){
                this.axios({
                    method:'get',
                    url:'/getOrder',
                    params:{
                        id:localStorage.getItem('token'),
                        stutas:this.active//根据状态，获取对应状态的订单
                    }
                }).then((result) => {
                    this.order=[]//每次请求获取数据之前，先清空一下
                    // console.log(result)                   
                    this.order=result.data.data.reverse()
                }).catch((err) => {
                    console.log(err)
                });
            },
            //修改订单状态
            take(orderId){
                //取消与确认
                Dialog.confirm({
                    title: '是否确认收货？',
                    // message: '弹窗内容',
                }).then(() => {
                        this.axios({
                            method:'get',
                            url:'/take',
                            params:{
                                id:localStorage.getItem('token'),
                                orderId:orderId
                            }
                        }).then((result) => {
                            console.log(result)
                            if(result.data.stutas===1311){
                                this.getOrder()
                            }
                        }).catch((err) => {
                            console.log(err)
                        });
                    })
                    .catch(() => {
                        return
                    });
            },
            //删除订单
            deleteOrder(orderId){
                //取消与确认
                Dialog.confirm({
                    title: '是否删除订单？',
                    // message: '弹窗内容',
                }).then(() => {
                        //确认请求删除订单
                        this.axios({
                            method:'post',
                            url:'/delectOrder',
                            data:{
                                id:localStorage.getItem('token'),
                                orderId:orderId
                            }
                        }).then((result) => {
                            console.log(result)
                            if(result.data.stutas == 502){
                                this.getOrder()
                                Toast('删除成功！')
                            }else{Toast('删除失败！')}
                        }).catch((err) => {
                            console.log(err)
                        });
                    })
                    .catch(() => {
                        return
                    });
                
                
            }
        }
    }
</script>

<style lang="less" scoped>
    .bg-red{
        height: 100px;
        background: red;
    }
    .big-box{
        padding: 0 10px;
    }
    .three-choose{
        border-radius: 15px 15px 0 0;
        overflow: hidden;
        position: relative;
        top: -30px;
    }
    .pro-box{
        background: white;
        border-radius: 10px 10px 0 0;
        padding: 5px;
        margin-bottom: 10px;
        .num-box{
            display: flex;
            justify-content: space-between;
            font-size: 15px;
            .status{
                display: flex;
                padding: 1px;
                border-radius: 5px;
            }
        }
    }
    .product-msg{
    background: white;
    margin: 10px;
    padding:10px;
    border-radius: 15px;
    .product-box{
            display: flex;
            margin: 5px 0;
            border-bottom: 1px dotted silver;
            img{
            width: 100px;
            height: 100px;
            }
            .product-right{
                padding: 5px;
                .title{
                    height: 40px;
                    font-size: 16px;
                    width:205px;
                    /* 多行文本溢出 */
                    text-overflow:ellipsis;
                    word-wrap:break-word;
                    overflow:hidden;
                    display:-webkit-box;
                    -webkit-line-clamp:2;/*行数*/
                    -webkit-box-orient:vertical;
                }
            .price-num{
                    height: 40px;
                    display: flex;             
                    //垂直居中，根据主轴方向变化
                    align-items: center;
                    justify-content: space-between;
                    font-size: 14px;
                    font-weight: 600;
                    .price{              
                        color: red;
                    }
                }
            }
        }
    }
    .footer{
        padding: 10px;
        background: white;
        border-top: 10px;
        border-top: 1px dashed silver;
        .count-all{
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 14px;
            .allPrice{
                display: flex;
                .redPrice{
                color: red;
                }
            }
        }
    }
    
</style>