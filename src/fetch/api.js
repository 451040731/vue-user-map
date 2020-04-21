import http from "./request";

//接口类
export default {
	// 获取店铺列表
	getStoryList(params) {
		return http.post("/store/getStoryList", params);
	},
	// 获取业务员日志
	getSalerLog(params) {
		return http.post("/store/getSalerLog", params);
	},
	// 获取店铺详情
	getStoreInfo(params) {
		return http.post("/store/getStoreInfo", params);
	},
	// 获取店铺日志
	getStoreLog(params) {
		return http.post("/store/getStoreLog", params);
	},
	// 更新店铺状态
	changeStoreState(params) {
		return http.post("/store/changeStoreState", params);
	},
	// 查询经纬度
	getStoryLocationList(params) {
		return http.post("/store/getStoryLocationList", params);
	}
}
