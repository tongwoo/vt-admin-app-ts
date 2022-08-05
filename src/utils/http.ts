import axios, {AxiosResponse, AxiosInstance} from 'axios';
import {API_PATH_DEFAULT} from "@/constants/api-path";
import {ResponseCode} from "@/types/built-in";

/**
 * Http实例
 */
const http: AxiosInstance = axios.create({
    baseURL: API_PATH_DEFAULT,
    timeout: 30000,
    headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
    },
});

//请求拦截器
http.interceptors.request.use(
    function (request) {
        if (request.headers !== undefined) {
            request.headers.Authorzation = 'token';
        }
        return request;
    },
);

//响应拦截器
http.interceptors.response.use(
    function (response) {
        return normalize(response);
    },
    function (error) {
        if (error?.response === undefined) {
            throw error;
        }
        //需要提示处理的状态码，其他类型错误交给业务层处理
        const codes = [
            ResponseCode.UNAUTHORIZED,
            ResponseCode.FORBIDDEN,
            ResponseCode.NOT_FOUND,
        ];
        if (
            codes.indexOf(error.response?.status) !== -1 ||
            codes.indexOf(error.response?.data?.code) !== -1
        ) {
            throw error;
        }
        return normalize(error.response);
    },
);

/**
 * 对AxiosResponse进行包装
 */
function normalize(response: AxiosResponse): AxiosResponse {
    //将响应体转换成ResponseData结构
    if (typeof response.data === 'object') {
        if (response.data?.msg !== undefined) {
            response.data.message = response.data.msg;
            delete response.data.msg;
        }
        response.data.success = ResponseCode.isOk(Number(response.data.code));
    }
    return response;
}

export {
    http,
}

