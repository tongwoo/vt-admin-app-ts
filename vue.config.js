const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    outputDir: 'app',
    transpileDependencies: true,
    lintOnSave: false,
    devServer: {
        host: '127.0.0.1',
        port: 12345,
        proxy: {
            //接口路径和映射地址，不要修改此处，酌情修改 .env.development 文件
            [process.env.VUE_APP_BASE_API]: {
                target: process.env.VUE_APP_BASE_API_TARGET,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: '',
                },
            },
        },
    },
})
