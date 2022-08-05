const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    devServer:{
        port: 12345,
        open: true,
        //allowedHosts: true,
        //overlay: {
        //    warnings: false,
        //    errors: true
        //},
        proxy: {
            //接口路径和映射地址，不要修改此处，酌情修改 .env.development 文件
            [process.env.VUE_APP_BASE_API]: {
                target: process.env.VUE_APP_BASE_API_TARGET,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        }
    }
})
