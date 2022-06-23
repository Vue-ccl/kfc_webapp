<template>
    <div class="search">
        <!-- 头部搜索 -->
        <van-sticky>
            <van-search v-model="value"  background="#ff0000" placeholder="请输入搜索关键词" @search="onSearch" show-action autofocus>
                <template #action>
                    <div @click="onSearch">搜索</div>
                </template> 
            </van-search>
        </van-sticky>

        <!-- 没有数据时显示 -->
        <div class="noData" v-if="products.length===0">       
            <van-empty description="暂无数据">
            <van-button round type="danger" class="bottom-button" @click="anSearch">搜索薯条看看</van-button>
            </van-empty>
        </div>

        <!-- 有数据时显示 -->
        <div v-else>
            <div class="resultNum">已为您找到{{products.length}}个结果</div>
            
                <!-- 商品栏 -->
                <div class="shoppingCart">
                    <div class="cart-item" v-for="item in products" :key="item.carId" @click="toDetail(item.pid)">
                        <!-- 左边 -->

                        <img :src="item.largeImg" alt="">
                        <div class=" right-box">
                            <!-- 商品名 -->
                            <div class="top-name">
                                {{item.name}}
                            </div>
                            <!-- 价格和数量 -->
                            <div class="price-num">
                                <!-- 价格 -->
                                <div class="price">￥{{item.Price}}</div>
                                <!-- 步进器 -->
                                
                            </div>
                        </div>
                    </div>
                </div>
        </div>

    </div>
</template>

<script>
import { Toast } from 'vant';
    export default {
        name:'Search',
        data() {
            return {
                value:'',
                products:[]
            }
        },
        created(){
            this.value='1',
            this.onSearch()
        },
        methods:{
            // 无搜索结果时搜索看看
            anSearch(){
                this.value='薯条';
                this.onSearch()
            },
            //搜索
            onSearch(){
                if(!this.value.trim()){
                    Toast('输入不能为空！');
                    return
                }
                //加载状态
                Toast.loading({
                    message: '搜索中...',
                    forbidClick: true,
                });
                this.axios({
                    method:'get',
                    url:'/search',
                    params:{
                        key:this.value
                    }
                }).then((result) => {
                    Toast.clear()//清除加载状态
                    this.products=[]//清空
                    // console.log(result.data.data)
                    this.value=''
                    if(result.data.stutas==1901){//查询无数据
                        return
                    }
                    if(result.data.stutas==1902){//查询有数据
                        this.products=result.data.data;
                    }
                }).catch((err) => {
                    console.log(err)
                });
            },
            //跳转到商品详细
            toDetail(pid){
                // console.log(pid)
                this.$router.push({name:'Detail',query:{pid}})
            }
        },
    }
</script>

<style lang="less" scoped>
    .search{
        // text-align: center;
        .noData{
            
            display: flex;
            align-items: center;
            flex-direction: column;
            font-size: 16px;
            img{
            margin-top: 50px;
            width: 200px;
            height: 200px;
            }
        }
    }
    .resultNum{
        font-size: 16px;
        text-indent: 10px;
    }
    .shoppingCart{
        padding: 10px;
        .cart-item{
            display: flex;
            height: 100px;
            background: white;
            border-radius: 15px;
            align-items: center;
            margin-bottom: 5px;
            padding-left: 10px;
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
                width:230px;
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
</style>