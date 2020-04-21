<template>
    <div>
        <div class="list-cell" v-for="(item,index) in dataLogList" :key="index">
            <div class="right">
                <div class="title">
                    <div class="cell-primary">
                        {{item.add_time | parseTime}}
                    </div>
                </div>
                <div class="cen">
                    <span v-if="nameFlag">{{item.operate_name}} </span>
                    <van-tag class="event_type" plain :type="item.event_type == 1 ? 'primary' : (item.event_type == 2 ? 'success' : 'danger')">
                        {{item.event_type == 1 ? '保护' : (item.event_type == 2 ? '签约' : '释放')}}
                    </van-tag> 
                    {{item.store_name | ellipsis(26)}}   
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            
        }
    },
    props:{
        dataLogList: {
            type: Array
        },
        nameFlag: {
            type: Boolean
        }
    },
}
</script>

<style lang="scss" scoped>
    @import '../assets/scss/storeList';
</style>