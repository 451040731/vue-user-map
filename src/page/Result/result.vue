<template>
    <div class="content">
        <div class="result">
            <div class="res succ" v-if="succ == 1">
                <div class="vicon icon-succ"></div>
                <div class="text">正确</div>
            </div>
            <div class="res err" v-else>
                <div class="vicon icon-err"></div>
                <div class="text">认证失败</div>
                <van-button class="login" round color="linear-gradient(to right, #f7d312, #fdb546)" url="https://qd.voopoo.com.cn">重新登陆</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    data () {
        return {
            succ: 0
        }
    },
    created(){
         this.succ = this.$route.query.succ
    }
}
</script>

<style lang="scss" scoped>
    #app{
        height: 100%;
        .content{
            width: 100%;
            height: 100%;
            background-color: #fff;
            text-align: center;
            .result{
                padding-top: 100px;
                text-align: center;
                .res{
                    .vicon{
                        font-size: 70px;
                        margin-bottom: 10px;
                        &.icon-succ{
                            color: #1ed360;
                        }
                        &.icon-err{
                            color: #e72627;
                        }
                    }
                    .text{
                        font-size: 24px;
                        color: #666;
                    }
                }
            }
            .login{
                width: 200px;
                margin: 30px auto 0;
                box-shadow: 0px 4px 10px 0px rgba(249, 157, 16, 0.4);
                .van-button__text{
                    font-size: 16px;
                    color: #333;
                }
            }
        }
    }
</style>