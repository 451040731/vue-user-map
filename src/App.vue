<template>
  <div id="app">
    <Loading></Loading>
    <keep-alive>
       <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
 import Loading from './components/Loading'

export default {
  name: 'App',
  components: {
    Loading
  }
}
</script>

<style lang="scss" scoped>
</style>
