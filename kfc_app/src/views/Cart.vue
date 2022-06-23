<template>
  <div class="bg-Cart">
    <!-- 头部 -->
    <van-nav-bar
      title="购物车"
      :left-text="show? '返回':''"
      :right-text="edit?'编辑':'完成'"
      :left-arrow="show? true:false"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed 
      z-index="999"
      placeholder
    />
    <!-- 商品栏 -->
    <div class="shoppingCart">
        <div class="cart-item" v-for="(item,index) in products" :key="item.carId">
            <!-- 左边复选框 -->
            <div class="left-choose">
                <van-checkbox v-model="bol[index]" @click="danSelect(index)">复选框</van-checkbox>
            </div>
            <img :src="item.product.largeImg" alt="">
            <div class=" right-box">
                <!-- 商品名 -->
                <div class="top-name">
                    {{item.product.name}}
                </div>
                <!-- 价格和数量 -->
                <div class="price-num">
                    <!-- 价格 -->
                    <div class="price">￥{{item.product.Price}}</div>
                    <!-- 步进器 -->
                    <van-stepper v-model="item.count" theme="round" button-size="22" disable-input />
                </div>
            </div>
        </div>
    </div>
    
          <!-- 占位标签 -->
    <div style="height:50px;"></div>

        <!-- 底部提交订单栏 -->
     <van-submit-bar :price="allPrice" button-text="提交订单" v-if="edit" @submit="goIn">
         <van-checkbox v-model="allChoose" @click="selectAll">全选</van-checkbox>
     </van-submit-bar>
    <van-submit-bar button-text="删除订单" v-else @submit="delect" >
         <van-checkbox v-model="allChoose" @click="selectAll">全选</van-checkbox>
     </van-submit-bar>
     <!-- 购物车无数据时显示 -->
     <div v-if="products==null">
         <van-empty description="购物车空空的">
         <van-button round type="danger" class="bottom-button" :to="{name:'Home'}">去首页逛一逛吧！</van-button>
         </van-empty>
     </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
    name:'Cart',
    data() {
        return {
            show:false,
            edit:true,
            allChoose:false,
            products:[],
            //装布尔值，用判断是否加入购物车
            bol:[],
            //
            cartId:[]
        }
    },
    computed:{
        //计算总价
        allPrice(){
            let price=0
            if(this.products !=null){
                for(let index=0;index<this.products.length;index++){
                if(this.bol[index]){
                    price = price + this.products[index].product.Price*this.products[index].count
                }
            }
            }
            
            return price*100
        }
    },
    created(){
         //调用请求购物车数据
        this.getCart()
        if(this.$route.query.fromName){
            this.show=true
        }
    },
    methods:{
        //左边返回事件
         onClickLeft() {
             this.$router.back()
         },
         //右边编辑事件
         onClickRight() {
             this.edit=!this.edit
         },
         //请求购物车数据
         getCart(){           
             this.axios({
                 method:'get',
                 url:'/findCar',
                 params:{
                     id:localStorage.getItem('token')
                 }
             }).then((result) => {
                //  console.log('请求购物车数据',result)
                 //每次请求时都清空全选状态
                 this.allChoose=false

                 //请求数据为空时
                 if(result.data.studas ===1301){
                     this.products =[];
                     return
                 }

                //获取请求的数据
                 this.products=result.data.data

                 //每次请求数据的时候，都要清空bol的布尔值
                 this.bol=[]
                //遍历一遍，，让每一个购物车数据加一个属性 bol为flase
                 this.products.map(v=>{
                     this.bol.push(false)
                 })
             }).catch((err) => {
                 console.log(err)
             });
         },
         //处理全选
         selectAll(){
            console.log('@@@@')
            // 清空bol
            this.bol=[];
            this.products.map(v=>{
                this.bol.push(this.allChoose)
            });
            this.handle();
         },
         //处理单选
         danSelect(){
             for(let index=0;index<this.products.length;index++){
                if(!this.bol[index]){
                    this.allChoose=false;
                    this.handle()
                    return
                }
             }
             console.log(this.cartId)
             this.handle();
             this.allChoose=true
         },
         //处理勾选
         handle(){
             this.cartId=[];
            for(let index=0;index<this.products.length;index++){
                if(this.bol[index]){
                    this.cartId.push(this.products[index].carId)
                }
             }
             console.log(this.cartId)
         },
        //删除订单
        delect(){
            //判断是否有勾线订单
            if(this.cartId.length==0){
                Toast('请勾选订单！')
                return
            }
            //判断是否登录
            if(!localStorage.getItem('token')){
                this.$router.push({name:'Login',query:{fromName:'Cart'}})
                this.$notify('请先登录！')
            }
            this.axios({
                method:'post',
                url:'/deleteCar',
                data:{
                    id:localStorage.getItem('token'),
                    carIdArr:this.cartId
                }
            }).then((result) => {
                console.log(result)
                this.getCart()
            }).catch((err) => {
                console.log(err)
            });
        },
        //提交订单
        goIn(){
            //判断是否有勾线订单
            if(this.cartId.length==0){
                Toast('请勾选订单！')
                return
            }
            //判断是否登录
            if(!localStorage.getItem('token')){
                this.$router.push({name:'Login',query:{fromName:'Cart'}})
                this.$notify('请先登录！')
            }
            //提交总价格，还有勾选的商品
            let data=[]
            this.products.map((v,index)=>{
                if(this.bol[index]){
                    //或者在数据添加之前，给products.product加一个count属性
                    // this.products[index].product.count=this.products.count
                    data.push(this.products[index])//这里直接添加products[index],里面就包含count，和product
                }
            })
            //路由跳转并传参
            this.$router.push({name:'Pay',query:{allPrice:this.allPrice.toFixed(2)/100,products:JSON.stringify(data)}})
        },
         onClickEditAddress(){
             console.log('修改地址')
         }
    },
}
</script>

<style lang="less" scoped>
.bg-Cart{
    .van-nav-bar{
        margin-bottom: 5px;
    }
    .shoppingCart{
        padding: 5px;
        .cart-item{
            display: flex;
            height: 100px;
            background: white;
            border-radius: 15px;
            align-items: center;
            margin-bottom: 5px;
        }
        .left-choose{
            width: 20px;
            margin: 0 10px;
        }
        img{
            width: 90px;
            height: 90px;
            margin: 5px;
        }
        .right-box{
            height: 80px;
            flex: 1;
            padding: 10px;
            .top-name{
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
                .price{
                    font-size: 14px;
                    font-weight: 600;
                    color: red;
                }
            }
        }
    }

    //底部修饰
    .van-submit-bar__bar{
        justify-content: space-between;
    }
    .van-submit-bar {
        bottom: 50px;
        border-top: 1px solid silver;
        border-bottom: 1px solid silver;
        border-radius: 10px 10px 0 0;
    }
}
.bottom-button {
    width: 160px;
    height: 40px;
  }
</style>>

