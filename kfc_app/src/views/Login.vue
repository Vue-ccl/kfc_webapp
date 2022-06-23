<template>
  <div class="login">
    <div class="logo_div2">
      <img src="../assets/login/logo2.png" alt="" />
      <!-- <button @click="gotoHome" class="login_btn3">先逛逛</button> -->
      
        <button class="login_btn3" @click="pastLogin">先逛逛</button>
     
    </div>
    <div class="logo_div3">
      <img src="../assets/login/logo.png" alt="" />
    </div>
    <!-- 登录表单 -->
    <van-form >
      <van-field v-model="userLoginInfo.phone"  phone="手机号码"  label="账号："  placeholder="手机号码" type="tel"  clearable/>
      <van-field v-model="userLoginInfo.password" type="password"  name="密码"  label="密码："  placeholder="密码"/>
      <div style="margin: 16px">
        <van-button  round  block  type="info"  native-type="submit"  class="login_btn1" @click="loginW">登录</van-button >
      </div> 
    </van-form>
    <button class="login_btn2" @click="showPopup">注册</button>

    <!-- 弹出层 注册表单-->
    <van-popup v-model="show"  position="bottom"  :style="{ height: '55%' }"  closeable  round>
      <h2 class="register_title">注册</h2>
      <van-form>
        <van-field v-model="register.phone" phone="手机号码"  label="账号："  placeholder="手机号码11位" type="tel"  clearable autocomplete="off"/>
        <van-field  v-model="register.password"  name="密码"  label="密码："  placeholder="密码字母开头6-16位"  
        :right-icon="registerEye? 'browsing-history-o':'closed-eye'" @click-right-icon="changeREye" :type="registerEye? 'text':'password'" autocomplete="off"/>
        <van-field  v-model="register.nickname"  type="text"  name="昵称"  label="昵称："  placeholder="昵称1-10位" clearable />
        <div style="margin: 16px">
          <van-button  round  block  type="info"  native-type="submit"  class="login_btn1"  @click="reginsterW">注册</van-button >
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script scoped>
const {validForm} =require('../assets/js/validForm.js')
export default {
  name: "Login",
  data() {
    return {
      //控制密码眼睛是否睁开
      registerEye:false,
      show: false,
      fromName:'123',
      //登录的时候记住手机号码和密码
      userLoginInfo:{
        phone:'',
        password: "",
      },
      //登记注册信息
      register:{
      phone: "",
      password: "",
      nickname:""
      },
    };
  },
  methods: {
    onSubmit(values) {
      console.log("submit", values);
    },
    // 控制弹出层
    showPopup() {
      this.show = true;
    },
    //先逛逛控制
    pastLogin(){
       if(this.$route.query.fromName){
          this.$router.go(-1)
        }else{
          this.$router.push('/')
        }
    },
    //注册
    reginsterW(){
        //构造表单验证信息  注册正则
        //
        let o = {
          phone: {
            value: this.register.phone,
            errorMsg: '手机号格式不正确',
            reg: /^1[3-9]\d{9}$/
          },
          password: {
            value: this.register.password,
            errorMsg: '密码由数字字母下划线组合(6-16字符)',
            reg: /^[A-Za-z]\w{5,15}$/
          },
          nickName: {
            value: this.register.nickname,
            errorMsg: '昵称由字母数字下划线汉字组合(1-10字符)',
            reg: /^[\w\u4e00-\u9fa5]{1,10}$/
          },
        };
        let isPass = validForm.valid(o);//调用老师写的js验证，
        //做一个拦截
        if(!isPass){
          return
        }
        //传递参数，get 使用params
        this.axios({
          methods:'get',//请求方式,
          url:'/register',//请求路径
          params:{
            user:this.register.phone,
            password: this.register.password,
            nickname: this.register.nickname
          },
        }).then((result) => {
          console.log(result)
          this.$notify(result.data.msg)
          if(result.data.status===200){
            this.show=false
            this.userLoginInfo.phone=this.register.phone
          }   

        }).catch((err) => {
          console.log(err)
          this.$notify(err.data.msg)
        });
    },
    //登录
    loginW(){
        //构造表单验证信息  注册正则
        //
        let o = {
          phone: {
            value: this.userLoginInfo.phone,
            errorMsg: '手机号格式不正确',
            reg: /^1[3-9]\d{9}$/
          },
          password: {
            value: this.userLoginInfo.password,
            errorMsg: '密码由数字字母下划线组合(6-16字符)',
            reg: /^[A-Za-z]\w{5,15}$/
          },
        };
        let isPass = validForm.valid(o);//调用老师写的js验证，
        //做一个拦截
        if(!isPass){
          console.log(1234)
          return
        }
        //传递参数，get 使用params
        this.axios({
          methods:'get',//请求方式,
          url:'/login',//请求路径
          params:{
            user:this.userLoginInfo.phone,
            password: this.userLoginInfo.password,
          },
        }).then(result=> {//请求成功
          console.log(result.data)
          localStorage.setItem('token',result.data.data)
          if(result.data.status ===300){//登录成功
            this.$notify(result.data.msg)
            if(this.$route.query.fromName){
              this.$router.go(-1)
            }else{
              this.$router.push('/')
            }
          }else{
             this.$notify(result.data.msg)//登录失败
          }        
        }).catch(err=> {//请求失败
          console.log(err)
          this.$notify('请求错误！')
        });
    },
    //控制密码眼睛
    changeREye(){
      this.registerEye=!this.registerEye
    }
    
  },
  mounted() {
   
  },

};
</script>

<style lang="less" scoped>
.login {
  font-size: 14px;
  text-align: center; 
  background-color: white;
  height: 100vh;
}
.logo_div2 {
  padding: 10px;
  height: 90px;
 background-color: white;
}
.logo_div2 img {
  width: 80px;
  height: 80px;
  float: left;
}
.logo_div3 img {
  width: 250px;
  height: 250px;
}
.login_btn1 {
  background-color: red;
  border: red;
}
.login_btn2 {
  background-color: white;
  border: 0 white;
  margin-top: 10px;
}
.login_btn3 {
  margin: 10px;
  border-radius: 50px;
  border: 1px solid red;
  background-color: white;
  float: right;
  color: red;
}
.register_title {
  text-align: left;
  text-indent: 10px; //缩进，或者em，一个em一个字体
}
</style>>
