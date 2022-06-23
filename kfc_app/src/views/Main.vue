<template>
  <div>
    <router-view/>
    <!-- 底部 tabbar标签-->
    <van-tabbar v-model="tabbarIndex" active-color="#ee0a24" inactive-color="#000" :placeholder="true"  route>
      <van-tabbar-item v-for="(item,index) in tabbarData" :key="index" :to="item.url">
          <span>{{item.title}}</span>
      <template #icon="props">
          <img :src="props.active ? item.icon.active : item.icon.inactive"/>
      </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      tabbarIndex:0,
      tabbarData:[
          {
              title:"首页",
              icon:{
                   active:require("../assets/Tabbar/index_act.png"),
                   inactive:require("../assets/Tabbar/index_inact.png"),
              },
              url:{
                  name:"Home"
              }            
          },
          {
              title:"搜索",
              icon:{
                  active:require("../assets/Tabbar/search_act.png"),
                  inactive:require("../assets/Tabbar/search_inact.png"),
              },
              url:{
                  name:"Search"
              }            
          },      
          {
              title:"购物车",
              icon:{
                  active:require("../assets/Tabbar/cart_act.png"),
                  inactive:require("../assets/Tabbar/cart_inact.png"),
              },
              url:{
                  name:"Cart"
              }            
          },
          {
              title:"我的",
              icon:{
                  active:require("../assets/Tabbar/my_act.png"),
                  inactive:require("../assets/Tabbar/my_inact.png"),
              },
              url:{
                  name:"My"
              }            
          },
          
          
      ]
    };
  },
};
</script>

