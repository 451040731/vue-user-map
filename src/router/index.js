import Vue from 'vue'
import Router from 'vue-router'
import store from "../store/index"

// 懒加载导入组件
const Index = r => require.ensure([], () => r(require('@/page/Index/index')), 'Index')//首页
const StoreDetail = r => require.ensure([], () => r(require('@/page/Store/detail')), 'StoreDetail')//店铺详情
const StoreMap = r => require.ensure([], () => r(require('@/page/Store/map')), 'StoreMap')//店铺地图
const Result = r => require.ensure([], () => r(require('@/page/Result/result')), 'Result')//结果页面

Vue.use(Router)

//路由选址
const router = new Router({
  //mode: 'history',
  linkActiveClass: 'active',
  base: __dirname,
  routes: [
        { path: '', redirect: '/index' },//重定向
        { 
            path: '/index', 
            name: 'Index', 
            component: Index,
            meta: {
                pageTitle: '客户关系管理',
                keepAlive: true,
                isBack: false
            }
        },
        { 
            path: '/store/detail', 
            name: 'StoreDetail', 
            component: StoreDetail,
            meta: {
                pageTitle: '客户关系详情',
            }
        },
        { 
            path: '/store/map', 
            name: 'StoreMap', 
            component: StoreMap,
            meta: {
                pageTitle: '店铺地图',
            }
        },
        { 
            path: '/result', 
            name: 'Result', 
            component: Result,
            meta: {
                pageTitle: '浏览结果',
            }
        }
    ]
})

//设置路由拦截，暂时判断uid是否为空
router.beforeEach(async function (to, from, next) {
    /**
     * 兼容微信设置页面的title
     */
    let setDocumentTitle = function (title) {
        document.title = title;
        let ua = navigator.userAgent;
        if (/\bMicroMessenger\/([\d\.]+)/.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
            var i = document.createElement('iframe');
            i.src = '/favicon.ico';
            i.style.display = 'none';
            i.onload = function () {
                setTimeout(function () {
                    i.remove();
                }, 9);
            };
            document.body.appendChild(i);
        }
    };
    typeof to.meta.pageTitle !== undefined && setDocumentTitle(to.meta.pageTitle);

    if (!store.state.uid && !store.state.token) {
        next();
    }else{
        next({
            path: "/result",
            query: {
                succ: 0
            }
        });
    }
})

export default router