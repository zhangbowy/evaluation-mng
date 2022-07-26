import { Modal } from 'antd';
import axios from 'axios';

let instance = axios.create({
    baseURL: '',
    withCredentials: false,
    timeout: 50000
});
instance.interceptors.request.use((request: any) => {
    request.headers['QZZ_ACCESS_TOKEN'] = sessionStorage.getItem('QCP_B_TOKEN');
    // request.headers['QZZ_ACCESS_TOKEN'] = "d37025e6aeff933ef2de76decd2346f2";
    return request;
}, function (error) {
    return Promise.reject(error);
});
instance.interceptors.response.use((response: any) => {
    if (response.data.code === 4001067) {
        Modal.confirm({
            title: '抱歉，您的点券不足，请充值后解锁',
            cancelText: '暂不充值',
            okText: '去充值',
            onOk() {
                window.location.hash = '/evaluation/recharge';
            },
        })
        return response.data;
    }
    if (response.data.code != 1) {
        Modal.warning({
            title: '温馨提示',
            content: response.data.message || '网络错误',
            okText: '确认',
            onOk() {
                console.log('确认');
            },
        });
    }
    return response.data
})

const request: any = (url: string, option: { params?: any, data?: any, method?: string }) => {
    const { method = 'get', params, data } = option;
    return instance({
        url,
        method: method.toLowerCase(),
        [method.toLowerCase() === 'get' ? 'params' : 'data']: params || data
    })
}

export default request;
