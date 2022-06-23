<template>
    <div class="my">
        <div class="bgimg">
            <img src="../assets/home/mytop.jpg" alt="">
        </div>

        <!-- 个人设置 -->
        <div class="person">
            <div class="person-top">
                <div class="top-photo">
                    <img src="../assets/login/logo3.png" alt="">
                </div>
                <div class="top-name">Nico</div>
            </div>
            <div>
                <van-cell title="个人资料" is-link />
                <van-cell title="我的订单" is-link :to="{name:'Order'}"/>
                <van-cell title="我的收藏" is-link />
                <van-cell title="地址管理" is-link :to="{name:'Address'}"/>                
            </div>
        </div>

        <!-- 退出登录 -->
        <div class="escLogin" @click="esc">
        <van-button color="linear-gradient(to right, #ff6034, #ee0a24)" block round >退出登录</van-button>
        </div>
    </div>
</template>

<script>
import { Dialog } from 'vant'
    export default {
        name:'My',
        methods:{
            esc(){
                Dialog.confirm({
                    title:'是否退出登录？'
                }).then((result) => {
                    localStorage.removeItem('token')
                    this.$router.replace({name:'Login'})
                }).catch((err) => {
                    console.log(err)
                });
                
            }
        }
    }
</script>

<style lang="less" scoped>
.my{
    height: 100vh;
}
.bgimg{
    img{
        width: 100%;
        height: 25%;
    }
}
.person{
    width: 90%;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    position: relative;
    top: -50px;
    margin: 0 auto;
    
    .person-top{
        display: flex;
        margin-bottom: 12px;
        .top-photo{
            img{
                width: 100px;
                height: 100px;
                margin: 10px;
                border-radius: 50%;
                background: white;
            }
        }
        .top-name{
            font-size: 20px;
            padding: 0 auto;
            flex: 1;
            display: flex;
            // justify-content: center;
            align-items: center;
            
        }
    }
}
.escLogin{
    padding: 0 5px;
    position: relative;
    bottom: -50px;
}

</style>