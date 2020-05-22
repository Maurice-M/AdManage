module.exports = {
    chainWebpack: config => {
        //发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                nprogress: 'NProgress',
                moment: 'moment',
                xlsx: 'xlsx'
            })
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        //开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    },
  // 配置跨域代理
  devServer: {
      proxy: {
          '/api': {
              target: 'http://127.0.0.1:3000/api/',    // 你自己的api接口地址
              changeOrigin: true,
              ws: true,
              pathRewrite: {
                  '^/api': '',  
              }
          }
      }
  }
}