/* * @Author: LCJ * */
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";//路由
import store from "./store/index";//状态管理
import api from "./fetch/api";//请求方法
import { msg } from '@/utils'//公共方法
import "./assets/scss/base.scss";

//按需引入vant组件
import { Tag, Button, Toast, Dialog, CountDown, Popup, DropdownMenu, DropdownItem, Tab, Tabs,Icon } from 'vant';
Vue.use(Tag);
Vue.use(Button);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(CountDown);
Vue.use(Popup);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Tab).use(Tabs);
Vue.use(Icon);

Vue.config.productionTip = false;

import * as filters from '@/filters'//注册全局过滤器
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})


Vue.prototype.$api = api;//挂载全局请求方法
Vue.prototype.$utils = { msg };//挂载公共方法

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");