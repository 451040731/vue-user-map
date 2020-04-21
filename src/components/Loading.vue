<template>
    <div class="loading" v-if="this.isGlobalSpin">
        <van-loading size="30px" type="spinner" color="#ffd314" vertical v-if="this.isGlobalSpin">加载中...</van-loading>
    </div>
</template>

<script>
import Vue from 'vue';
import { Loading } from 'vant';

Vue.use(Loading);

import { mapState } from 'vuex'

export default {
    data () {
        return{
            
        }
    },
    computed: {
        ...mapState({
            isGlobalSpin: state => state.app.isGlobalSpin
        })
    }
}
</script>

<style lang="scss" scoped>
    .loading{
        position: fixed;
        top:0;
        left:0;
        z-index: 121;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        .van-loading{
            background: rgba(0,0,0,0.5);
            padding: 10px;
            border-radius: 4px;
            .van-loading__text{
                color: #ffd314;
            }
        }
    }
</style>