<template>
	<div class="main">
		<div class="tab">
			<div class="item" v-for="(item, index) in tabList" :key="index + 1" :class="{ active: state == index + 1 }"
				@click="tabClick(index + 1)">
				{{ item }}
			</div>
		</div>

		<van-dropdown-menu class="menu" v-if="state == 1" active-color="#ffd314">
			<van-dropdown-item v-model="value1" :options="option1" @change="menuChange1" />
			<van-dropdown-item v-model="value2" :options="option2" @change="menuChange2" />
		</van-dropdown-menu>

		<mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit"
			:class="state != 1 ? 'mescrollLog' : ''">
			<div class="list" v-if="state == 4">
				<log-list :dataLogList="storeLogList" :nameFlag="nameFlag"></log-list>
			</div>
			<div id="list" class="list" v-else>
				<div class="list-cell" v-for="(item, index) in storyList" :key="index" @click="toStoreDetail(item.id)">
					<div class="img">{{ item.ud_id || item.id }}</div>
					<div class="right store">
						<div class="title">
							<div class="cell-primary">
								{{ item.title | ellipsis(20) }}
							</div>
						</div>
						<div class="address">
							{{ item.province }}{{ item.city }}{{ item.address }}
						</div>
						<div class="cen">
							<div style="color:#000">{{ item.contact || "无姓名" }}</div>
							<div v-if="item.phone"><van-icon name="phone-o" size="16"/>{{ item.phone }}</div>
						</div>	
						<div v-if="state == 2" class="time">
							系统释放：
							<van-count-down :time="item.protect_end_time" format="DD 天 HH 时 mm 分 ss 秒" />
						</div>
						<div v-if="item._distance" class="distance">
							{{ item._distance}}km
						</div>
						<div v-else class="distance">
							{{ item.add_time | parseTime }}
						</div>
					</div>
				</div>
			</div>
		</mescroll-vue>

		<router-link v-if="state != 4" class="vicon icon-map" :to="{ name: 'StoreMap'}">客户地图</router-link>
		<baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true" ak="4Uzg40oyzbtgTxT2qVnL9pjXIGF7y9P6">
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
        </baidu-map>
	</div>
</template>

<script>
import { mapMutations } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
import mescrollEmpty from "../../assets/images/mescroll-empty.png";
import mescrollTop from "../../assets/images/mescroll-totop.png";

import logList from "@/components/logList.vue";

import BaiduMap from 'vue-baidu-map/components/map/Map.vue';
import BmGeolocation from 'vue-baidu-map/components/controls/Geolocation.vue'; //定位
import BmView from 'vue-baidu-map/components/map/MapView'; //地图视图

export default {
	components: {
		logList,
		MescrollVue, // 注册mescroll组件
		BaiduMap,
        BmGeolocation,
        BmView,
	},
	data() {
		return {
			uid: "",
			state: 1,
			tabList: ["公海客户", "保护客户", "签约客户", "操作日志"],
			distance: 0, //距离半径
			order: 1, //排序
			storyList: [],
			storeLogList: [],
			center: {lng: 0, lat: 0},
			zoom: 5,
			initLocation: false,
			isFirstEnter:false,
			nameFlag: true,
			mescroll: null, // mescroll实例对象
			mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
			mescrollUp: {
				// 上拉加载的配置.
				callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
				//以下是一些常用的配置,当然不写也可以的.
				page: {
					num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
					size: 10 //每页数据条数,默认10
				},
				htmlLoading:'<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>', //上拉加载中的布局
				htmlNodata: '<p class="upwarp-nodata">-- 暂无更多数据--</p>',
				noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据
				toTop: {
					//回到顶部按钮
					src: mescrollTop, //图片路径,默认null,支持网络图
					offset: 1000 //列表滚动1000px才显示回到顶部按钮
				},
				empty: {
					//列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
					warpId: "list", //父布局的id (1.3.5版本支持传入dom元素)
					icon: mescrollEmpty, //图标,默认null,支持网络图
					tip: "暂无相关数据~" //提示
				}
			},
			//下拉菜单
			value1: 0,
			option1: [
				{ text: "附近", value: 0 },
				{ text: "1km", value: 1000 },
				{ text: "3km", value: 3000 },
				{ text: "5km", value: 5000 },
				{ text: "10km", value: 10000 }
			],
			value2: 1,
			option2: [
				{ text: "离我最近", value: 1 },
				{ text: "最新加入", value: 2 }
			]
		};
	},
	created() {
		this.uid = this.$route.query.uid;
		this.getUid(this.uid);

		this.isFirstEnter=true;
		
		let token = this.$route.query.token;
		this.$store.commit('getToken', token);
	},
	beforeRouteEnter(to, from, next) {
		// 如果没有配置顶部按钮或isBounce,则beforeRouteEnter不用写
		next(vm => {
			// 滚动到原来的列表位置,恢复顶部按钮和isBounce的配置
			vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter();
		});
	},
	beforeRouteLeave(to, from, next) {
		// 如果没有配置顶部按钮或isBounce,则beforeRouteLeave不用写
		// 记录列表滚动的位置,隐藏顶部按钮和isBounce的配置
		this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave();
		next();
	},
	methods: {
		//获取定位
		async handler({BMap, map}) {
            let _this = this;	// 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
			var geolocation = new BMap.Geolocation();
            await geolocation.getCurrentPosition(function(r){
				_this.center.lng = r.longitude;
				_this.center.lat = r.latitude;
				_this.initLocation = true;	
				_this.mescroll.resetUpScroll();
			},{enableHighAccuracy: true})
        },
		//选项卡
		tabClick(state) {
			this.state = state;
			this.mescroll.resetUpScroll(); // 刷新列表数据
		},
		// mescroll组件初始化的回调,可获取到mescroll对象
		mescrollInit(mescroll) {
			this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
		},
		// 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
		async upCallback(page, mescroll) {
			if (this.state == 4) {
				this.$api.getSalerLog(
						this.$qs.stringify({
							page: page.num, // 页码
							limit: page.size // 每页长度
						})
					)
					.then(res => {
						if (res.code == 20000) {
							let data = page.num == 1 ? [] : this.storeLogList;
							data.push(...res.data.list);
							this.storeLogList = data;
							// 数据渲染成功后,隐藏下拉刷新的状态
							this.$nextTick(() => {
								mescroll.endSuccess(res.data.list.length);
							});
						} else {
							this.$utils.msg(res.msg);
						}
					})
					.catch(error => {
						mescroll.endErr();
					});
			} else {
				if(this.initLocation){
					this.$api.getStoryList(this.$qs.stringify({
						state: this.state,
						distance: this.distance,
						lat: this.center.lat,
						lng: this.center.lng,
						order: this.order,
						page: page.num, // 页码
						limit: page.size // 每页长度
					}))
					.then(res => {
						if (res.code == 20000) {
							let data = page.num == 1 ? [] : this.storyList;
							data.push(...res.data.list);
							this.storyList = data;
							// 数据渲染成功后,隐藏下拉刷新的状态
							this.$nextTick(() => {
								mescroll.endSuccess(res.data.list.length);
							});
						} else {
							this.$utils.msg(res.msg);
						}
					})
					.catch(error => {
						mescroll.endErr();
					});
				}
			}
		},
		menuChange1(value) {
			this.distance = value;
			this.mescroll.resetUpScroll();
		},
		menuChange2(value) {
			this.order = value;
			this.mescroll.resetUpScroll();
		},

		//获取uid和token
		...mapMutations(["gettUidAsync"]),
		getUid(uid) {
			this.gettUidAsync(uid);
			if (!this.uid) {
				this.$router.push({
					path: "/result",
					query: { succ: 0 }
				});
			}
		},
		//去店铺详情页
		toStoreDetail(storeId) {
			this.$router.push({
				path: "/store/detail",
				query: { storeId: storeId }
			});
		}
	},
	beforeRouteEnter(to, from, next) {
		if (from.name == "StoreDetail") {
			// 这个name是下一级页面的路由name
			to.meta.isBack = true; // 设置为true说明你是返回到这个页面，而不是通过跳转从其他页面进入到这个页面
		}
		next();
	},
	activated() {
		// 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
		this.$route.meta.isBack=false
		// 恢复成默认的false，避免isBack一直是true，导致每次都获取新数据
		this.isFirstEnter=false;
	
	}
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/storeList";

.mescroll {
	position: fixed;
	top: 75px;
	bottom: 0;
	height: auto;
	padding-top: 5px;
}
.mescrollLog {
	top: 40px;
}
.main {
	.tab {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 100;
		display: flex;
		justify-content: space-around;
		align-content: center;
		height: 44px;
		line-height: 44px;
		background-color: #fff;
		.item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 16px;
			width: 25%;
			color: #666;
			&.active {
				color: #323232;
				background-color: #ffd314;
			}
		}
	}
	.menu {
		position: fixed;
		left: 0;
		top: 40px;
		width: 100%;
		height: 40px;
		border-bottom: 1px solid #ebedf0;
		z-index: 99;
	}
	.icon-map {
		position: fixed;
		bottom: 70px;
		right: 14px;
		font-size: 12px;
		color: #ff976a;
		text-align: center;
		z-index: 100;
		&::before {
			font-size: 36px;
			display: block;
			margin: 0 auto;
		}
	}
}
</style>
