import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'

//导入vant

import { NoticeBar, Search, Sticky ,
  Form,Field,
  Tabbar,TabbarItem,
  Popup,Notify,Icon,
  Swipe, SwipeItem,Lazyload,
  NavBar,
  GoodsAction, GoodsActionIcon, GoodsActionButton, 
  Stepper ,
  Collapse, CollapseItem,
  Loading,
  SubmitBar,
  Tab, Tabs,
  Checkbox, CheckboxGroup,
  Cell, CellGroup,
  Tag,
  AddressList ,
  AddressEdit ,
  ShareSheet, 
  Button,
  Empty
} from 'vant'



//全局注册
Vue.use(Button)
Vue.use(NoticeBar);
Vue.use(Sticky)
Vue.use(Search)
Vue.use(Form)
Vue.use(Field)
Vue.use(Tabbar)
Vue.use(TabbarItem )
Vue.use(Popup)
Vue.use(Notify)
Vue.use(Icon)
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
Vue.use(NavBar);
Vue.use(GoodsAction);
Vue.use(GoodsActionButton);
Vue.use(GoodsActionIcon);
Vue.use(Stepper);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Loading);
Vue.use(SubmitBar);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Tag);
Vue.use(AddressList)
Vue.use(AddressEdit )
Vue.use(ShareSheet )
Vue.use(Empty)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
