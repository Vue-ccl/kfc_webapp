<template>
    <div class="newAddress">
        <van-nav-bar title="地址编辑" left-text="返回" left-arrow @click-left="onClickLeft" fixed z-index="999" placeholder/>  
        <van-address-edit
            :area-list="areaList"
            show-postal       
            show-set-default
            show-search-result
            :search-result="searchResult"
            :area-columns-placeholder="['请选省', '请选市', '请选区']"
            @save="onSave"
            />
            <!--  
            @delete="onDelete"
            @change-detail="onChangeDetail" -->
    </div>
</template>

<script>
import { Toast } from 'vant'
import areaList from '../assets/js/area'
    export default {
        name:'NewAddress',
        data() {
            return {
                areaList,
                searchResult: [],
            }
        },
        methods:{
            onClickLeft(){
                 this.$router.go(-1)
            },
            //保存地址
             onSave(content) {
                console.log(content);
            
                //判断是否登录
                if(!localStorage.getItem('token')){
                this.$router.push({name:'Login',query:{fromName:'Cart'}})
                this.$notify('请先登录！')
              }
                
                Toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                });

                this.axios({
                    method:'post',
                    url:'/address',
                    data:{
                        userId:localStorage.getItem('token'),
                        name:content.name,
                        phone:content.tel,
                        area:content.province+content.city+content.county,
                        detialArea:content.addressDetail,
                        mail:content.areaCode,
                        defaultAddress:content.isDefault
                    }
                }).then((result) => {
                    console.log(result)
                    Toast.clear()
                    
                    if(result.data.stutas===1999){//保存成功后跳转回去
                        this.$router.go(-1)
                        this.$notify('保存成功！')
                    }else{
                        this.$notify('保存失败！')
                    }
                }).catch((err) => {
                    console.log(err)
                    Toast.clear()
                });
            },
        }
    }
</script>

<style lang="less" scoped>
.newAddress{
    height: 100vh;
    overflow: hidden;
}

</style>