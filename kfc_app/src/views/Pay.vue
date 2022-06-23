<template>
    <div class="payStyle">
        <!-- 头部 -->
        <van-nav-bar title="支付订单" left-text="返回" left-arrow @click-left="onClickLeft" fixed z-index="999" placeholder/>  

        <!-- 地址 -->
        <div class="address">
            <div class="choose" @click="showPopup">
                <van-cell title="选择地址" icon="location-o" is-link />
            </div>
           
            <div class="person-msg">
                <!-- 第一行 -->
                <div class="username-box">
                    <div class="username">{{address.name}}</div>
                    <div class="phone">{{address.phone}}</div>
                    <van-tag type="danger" v-if="address.isDefault">默认</van-tag>
                </div>
                <!-- 第二行 -->
                <div class="detail-address">{{address.detailAddress}}</div>
            </div>
        </div>  
        <!-- 商品 -->
        <div class="product-msg">   
            <div class="order-msg">订单信息  {{time}}</div>

            <!-- 商品件 -->
            <div class="product-box" v-for="item in products" :key="item.pid">
                <img :src="item.product.largeImg" alt="">
                <div class="product-right">
                     <!-- 商品名 -->
                <div class="title">
                    {{item.product.name}}
                </div>
                <!-- 价格和数量 -->
                <div class="price-num">
                    <!-- 价格 -->
                    <div class="price">￥{{item.product.Price}}</div>
                    <!-- 数量 -->
                    <div class="count">x{{item.count}}</div>
                </div>
                </div>
            </div>
        </div>
         
        <!-- 占位标签 -->
        <div style="height:50px;"></div>

        <!-- 提交 -->
        <div class="btn">
            <van-submit-bar :price="allPrice*100" button-text="支付订单" @submit="goInOrder"><div class="count" >共计：x{{allCount}}</div></van-submit-bar>
        </div>

        <!-- 弹出的地址 -->
        <!-- 自定义图标 -->
        <van-popup v-model="show" closeable close-icon="close"  position="bottom" :style="{ height: '70%' }">
            <div>
                <van-address-list
                    v-model="chosenAddressId"
                    :list="list"
                    :disabled-list="disabledList"
                    disabled-text="以下地址超出配送范围"
                    default-tag-text="默认"
                    @add="onAdd"
                    @select="onSelect"
                    />
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Toast } from 'vant'
const util =require('../assets/js/util')
let times=null
    export default {
        name:'Pay',
        data() {
            return {
                products:[],
                allPrice:0,
                time:util.formatTime(new Date()),
                show:false,
                chosenAddressId:'',
                list: [],
                disabledList: [
                    {
                    id: '3',
                    name: '王五',
                    tel: '1320000000',
                    address: '浙江省杭州市滨江区江南大道 15 号',
                    },
                ],
                //用来展示上方地址
                address:{
                    name:'',
                    phone:'',
                    detailAddress:'',
                    isDefault:false,
                }
            }
        },
        computed:{
            //计算所有数量
            allCount(){
                let allC = 0
                this.products.map(v =>{
                    allC +=v.count
                });
                return allC
            }
        },
        methods:{
            onClickLeft(){
                 this.$router.go(-1)
            },
            showPopup(){
                this.show=!this.show
            },
            //跳转新增地址页面
            onAdd(){
                this.$router.push({name:'NewAddress'})
            },
            //请求用户地址
            getAddrress(){
                this.axios({
                    method:'get',
                    url:'/findAddress',
                    params:{
                        userId:localStorage.getItem('token')
                    }
                }).then((result) => {
                    // return
                    // console.log(result)
                    //遍历结果，把每一组数组结果封装到每一个obj对象中，在把obj对象push到list数组中
                    result.data.data.map((v,index)=>{
                        let obj={}
                        obj.id=v.addId
                        obj.name=v.name
                        obj.address=v.area + v.detialArea
                        obj.tel=v.phone
                        obj.isDefault=v.defaultAddress
                        this.list.push(obj)

                        //优先判断是否有默认地址,有则把默认的地址赋值渲染到页面上
                        if(v.defaultAddress){
                            this.address.name=v.name
                            this.address.phone=v.phone
                            this.address.detailAddress=v.area + v.detialArea
                            this.address.isDefault=v.defaultAddress
                            //勾选默认勾选
                            this.chosenAddressId=v.addId
                        }else{//没有默认地址，则把地址列表的一个地址赋值渲染到页面上
                            this.address.name=this.list[0].name
                            this.address.phone=this.list[0].tel
                            this.address.detailAddress=this.list[0].address
                            this.address.isDefault=this.list[0].isDefault//是否默认值
                            //勾选默认勾选
                            this.chosenAddressId=this.list[0].id
                        }
                    })
                    // console.log(this.list)
                }).catch((err) => {
                    
                });
            },
            //勾选时，切换地址，组件自带的@selete事件，会回调一个item：地址信息，和一个index
            onSelect(item,index){
                // console.log(item,'@@@',index)
                this.address.name=item.name
                this.address.phone=item.tel
                this.address.detailAddress=item.address
                this.address.isDefault=item.isDefault

                //勾选默认勾选
                this.chosenAddressId=item.id
            },

            //提交订单
            goInOrder(){
                //判断是否勾选地址，验证address里面的信息有没有变化，
                if(!this.address.name){
                    Toast('请勾选地址')
                    return
                }

                //判断是否登录
                if(!localStorage.getItem('token')){
                this.$router.push({name:'Login',query:{fromName:'Cart'}})
                this.$notify('请先登录！')
              }
                
                Toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                });
                
                //提交订单到后台
                this.axios({
                    method:'post',
                    url:'/order',
                    data:{
                        id:localStorage.getItem('token'),
                        product:this.products,//提交的购物车的产品
                        allPrice:this.allPrice,//总价格
                        address:this.address.detailAddress
                    }
                }).then((result) => {
                    console.log(result)
                    Toast.clear()

                    if(result.data.stutas===1401){
                        this.$router.replace({name:'Order'})
                        Toast(result.data.msg)
                    }else{
                        this.$notify(result.data.msg)
                    }
                }).catch((err) => {
                    console.log('@@@',err)
                    Toast.clear()
                });
                
            }
        },
        
        
        created(){
            //获取路由参数带来的信息，并json化
            // console.log(this.$route)
            this.products =JSON.parse(this.$route.query.products);
            this.allPrice=this.$route.query.allPrice;

            //定时器，
            this.times=setInterval(() => {
                this.time=util.formatTime(new Date())
            }, 1000);
            
            //调用请求获取地址
            this.getAddrress()
        },
        beforeDestroy(){
            clearInterval(this.times)
        }
    }
</script>

<style lang="less" scoped>
.payStyle{
    height: 100%;
    overflow: hidden;
}
.address{
    margin: 10px;
    padding: 10px;
    border-radius: 15px;
    overflow: hidden;
    background: white;
    border-bottom: 1px solid silver;
    .person-msg{
        display: flex;
        flex-direction: column;
        font-size: 15px;
        border-top: 1px solid silver;
        .username-box{
            display: flex;
            margin: 5px 10px ;
            align-items: center;
            .username{
                margin-right: 5px;
            }
            .phone{
                margin-right: 5px;
            }
        }
        .detail-address{
            color: silver;
             margin: 5px 10px ;
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
.btn{
     .count{    
        font-size: 14px;
        font-weight: 600;       
     }
}


</style>