const moment = require("moment")
const {defineConfig} = require('@vue/cli-service')

module.exports = defineConfig({
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    outputDir: 'app',
    transpileDependencies: true,
    productionSourceMap: false,
    lintOnSave: false,
    chainWebpack(config) {
        //不对图片进行转base64处理
        config.module.rule('images').set('parser', {
            dataUrlCondition: {
                maxSize: 0,
            },
        })
        //在index.html中嵌入打包时间
        config.plugin('html').tap((options) => {
            options[0].publishTime = moment().format('YYYY-MM-DD HH:mm:ss')
            return options
        })
    },
    devServer: {
        //port: 50000,
        allowedHosts: ['all'],
        client: {
            progress: true,
            overlay: {
                runtimeErrors: false,
            },
        },
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
