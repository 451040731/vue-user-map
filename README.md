# vue-user-map
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)

> vue构建零售店店铺地图位置，接入vue-Baidu-Map百度地图api

## 演示

- 客户关系管理
![vue-user-map](/screenshot/1.png)

- 客户关系详情
![vue-user-map](/screenshot/2.png)

- 店铺地图管理
![vue-user-map](/screenshot/3.png)

- 预览
![vue-user-map](/screenshot/4.gif)

## 目录结构

```bash
|__ public                                    # 本地代理
    |__ favicon.ico                               # 图标
    |__ index.html                                # 主页面
|__ src
    |__ App.vue                               # 入口文件
    |__ main.js                               # 入口js
    |__ components                            # 组件
      |__ Loading.vue                         # 加载层
    |__ page
      |__ Index                               # 商家地址池列表页，签约客户，操作日志
        |__ index.vue
      |__ Result                              # 结果页面
        |__ result.vue
      |__ Store                            
        |__ detail.vue                        # 售店店铺详情
        |__ map.vue                           # 商家地址池，百度地图api
    |__ router                                 # router
      |__ index.js                              # 路由
    |__ store                                 # vuex
      |__ index.js                              # 全局
      |__ modules                               # 模块
        |__ app.js                                  # 加载
        |__ user.js                                 # 用户
      |__ mutations-type.js                     # mutations 常量
    |__ fetch                                 # 请求
      |__ api.js                                # api接口类
      |__ request.js                            # axios请求封装
|__ assets                                    # 静态资源
    |__ font                                    # 字体
    |__ images                                  # 图片
    |__ sass                                    # 样式
```

## 构建
``` bash
# 安装依赖
npm install

# 开发
npm run dev

# 生产
npm run build

# 代码检查
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
