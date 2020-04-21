<template>
    <div class="main" :class="{ h100 : isFixed }">
        <div class="pd15">
            <div class="head">
                <div class="title">
                    <div class="name">{{storeData.name | ellipsis(16)}}<van-tag class="state" :type="storeData.state == 1 ? 'danger' : (storeData.state == 2 ? 'primary' : 'success')">{{storeData.state == 1 ? '公海' : (storeData.state == 2 ? '保护' : '签约')}}</van-tag></div>
                    <div class="address">{{storeData.address}}</div>
                </div>
                <div class="content">
                    <div class="img">
                        {{storeData.id}}
                    </div>
                    <div class="text">
                        <div class="contact">{{storeData.contact}}</div>
                        <div class="phone">
                            <span v-if="storeData.weixin">微信：{{ storeData.weixin}}</span>
                            <span>Tel：{{storeData.phone}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <van-tabs v-model="active" title-active-color="#ffd314" color="#ffd314">
            <van-tab title="店铺地图">
                <div class="maps">
                    <baidu-map class="bm-view" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" ak="4Uzg40oyzbtgTxT2qVnL9pjXIGF7y9P6">
                        <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
                        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                    </baidu-map>
                </div>
            </van-tab>
            <van-tab title="店铺日志">
                <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" :class="{ isMescroll : isFixed }">
                    <div id="list" class="list">
                        <log-list :dataLogList="storeLogList" :nameFlag="nameFlag"></log-list>
                    </div>
                </mescroll-vue>
            </van-tab>
        </van-tabs>
        <div class="button">
            <van-button class="btn" round color="linear-gradient(to right, #f7d312, #fdb546)" :loading="loading" loading-text="加载中..." v-if="storeData.state == 1" @click="changeStoreState(1)">保护</van-button>
            <van-button class="btn" round color="linear-gradient(to right, #f7d312, #fdb546)" :loading="loading" loading-text="加载中..." v-else @click="changeStoreState(3)">释放</van-button>
        </div>
    </div>
</template>

<script>
import MescrollVue from 'mescroll.js/mescroll.vue'
import mescrollEmpty from '../../assets/images/mescroll-empty.png'
import mescrollTop from '../../assets/images/mescroll-totop.png'

import logList from "@/components/logList.vue"

import BaiduMap from 'vue-baidu-map/components/map/Map.vue';
import BmView from 'vue-baidu-map/components/map/MapView'; //地图视图
import BmNavigation from 'vue-baidu-map/components/controls/Navigation' //缩放控件
import BmMarker from 'vue-baidu-map/components/overlays/Marker'//标注点

export default {
    components: {
        logList,
        MescrollVue, // 注册mescroll组件
        BaiduMap,
        BmView,
        BmNavigation,
        BmMarker
    },
    data () {
        return {
            uid: 0,
            storeId: 0,
            storeData: {},
            storeLogList: [],
            center: {lng: 0, lat: 0},
            zoom: 18,
            nameFlag: false,
            loading: false,
            isFixed: false,
            mescroll: null, // mescroll实例对象
			    mescrollDown:{}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
			    mescrollUp: { // 上拉加载的配置.
			    callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
			        //以下是一些常用的配置,当然不写也可以的.
				page: {
					num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
					size: 10 //每页数据条数,默认10
                },
                htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>', //上拉加载中的布局
				htmlNodata: '<p class="upwarp-nodata">-- 暂无更多数据--</p>',
				noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据
				toTop: {
					//回到顶部按钮
					src: mescrollTop, //图片路径,默认null,支持网络图
					offset: 1000 //列表滚动1000px才显示回到顶部按钮
				},
				empty: {
					//列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
					warpId: 'list', //父布局的id (1.3.5版本支持传入dom元素)
					icon: mescrollEmpty, //图标,默认null,支持网络图
					tip: "暂无相关数据~" //提示
				}
		    },
        }
    },
    created(){
        this.uid = Number(this.$route.query.uid);
        this.storeId = this.$route.query.storeId;
        this.getStoreInfo()
    },
    beforeRouteEnter (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteEnter不用写
        next(vm => {
            // 滚动到原来的列表位置,恢复顶部按钮和isBounce的配置
            vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter()
        })
    },
    beforeRouteLeave (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteLeave不用写
        // 记录列表滚动的位置,隐藏顶部按钮和isBounce的配置
        this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave()
        next()
    },
    methods: {
        getStoreInfo(){
            this.$api.getStoreInfo(
                this.$qs.stringify({
                    store_id: this.storeId,
                })
            ).then(res => {
                if (res.code == 20000) {
                    this.storeData = res.data;
                    this.center.lng = res.data.location_lng
                    this.center.lat = res.data.location_lat
                }else{
                    this.$utils.msg(res.msg);
                }
            }).catch(error => {
                this.$utils.msg(error);
            });
        },
        // mescroll组件初始化的回调,可获取到mescroll对象
        mescrollInit (mescroll) {
            this.mescroll = mescroll  // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
        },
        // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
	    upCallback (page, mescroll) {
            this.$api.getStoreLog(
                this.$qs.stringify({
                    store_id: this.storeId,
                    page: page.num, // 页码
                    limit: page.size // 每页长度
                })
            ).then(res => {
                if (res.code == 20000) {
                    let data = page.num == 1 ? [] : this.storeLogList;
                    data.push(...res.data.list);
                    this.storeLogList = data;
                    // 数据渲染成功后,隐藏下拉刷新的状态
                    this.$nextTick(() => {
                        mescroll.endSuccess(res.data.list.length);
                    });
                }else{
                    this.$utils.msg(res.msg);
                }
            }).catch(error => {
                    mescroll.endErr()
            });
        },
        //操作
        changeStoreState(state){
            let stateMsg = this.storeData.state == 1 ? '保护' : '释放';
            this.$dialog.confirm({
                title: '提示',
                message: `您确定要${stateMsg}操作？`
            }).then(() => {
                this.loading = true;
                this.$api.changeStoreState(
                    this.$qs.stringify({
                        store_id: this.storeId,
                        saler_id: this.uid,
                        event_type: state
                    })
                ).then(res => {
                    if (res.code == 20000) {
                        this.$utils.msg(res.msg);
                        this.loading = false;
                        this.getStoreInfo()
                        this.mescroll.resetUpScroll();
                    }else{
                        this.loading = false;
                        this.$utils.msg(res.msg);
                    }
                }).catch(error => {
                    this.$utils.msg(error);
                });
            }).catch(() => {
            // on cancel
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .mescroll {
        position: fixed;
        padding-bottom: 1rem;
        top: 195px;
        left: 0;
        bottom: 0;
        height: auto;
    }
    .main{
        .pd15{
            padding: 15px;
            .head{
                width: 100%;
                border-radius: 6px;
                padding: 10px;
                height: 138px;
                background: linear-gradient(to bottom, #f7d312 0%,#fdb546 100%);
                box-shadow: 0px 4px 10px 0px rgba(249, 157, 16, 0.4);
                .title{
                    .name{
                        font-size: 18px;
                        font-weight: bold;
                        color: #333;
                        .state{
                            margin-left: 6px;
                        }
                    }
                    .address{
                        height: 30px;
                        font-size: 13px;
                        color: #323232;
                        line-height: 20px;
                    }
                }
                .content{
                    display: flex;
                    justify-content: space-between;
                    margin-top: 15px;
                    .img{
                        width: 50px;
                        height: 50px;
                        line-height: 50px;
                        border-radius: 50%;
                        margin-right: 10px;
                        background:#efefef;
                        text-align: center;
                        font-size: 12px; 
                    }
                    .text{
                        text-align: right;
                        font-size: 18px;
                        color: #333; 
                        .phone{
                            color: #323232; 
                            line-height: 30px;
                            span{
                                font-size: 13px;
                                margin-left: 10px;
                            }
                        }
                    }
                }
            }
        }
        .button{
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding: 15px;
            z-index: 999;
            .btn{
                width: 100%;
                box-shadow: 0px 4px 10px 0px rgba(249, 157, 16, 0.4);
                .van-button__text{
                    font-size: 16px;
                    color: #333;
                }
            }
        }
        .maps{
            width: 100%;
            height: 460px;
            .bm-view{
                width: 100%;
                height: 460px;
            }
        }
    }
</style>