import { Toast } from 'vant'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',//访问的路径
    name: 'Login',//页面名字
    //导入你新建的页面，这是第一种方式，懒加载
    component: () => import('../views/Login.vue'), 
  },
  {
    path: '/main',//访问的路径
    name: 'Main',//页面名字
    component: () => import('../views/Main.vue'),
    //二级路由
    children:[
      {
       path:'/home',
        name:'Home',
      component:Home
      },
      {
        path:'/my',
        name:'My',
        component: () => import('../views/My.vue'),
        beforeEnter: (to, from, next) => {
          if(localStorage.getItem('token')){
            next()
          }else{
            next({name:'Login'})
            Toast('请登录！')
          }
        }
       },
       {
        path:'/search',
        name:'Search',
        component:() =>import('../views/Search')
      },
      {
        path:'/cart',
        name:'Cart',
        component:() =>import('../views/Cart'),
        beforeEnter: (to, from, next) => {
          if(localStorage.getItem('token')){         
              next()
          }else{
            next({name:'Login'})
            Toast('请登录！')
          }
        }
      },
    ]
  },
  {
    path:'/detail',
    name:'Detail',
    component:() =>import('../views/Detail')
  },
  
  {
    path:'/pay',
    name:'Pay',
    component:() =>import('../views/Pay')
  },
  {
    path:'/newAddress',
    name:'NewAddress',
    component:() =>import('../views/NewAddress')
  },
  {
    path:'/order',
    name:'Order',
    component:() =>import('../views/Order')
  },
  {
    path:'/address',
    name:'Address',
    component:() =>import('../views/Address')
  },
  
  
  //重定向 当我访问/ 的时候，就跳转到Home页面
  {
    path:'/',
    redirect:{
      name:'Home'
    }
  }


]

const router = new VueRouter({
  routes
})

export default router
