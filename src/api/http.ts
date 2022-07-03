import { Modal } from 'antd';
import axios from 'axios';

const { confirm } = Modal;
let instance = axios.create({
    baseURL: '',
    withCredentials: false,
    timeout: 50000
});
instance.interceptors.request.use((request: any) => {
    request.headers['QZZ_ACCESS_TOKEN'] = sessionStorage.getItem('QCP_B_TOKEN');
    return request;
}, function (error) {
    return Promise.reject(error);
});
instance.interceptors.response.use((response: any) => {
    if (response.data.code != 1) {
        Modal.confirm({
            title: '温馨提示',
            content: response.data.message,
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