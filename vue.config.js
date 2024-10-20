const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  chainWebpack: (config) => {
    config.module.rule("vue").use("vue-loader").tap((options) => {
      options.compiler = require("vue-template-babel-compiler")
      return options
    })
  },
  transpileDependencies: [
    'vuetify',
    'vuex'
  ],
  devServer: {
    proxy: {
      '/api' : {
        target: 'https://khsserver.pe.kr',
        changeOrigin: true,
        secure: false, // https에 대한 보안 검증 비활성화
      }
    }
  }
})
