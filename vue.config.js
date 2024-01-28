const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify',
    'vuex'
  ],
  devServer: {
    proxy: {
      '/api' : {
        target: 'http://localhost:8080/'
      }
    }
  }
})
