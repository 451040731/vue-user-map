// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development'

// 本地环境是否需要使用cdn
const devNeedCdn = true

// cdn链接
const cdn = {
    // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
    externals: {
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter',
		axios: 'axios'
    },
    // cdn的css链接
    css: [

	],
    // cdn的js链接
    js: [
        'https://cdn.staticfile.org/vue/2.6.10/vue.min.js',
        'https://cdn.staticfile.org/vuex/3.0.1/vuex.min.js',
        'https://cdn.staticfile.org/vue-router/3.0.3/vue-router.min.js',
		'https://cdn.staticfile.org/axios/0.19.0/axios.min.js'
    ]
}

// path依赖
const path = require('path')

// 查找文件方法
const resolve = dir => {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: './',
	outputDir: "../../user/", // build 时生成的生产环境构建文件的目录
	assetsDir: 'static', // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
	indexPath: "index.html", // 指定生成的 index.html 的输出路径 (相对于 outputDir)
	filenameHashing: true, // 文件名哈希
	lintOnSave: false, // eslint-loader 是否在保存的时候检查
	productionSourceMap: false, // 是否需要生产环境的 source map
	parallel: require("os").cpus().length > 1, // 该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建
	pwa: {}, // PWA 插件相关配置 see => https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		extract: true,
		// 开启 CSS source maps?
		sourceMap: false,
		// css预设器配置项
		loaderOptions: {
			// pass options to sass-loader
			sass: {
                // 引入全局变量样式
                prependData: `@import "~@/assets/scss/base.scss";`
			}
		}
	},
	devServer: {
		port: 8080,
		host: "0.0.0.0",
		https: false,
		// 自动启动浏览器
		open: false,
		proxy: {
			// 配置跨域
			"/api": {
				//要访问的跨域的api的域名
                //target: "http://192.168.7.162:8200",
                target: " http://10.0.0.242:8200",
				ws: true,
				changOrigin: true,
				pathRewrite: {
					"^/api": ""
				}
			},
		}
	},
	chainWebpack: config => {
        // ============压缩图片 start============
        config.module
            .rule('images')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({ bypassOnDebug: true })
            .end()
        // ============压缩图片 end============

        // ============注入cdn start============
        config.plugin('html').tap(args => {
            args[0].cdn = {}
            // cdn css 无论在本地还是生产，都会注入
            if (cdn.css.length) args[0].cdn.css = cdn.css

            // 生产环境或本地需要cdn时，才注入cdn
            if (isProduction || devNeedCdn) args[0].cdn = cdn
            return args
        })
        // ============注入cdn start============

        // 别名配置
        config.resolve.alias
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
    },
	configureWebpack: config => {
        // 用cdn方式引入，则构建时要忽略相关资源
        if (isProduction || devNeedCdn) config.externals = cdn.externals

        // 生产环境相关配置
        if (isProduction) {
            // 代码压缩
            config.plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        //生产环境自动删除console
                        compress: {
                            warnings: false, // 若打包错误，则注释这行
                            drop_debugger: true,
                            drop_console: true,
                            pure_funcs: ['console.log']
                        }
                    },
                    sourceMap: false,
                    parallel: true
                })
            )

            // gzip压缩
            const productionGzipExtensions = ['html', 'js', 'css']
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp(
                        '\\.(' + productionGzipExtensions.join('|') + ')$'
                    ),
                    threshold: 10240, // 只有大小大于该值的资源会被处理 10240
                    minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                    deleteOriginalAssets: false // 删除原文件
                })
            )

            // 公共代码抽离
            config.optimization = {
                splitChunks: {
                    cacheGroups: {
                        vendor: {
                            chunks: 'all',
                            test: /node_modules/,
                            name: 'vendor',
                            minChunks: 1,
                            maxInitialRequests: 5,
                            minSize: 0,
                            priority: 100
                        },
                        common: {
                            chunks: 'all',
                            test: /[\\/]src[\\/]js[\\/]/,
                            name: 'common',
                            minChunks: 2,
                            maxInitialRequests: 5,
                            minSize: 0,
                            priority: 60
                        },
                        styles: {
                            name: 'styles',
                            test: /\.(sa|sc|c)ss$/,
                            chunks: 'all',
                            enforce: true
                        },
                        runtimeChunk: {
                            name: 'manifest'
                        }
                    }
                }
            }
        }
    },
};