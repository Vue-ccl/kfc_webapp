<template>
  <div>
    <!-- 头部 -->
    <van-nav-bar
      title="商品详细"
      left-text="返回"
      right-text="分享"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft"
      @click-right="showShare=true"
    />
    <!-- 分享面板底部弹出框 -->
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
    />
     <!-- @select="onSelect" -->

    <!-- 商品图片 -->
    <div class="product-img">
      <img :src="product.largeImg" alt=""> 
    </div>

    <!-- 商品名和商品价格 -->
    <div class="pro-na-pri">
      <div class="pro-name">{{product.name}}</div>
      <div class="pro-price">￥{{product.Price}}</div>
    </div>
    <!-- 选择数量 -->
    <div class="pro-number">
      <div class="pro-nu-title">选择数量：</div>
      <div class="pro-nu-select">  
        <van-stepper v-model="value" integer input-width="40px" button-size="32px"/>
      </div>
    </div>
    
    <!-- 商品详细和评价 -->
    <div class="pro-det-com">
        <van-collapse v-model="activeName" accordion >
          <van-collapse-item name="1" size="">
              <template #title>
              <div class="pro-det-title">商品评论： <van-icon name="question-o" /></div>
              </template>
              <div>
                <p>好吃到爆啊！！！！！！</p>
                <p>好吃到爆啊！！！！！！</p>
                <p>好吃到爆啊！！！！！！</p>
                <p>好吃到爆啊！！！！！！</p>
                <p>好吃到爆啊！！！！！！</p>
                <p>好吃到爆啊！！！！！！</p>
                <p>好吃到爆啊！！！！！！</p>
                <p>好吃到爆啊！！！！！！</p>
                <p>好吃到爆啊！！！！！！</p>
              </div>
          </van-collapse-item>
          <van-collapse-item name="2" >
               <template #title>
               <div class="pro-det-title">商品详情： <van-icon name="question-o" /></div>
               </template>

               <div class="pro-det-text">掌柜描述：</div>
               <div><span v-for="(desc,index) in product.desc" :key="index">{{desc}}</span></div>

               <div class="pro-det-text">注意事项：</div>
               <div ><p v-for="(notice,index) in product.notice" :key="index">{{notice}}</p></div>

               <div style="height:10px"></div>
          </van-collapse-item>
        </van-collapse>
    </div>

          <!-- 占位标签 -->
    <div style="height:50px;"></div>

    <!-- 底部 -->
    <van-goods-action placeholder="true">
      <van-goods-action-icon icon="chat-o" text="客服" color="#ee0a24" />
      <van-goods-action-icon icon="cart-o" text="购物车" @click="toCart" />
      <van-goods-action-icon icon="star" text="已收藏" color="#ff5000" v-if="show" @click="cancelCollection"/>
      <van-goods-action-icon icon="star-o" text="收藏" v-else @click="addCollection"/>
      
      <van-goods-action-button type="warning" text="加入购物车" @click="addCart" />
      <van-goods-action-button type="danger" text="立即购买" @click="goIn"/>
  </van-goods-action>
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
  data() {
    return {
      value:1,
      active:1,
      activeName:'2',
      product:'',
      showShare:false,
      show:false,
      options: [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' },
      ],
    }
  },
  created(){
    this.getDetail()//根据获取到的商品pid，获取商品详细信息
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    onClickRight() {
       console.log('触发分享')
    },
    //请求获取商品详细
    getDetail(){
      console.log(this.$route.query.pid)
      this.axios({
        method:'get',
        url:'/detail',
        params:{
          pid:this.$route.query.pid
        }
      }).then((result) => {
        this.product=result.data.data[0]
        // console.log(this.product)
      }).catch((err) => {
        console.log(err)
      });
    },
    //判断是否已登录
    isLogin(){
        if(!localStorage.getItem('token')){
        this.$router.push({name:'Login',query:{fromName:'Detail'}})
        this.$notify('请先登录！')
      }else{
        return true
      }
    },
    //加入购物车
    addCart(){
      //加入购物车之前，判断用户是否登录，没有登录则跳转到登录界面
      if(this.isLogin()){
          this.axios({
          method:'post',
          url:'/addCar',
          data:{
            id:localStorage.getItem('token'),
            count:this.value,
            product:this.product
          }
        }).then((result) => {
          console.log(result)
          Toast(result.data.msg)
        }).catch((err) => {
          console.log(err)
        });
      }else{
        return
      }
    },
    //前往购物车
    toCart(){
     if(this.isLogin()){
         this.$router.push({name:'Cart',query:{fromName:'Detail'}})
     }else{
        return 
     }
    },
    //提交订单
    goIn(){
        //判断是否登录
        if(!localStorage.getItem('token')){
            this.$router.push({name:'Login',query:{fromName:'Cart'}})
            this.$notify('请先登录！')
        }
    },
    //收藏商品
    addCollection(){
        let pid=this.product.pid
        localStorage.setItem(pid,pid)
        this.show=true
        Toast('已收藏！')
    },
    //取消收藏
    cancelCollection(){
        localStorage.removeItem(arr.pid)
        this.show=false
        Toast('已取消收藏！')
    }
  },
};
</script>

<style lang="less" scoped>
.product-img{
  background-color: white;
  img{
    width: 100%;
    height: 210px;
  }

}
.pro-na-pri{
  background-color: white;
  font-size: 18px;
  font-weight: 600;
  text-indent: 15px;
  padding: 5px 0px ;
  border-radius: 0 0 10px 10px;
    .pro-name{
      width: 95%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;  
    }
    .pro-price{
      color: red;
      margin: 5px 0;
    }
    
}
.pro-number{
  display: flex;
  background: white;
  justify-content: space-between;
  padding: 10px;
  margin-top: 5px;
  border-bottom: 1px solid silver;
  border-radius: 10px 10px 0 0;
  .pro-nu-title{
    font-size: 18px;
  }
  
}
.pro-det-com{
 .pro-det-title{
   font-size: 18px;      
 }
 .pro-det-text{
    margin-top: 5px;
    color: rgb(24, 23, 23);
  }
  span::after{
    content: '+';
  }
  span:last-child::after{
    content: '';
  }
  p{
    margin: 0;
  }
}
/deep/.van-share-sheet__options {
    display: flex;
    justify-content: space-around !important;
}
</style>>
