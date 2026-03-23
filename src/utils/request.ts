import axios, {
    type AxiosInstance,
    type InternalAxiosRequestConfig,
    type AxiosResponse,
    type AxiosRequestConfig
} from 'axios';
import {message, notification} from 'ant-design-vue';
import {useUserStore} from '@/store/user';
import router from '@/router';

// 创建实例
const request: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {'Content-Type': 'application/json;charset=utf-8'}
});

// 请求拦截器
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const userStore = useUserStore();

        // 如果存在 token，则注入到 header
        if (userStore.accessToken) {
            config.headers['Authorization'] = `Bearer ${userStore.accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse) => {
        const {data} = response;

        if (data.code !== 200) {
            message.error(data.message || '服务器业务异常');
            return Promise.reject(new Error(data.message || 'Error'));
        }

        return data.data; // 直接返回业务数据部分
    },
    (error) => {
        // 处理 HTTP 错误状态码
        if (error.response) {
            const status = error.response.status;
            const userStore = useUserStore();

            switch (status) {
                case 401:
                    notification.error({message: '登录过期', description: '您的登录状态已失效，请重新登录'});
                    userStore.clearToken();
                    router.replace({name: 'Login', query: {redirect: router.currentRoute.value.fullPath}});
                    break;
                case 403:
                    message.error('拒绝访问：权限不足');
                    break;
                case 500:
                    message.error('服务器内部错误');
                    break;
                default:
                    message.error(error.response.data?.message || '网络请求错误');
            }
        } else {
            message.error('网络连接超时或异常');
        }
        return Promise.reject(error);
    }
);

interface CustomAxiosInstance extends AxiosInstance {
    get<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;

    post<T = any, R = T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;

    put<T = any, R = T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;

    delete<T = any, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
}

export default request as CustomAxiosInstance;