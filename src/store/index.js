import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'

// 注册vuex
Vue.use(Vuex)

// 导出一个新生成的Store对象
export default new Vuex.Store({
    modules: {
        app
    },
})
