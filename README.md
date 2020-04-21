# ums

> 基于 vue-cli3 用户管理系统

## 演示

![ums](注册.gif)
![ums](登录.gif)
![ums](增删地址.gif)

## 目录结构

```bash
|__ public                                    # 本地代理
    |__ favicon.ico                               # 图标
    |__ index.html                                # 主页面
|__ src
    |__ App.vue                               # 入口文件
    |__ main.js                               # 入口js
    |__ components                            # 组件
      |__ Loading.vue                           # 加载层
    |__ page
      |__ Home                                # 首页
        |__ Home.vue
      |__ Login                               # 登录页
        |__ Login.vue
      |__ Register                            # 注册页
        |__ Register.vue
      |__ User                              
        |__ Address  
            |__ Register.vue                  # 增加地址
            |__ Register.vue                  # 删除地址
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
