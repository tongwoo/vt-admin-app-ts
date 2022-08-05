import {ElMessage as message, ElMessageBox as messageBox} from "element-plus";
import router from "../router/index";
import {ResponseCode} from "@/types/built-in";
import {AxiosError} from "axios";

/**
 * HTTP错误处理
 */
export function httpErrorHandler(error: AxiosError) {
    if (error?.response !== undefined) {
        const response = error.response;
        if (response.status === ResponseCode.ERROR) {
            message.error('服务器异常');
        } else if (response.status === ResponseCode.NOT_FOUND) {
            message.error('页面不存在');
        } else if (response.status === ResponseCode.FORBIDDEN) {
            if (document.querySelector('.is-message-box') !== null) {
                return;
            }
            messageBox.confirm('没有权限，是否重新登录？', '提示', {
                type: 'warning',
                confirmButtonText: '重新登录',
                cancelButtonText: '否',
            }).then(() => {
                router.replace('/login');
            }).catch(() => {
                //...
            });
        } else if (response.status === ResponseCode.UNAUTHORIZED) {
            if (document.querySelector('.is-message-box') !== null) {
                return;
            }
            messageBox.confirm('登录凭证已经过期，是否重新登录？', '提示', {
                type: 'warning',
                confirmButtonText: '重新登录',
                cancelButtonText: '否',
            }).then(() => {
                router.replace('/login');
            }).catch(() => {
                //...
            });
        }
    } else if (error.message !== undefined) {
        message.error(error.message);
    } else {
        message.error('网络繁忙，请稍后重试');
    }
}
