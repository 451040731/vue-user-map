<template>
    <div class="main">
        <div class="tag-wrap">
            <div class="tag tag1"><i>公海</i><span></span><em>{{this.points1.length}}</em></div>
            <div class="tag tag2"><i>保护</i><span></span><em>{{this.points2.length}}</em></div>
            <div class="tag tag3"><i>签约</i><span></span><em>{{this.points3.length}}</em></div>
        </div>
        <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true" :mapStyle="mapStyle" ak="4Uzg40oyzbtgTxT2qVnL9pjXIGF7y9P6">
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
            <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" :icon="{url: 'http://www.voopoo.com.cn/dist/img/bulocation.png', size: {width: 30, height: 30}}"></bm-marker>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            <bm-point-collection :points="points1" shape="BMAP_POINT_SHAPE_CIRCLE" color="#ee0a24" size="BMAP_POINT_SIZE_BIG" v-if="points1.state == 1" @click="clickHandler"></bm-point-collection>
            <bm-point-collection :points="points2" shape="BMAP_POINT_SHAPE_CIRCLE" color="#1989fa" size="BMAP_POINT_SIZE_BIG" v-if="points2.state == 2" @click="clickHandler"></bm-point-collection>
            <bm-point-collection :points="points3" shape="BMAP_POINT_SHAPE_CIRCLE" color="#07c160" size="BMAP_POINT_SIZE_BIG" v-if="points3.state == 3" @click="clickHandler"></bm-point-collection>
        </baidu-map>
        <van-popup
            v-model="infoWindow.show"
            closeable
            close-icon="close"
            position="bottom"
            :style="{ height: '30%' }"
            >
            <div class="pop">
                <div class="title">店铺名称：{{infoWindow.contents}}</div>
                <van-button class="href" round color="linear-gradient(to right, #f7d312, #fdb546)" @click="toStoreDetail">查看详情</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue';
import BmGeolocation from 'vue-baidu-map/components/controls/Geolocation.vue'; //定位
import BmView from 'vue-baidu-map/components/map/MapView'; //地图视图
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow'; //标注弹窗
import BmNavigation from 'vue-baidu-map/components/controls/Navigation' //缩放控件
import BmPointCollection from 'vue-baidu-map/components/overlays/PointCollection';//海量点
import BmMarker from 'vue-baidu-map/components/overlays/Marker'//标注点

export default {
    components: {
        BaiduMap,
        BmGeolocation,
        BmView,
        BmInfoWindow,
        BmNavigation,
        BmPointCollection,
        BmMarker
    },
    data () {
        return {
            center: {lng: 0, lat: 0},
            zoom: 16,
            markers: [],
            points1: [],
            points2: [],
            points3: [],
            infoWindow: {
                show: false,
                contents: '',
                lng: 0,
                lat: 0,
                storeId: '',
            },
            mapStyle: {
                styleJson: [
                    {
                        "featureType": "all",
                        "elementType": "all",
                        "stylers": {
                                "lightness": 10,
                                "saturation": -100
                        }
                    },
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": {
                                "lightness": 50
                        }
                    }
                ]
            }
        }
    },
    created(){
        this.getStoryList();
    },
    methods: {
        //获取数据并显示默认第一条数据
        getStoryList(){
            this.$api.getStoryLocationList().then(res => {
                if (res.code == 20000) {
                    this.markers = res.data.list;

                    this.markers.filter(item => {
                        if(item.state == 1){
                             const position1 = {id: item.id, name: item.name, lng: item.lng, lat: item.lat}
                             this.points1.push(position1)
                        }
                        if(item.state == 2){
                            const position2 = {id: item.id, name: item.name, lng: item.lng, lat: item.lat}
                            this.points2.push(position2)
                        }
                        if(item.state == 3){
                            const position3 = {id: item.id, name: item.name, lng: item.lng, lat: item.lat}
                            this.points3.push(position3)
                        }
                    })
                    this.points1.state = 1
                    this.points2.state = 2
                    this.points3.state = 3

                }else{
                    this.$utils.msg(res.msg);
                }
            }).catch(error => {
                   this.$utils.msg(error);
            });
        },
        handler({BMap, map}) {
            let _this = this;	// 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                // setTimeout(()=>{
                //     _this.zoom = 16
                // },2000)
                _this.center = {lng: r.longitude, lat: r.latitude};		// 设置center属性值
            },{enableHighAccuracy: true})
        },
        clickHandler (e) {
            this.infoWindow.show = true;
            this.infoWindow.lng = e.point.lng
            this.markers.filter(item => {
                if(item.lng == this.infoWindow.lng){
                    this.infoWindow.contents = item.name;
                    this.infoWindow.storeId = item.id;
                }
            })
        },
        //店铺详情
        toStoreDetail(){
            this.$router.push({
				path: "/store/detail",
				query: { storeId: this.infoWindow.storeId }
			});
        }
    }
}
</script>

<style lang="scss" scoped>
    .main{
        position: relative;
        height: 100%;
        .tag-wrap{
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 100;
            padding: 10px;
            background: rgba(0,0,0,0.3);
            border-radius: 4px;
            .tag{
                margin-bottom: 4px;
                &:last-child{
                    margin-bottom: 0;
                }
                span{
                    display: inline-block;
                    vertical-align: middle;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    margin-right: 10px;
                }
                em{
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 14px;
                    color: #fff;
                }
                i{
                    font-size: 14px;
                    color: #fff;
                    vertical-align: middle;
                    display: inline-block;
                    margin-right: 10px;
                }
                &.tag1{
                   span{
                       background-color: $color-red;
                   } 
                }
                &.tag2{
                   span{
                       background-color: $color-blue;
                   } 
                }
                &.tag3{
                   span{ 
                       background-color: $color-green;
                   } 
                }
            }
        }
        .bm-view {
            width: 100%;
            height: 100%;
        }
        .van-popup{
            padding: 10px;
            .pop{
                position: relative;
                padding-bottom: 50px;
                height: 100%;
                .title{
                    font-size: 16px;
                    color: #333; 
                    line-height: 40px;
                }
                .href{
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    box-shadow: 0px 4px 10px 0px rgba(249, 157, 16, 0.4);
                    .van-button__text{
                        font-size: 16px;
                        color: #333;
                    }
                }
            }
        }
    }
</style>