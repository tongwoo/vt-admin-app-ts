import {AUTH_STORAGE_COOKIE} from "@/constants/auth-storage"

export default {
    //系统名称
    name: 'VT-ADMIN',
    //认证&授权相关
    auth: {
        //启用认证
        enable: false,
        //授权存储方式 本地存储=localstorage Cookie存储=cookie
        storage: AUTH_STORAGE_COOKIE,
        //服务端返回未授权是否自动跳转到登录页
        redirect: true
    },
    //分页相关
    pagination: {
        //每页记录数
        size: 14
    }
}
