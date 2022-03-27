import { request } from 'umi'

export const login = async (data: { code: string }) => {
    return request<Result<LoginResult>>('/api/member/login/dt', { method: 'POST', data })
}

export const authLogin = async (data: { code: string }) => {
    return request<Result<LoginResult>>('/api/member/login/dt/authorization', { method: 'POST', data })
}

export const getExamTemplateList = async () => {
    return request('/api/spf-cc/getExamTemplateList')
}