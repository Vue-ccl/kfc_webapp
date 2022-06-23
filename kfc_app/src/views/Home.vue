<template>
  <div class="home">

    <van-sticky>
   <iframe id="geoPage" width=0 height=0 frameborder=0 style="display:none;" 
    scrolling="no" src="https://apis.map.qq.com/tools/geolocation?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp"></iframe>
    <!-- 头部 -->
    <div class="nav-box">
      <div class="time">
        <van-icon name="location" size="18px"/>
        <van-loading type="spinner" size="24px" v-show="isCity" />
        <div>{{city}}</div>
      </div>
      <van-search class="search" placeholder="请输入搜索关键词" background="red" :fixed="true" @focus="onFocus"  v-model="value"/>
    </div>
    </van-sticky>

    <!-- 文字较短时，通过设置 scrollable 属性开启滚动播放 -->
    <van-notice-bar  left-icon="volume-o"  :scrollable="false"  text="广告位出租！！！" />

    <!-- 轮播图 -->
    <div class="banner">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="image in banner" :key="image.pid" @click="toDetail(image.pid)">
          <img v-lazy="image.bannerImg" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 热卖 -->
    <div class="hot">
      <!-- 热卖推荐 -->
        <div class="hot-buy" >
          <div class="hot-text">热卖推荐</div>
        </div>

      <!-- 热卖商品 -->
      <div class="hot-production"> 
        <div class="pro-item" v-for="item in product" :key="item.id"  @click="toDetail(item.pid)">
          <img :src="item.largeImg">
          <div class="pro-title">{{item.name}}</div>
          <div class="price">￥{{item.Price}}</div>
        </div>
      </div>
    </div>
    <!-- <div style="height:53em"></div> -->
  </div>
</template>

<script>
import { location } from "../plugins/Location";
export default { 
  data() {
    return {
      isCity:true,
      city:'',
      value:'',
      banner:[],
      product:[]
    };
  },
  created(){//生命周期函数，页面加载时触发，这里一般用来发送请求数据
    this.getLocation(); // 调用获取地理位置
    this.getBanner();
    this.getProduct();
  },
  watch:{
    city(){
        if(this.city !=""){
        this.isCity=!this.isCity
        }
       
    }
   
  },
  methods:{
    /**获取地图定位 1*/
      async getLocation() {
        let _that = this;
        let geolocation = location.initMap("map-container"); //定位
        AMap.event.addListener(geolocation, "complete", result => {
          // console.log(result.addressComponent.city)
          // console.log(this)
          _that.lat = result.position.lat;
          _that.lng = result.position.lng;
          _that.province = result.addressComponent.province;
          _that.city = result.addressComponent.city;
          _that.district = result.addressComponent.district;
        });
      },
      // 请求获取轮播图数据
       getBanner(){
        this.axios({
          method:'get',
          url:'/bannar'
        }).then(res =>{
          // console.log(res)
          this.banner=res.data.data.result
          // console.log(this.banner)
        }).catch(err =>{
          console.log(err)
        })
      },
      //请求获取商品
      getProduct(){
        this.axios({
          method:'get',
          url:'/product'
        }).then(res =>{
          this.product=res.data.data
          // console.log(this.product)
        }).catch(err =>{
          console.log(err)
        })
      },
      //跳转到商品详细
      toDetail(pid){
        // ；
        this.$router.push({name:'Detail',query:{pid}})
      },
      //跳转到搜索界面
      onFocus(){     
         this.$router.push({name:'Search'})
      }

  }
};
</script>

<style lang="less" scoped>
.home {
  .nav-box {
    height: 50px;
    background-color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow: hidden;
    align-content: center;
    background-color: red;
    .time {
      font-size: 14px;
      color: #2c3e50;
      font-weight: 580;
      padding: 13px 5px 5px 5px;
      display: flex;

    }
    .search {
      width: 80%;
    }
  }
  .banner{
     .my-swipe{
      height: 150px;
      height: 180;
        img{
          height: 150px;
          width: 100%;
          border-radius: 15px;
        }
     }
  }
  .hot{
    padding:5px;
  }
  .hot-buy{
    height: 40px;
    .hot-text{
      width: 100px;
      height: 40px;
      border-radius: 0 20px 0 0 ;
      background-color: red;
      margin-top: 5px;
      text-align: center;//字体垂直居中，只有一行时使用
      line-height: 40px;
      overflow: hidden;
      font-size: 14px;
      color: #f8e5e6;
    }
  }
  .hot-production{  
    overflow: hidden;
    .pro-item{
      height: 200px;
      width: calc(50% - 5px);
      background-color: white;
      float: left;
      overflow: hidden;//超出隐藏
      margin-top: 10px;
      margin-right: 10px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      img{
        width: 95%;
        height: 150px;
        margin: 5px;      
      }
      .pro-title{
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-indent: 10px;
      }
      .price{
        font-size: 14px;
        text-indent: 10px;
        color: red;
      }
    }
    .pro-item:nth-child(2n){
      margin-right: 0px;
    }
  }
}
</style>