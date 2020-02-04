const isProduction = process.env.NODE_ENV === 'production'
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const cdn = {
  css: [],
  js: [
    'https://cdn.bootcss.com/vue/2.5.17/vue.runtime.min.js',
    'https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js',
    'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
    'https://cdn.bootcss.com/axios/0.18.0/axios.min.js'
  ]
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  lintOnSave: true,
  chainWebpack: (config) => {
    // 生产环境配置
    if (isProduction) {
      // 删除预加载
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
      // 压缩代码
      config.optimization.minimize(true)
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all'
      })
      // 生产环境注入cdn
      config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
      })
    }
    // config.requireModuleExtension.rule('scss$')
    //   .test(/\.scss$/)
    //   .use('sass-resources-loader')
    //   .loader('sass-resources-loader')
    //   .options({
    //     resources: ['./src/assets/css/constant.scss']
    //   })
  },
  configureWebpack: (config) => {
    if (isProduction) {
      // 不打包以下内容，用CDN加速
      config.externals = {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'element-ui': 'ELEMENT',
        'axios': 'axios'
      }
      // 为生产环境修改配置...
      config.plugins.push(
        // 生产环境自动删除console
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              // warnings: false,
              drop_debugger: true,
              drop_console: true
            }
          },
          sourceMap: false,
          parallel: true
        })
      )
      config.plugins.push(
        new CompressionPlugin({
          test: /\.js$|\.html$|\.css$/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据进行压缩
          deleteOriginalAssets: false // 是否删除原文件
        })
      )

      // let tmp = config.optimization.splitChunks.cacheGroups
      // console.log(tmp)
      // config.optimization.splitChunks = {
      //   chunks: 'all',
      //   minSize: 10000, // 提高缓存利用率，这需要在http2/spdy
      //   maxSize: 0, // 没有限制
      //   minChunks: 3, // 共享最少的chunk数，使用次数超过这个值才会被提取
      //   maxAsyncRequests: 5, // 最多的异步chunk数
      //   maxInitialRequests: 5, // 最多的同步chunks数
      //   automaticNameDelimiter: '~', // 多页面共用chunk命名分隔符
      //   name: true
      //   // cacheGroups: {// 声明的公共chunk
      //   // vendor: {
      //   //   // 过滤需要打入的模块
      //   //   test: module => {
      //   //     if (module.resource) {
      //   //       const include = [/[\\/]node_modules[\\/]/].every(reg => {
      //   //         return reg.test(module.resource)
      //   //       })
      //   //       const exclude = [/[\\/]node_modules[\\/](echarts|redux|antd)/].some(reg => {
      //   //         return reg.test(module.resource)
      //   //       })
      //   //       return include && !exclude
      //   //     }
      //   //     return false
      //   //   },
      //   //   name: 'vendor',
      //   //   priority: 50, // 确定模块打入的优先级
      //   //   reuseExistingChunk: true // 使用复用已经存在的模块
      //   // },
      //   // echarts: {
      //   //   test({resource}) {
      //   //     return /[\\/]node_modules[\\/](echarts)/.test(resource)
      //   //   },
      //   //   name: 'echarts',
      //   //   priority: 20,
      //   //   reuseExistingChunk: true
      //   // }
      //   // ,
      //   // antd: {
      //   //   test: /[\\/]node_modules[\\/]antd/,
      //   //   name: 'antd',
      //   //   priority: 15,
      //   //   reuseExistingChunk: true
      //   // }
      //   // }
      // }
      // config.optimization.splitChunks.cacheGroups = Object.assign({}, tmp, {// 声明的公共chunk
      //   vendor: {
      //     // 过滤需要打入的模块
      //     test: module => {
      //       if (module.resource) {
      //         const include = [/[\\/]node_modules[\\/]/].every(reg => {
      //           return reg.test(module.resource)
      //         })
      //         const exclude = [/[\\/]node_modules[\\/](_vue-echarts|_element-ui|echarts|redux|antd)/].some(reg => {
      //           return reg.test(module.resource)
      //         })
      //         return include && !exclude
      //       }
      //       return false
      //     },
      //     name: 'vendor-split',
      //     priority: 50, // 确定模块打入的优先级
      //     reuseExistingChunk: true // 使用复用已经存在的模块
      //   }
      // echarts: {
      //   test({resource}) {
      //     return /[\\/]node_modules[\\/](_vue-echarts)/.test(resource)
      //   },
      //   name: 'echarts',
      //   priority: 20,
      //   chunks: 'initial',
      //   reuseExistingChunk: true
      // },
      // theme: {
      //   name: 'chunk-theme',
      //   test: /[\\/]node_modules[\\/]_element-ui[\\/]/,
      //   chunks: 'all',
      //   priority: 1,
      //   reuseExistingChunk: true,
      //   enforce: true
      // }
      // })
    } else {
    }
  },
  productionSourceMap: false,
  css: {
    extract: process.env.NODE_ENV == 'production',
    // extract: false,
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      // 给 sass-loader 传递选项
      scss: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/assets/css/constant.scss` 这个文件
        prependData: `@import "~@/assets/css/constant.scss";`
      }
    },
    modules: false
  },
  parallel: require('os').cpus().length > 1,
  devServer: {
    open: false,
    host: '0.0.0.0',
    port: 64046,
    https: false,
    hotOnly: false,
    hot: true,
    proxy: null,
    before: app => {
    },
    overlay: {
      warnings: true,
      errors: true
    }
  },
  // 第三方插件配置
  pluginOptions: {}
}
