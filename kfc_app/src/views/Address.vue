<template>
    <div class="address">
        <!-- 头部 -->
        <van-nav-bar title="地址管理" left-text="返回" left-arrow @click-left="onClickLeft" fixed z-index="999" placeholder/>  
        <!-- 红色背景 -->
        <div class="bg-red"></div>
        <div>
            <van-address-list
                v-model="chosenAddressId"
                :list="list"      
                default-tag-text="默认"
                @add="onAdd"
                @edit="onEdit"
                />
        </div>
    </div>
</template>

<script>
import { Dialog} from 'vant'
import {Toast} from 'vant'
    export default {
        name:'Address',
        data() {
            return {
                chosenAddressId:'',
                list: [],
            }
        },
        created(){
            //调用请求获取地址
            this.getAddrress()
        },
        methods:{
            onClickLeft(){
                 this.$router.go(-1)
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
                    this.list=[]
                    //遍历结果，把每一组数组结果封装到每一个obj对象中，在把obj对象push到list数组中
                    result.data.data.map((v,index)=>{
                        let obj={}
                        obj.id=v.addId
                        obj.name=v.name
                        obj.address=v.area + v.detialArea
                        obj.tel=v.phone
                        obj.isDefault=v.defaultAddress
                        if(v.defaultAddress){
                            this.list.unshift(obj)
                            this.chosenAddressId=v.addId
                        }else{
                            this.list.push(obj)                                  
                        }
                        
                    })
                    // console.log(this.list)
                }).catch((err) => {
                    console.log(err)
                });
            },
            //删除地址
            onEdit(item){
                //取消与确认
                Dialog.confirm({
                    title: '是否删除地址？',
                    // message: '弹窗内容',
                }).then(() => {
                        this.axios({
                            method:'post',
                            url:'/deleteAddress',
                            data:{
                                userId:localStorage.getItem('token'),
                                addId:item.id
                                }
                        }).then((result) => {
                            Toast('删除地址成功！')
                            // console.log(result)
                            this.getAddrress()
                        }).catch((err) => {
                            console.log(err)
                            Toast('删除地址失败！')
                        });
                        })
                .catch(() => {
                    return
                });
            },
            //跳转新增地址页面
            onAdd(){
                this.$router.push({name:'NewAddress'})
            },
        }
    }
</script>

<style lang="less" scoped>
.address{
    .bg-red{
        height: 100px;
        background: red;
    }
}
</style>