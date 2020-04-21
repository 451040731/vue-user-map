import Vue from "vue";
import axios from "axios";
import Qs from "qs";
//import router from "../router/index";
import store from '../store/index';

// 在vue原型中添加$http方法等于axios
Vue.prototype.$http = axios;
Vue.prototype.$qs = Qs;
// axios 配置
axios.defaults.timeout = 5000;

if (process.env.NODE_ENV == 'development') {
	//axios.defaults.baseURL = "http://192.168.7.162:8200";
	axios.defaults.baseURL = "http://10.0.0.242:8200";
} else if (process.env.NODE_ENV == 'production') {
	axios.defaults.baseURL = '/api';
}
// axios.defaults.headers.post["Content-Type"] = "application/json";

//axios的一些配置，比如发送请求显示loading，请求回来loading消失之类的
axios.interceptors.request.use(config=>{
		
		//配置发送请求的信息
		store.commit('changeGlobalSpin', true);
		//设置请求头
		if(localStorage.getItem('token') && localStorage.getItem('uid')) {
			config.headers['Token'] = localStorage.token
			config.headers['Uid'] = localStorage.uid
		}
		return config;
	},err=>{
		return Promise.reject(err);
	}
);
axios.interceptors.response.use(response=>{
		//配置请求回来的信息
		store.commit('changeGlobalSpin', false);
		if(response){
			switch (response.data.code) {
				case 1:
				//清除token
				localStorage.removeItem('Token');
				localStorage.removeItem('Uid');
				//跳转失败页
				this.$router.push({
					path: "/result",
					query: { redirect:router.currentRoute.fullPath,succ: 0 }
				});
			}

		}
		return response;
	},err=>{
		return Promise.reject(err.response.data);

	}
);

/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params){    
    return new Promise((resolve, reject) =>{        
        axios.get(url, {            
            params: params        
        })        
        .then(res => {            
            resolve(res.data);        
        })        
        .catch(err => {            
            reject(err.data)        
        })    
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {    
    return new Promise((resolve, reject) => {         
        axios.post(url, params)        
        .then(res => {            
            resolve(res.data);        
        })        
        .catch(err => {            
            reject(err.data)        
        })    
    });
}

export default{
	get,
	post
}
