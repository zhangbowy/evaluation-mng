import { request } from 'umi'

export const login = async (data: any) => {
    return request<Result<LoginResult>>('/api/member/login/dt', { method: 'POST', data })
}

export const authLogin = async (data: { code: string, appId: string, corpId: string }) => {
    return request<Result<LoginResult>>('/api/member/login/dt/authorization', { method: 'POST', data })
}

export const getExamTemplateList = async () => {
    return request('/api/spf-cc/getExamTemplateList')
}

export const getJoinExamUsers = async (params: any) => {
    return request<Result<ExamUser & { completion: string, evalutionNum: number }[]>>(
        '/api/spf-cc/getJoinExamUsers', { params })
}

export const getUserList = async (params: { curPage?: number, pageSize?: number, name?: string }) => {
    return request<Result<User[]>>('/api/member/auth/authPoint/list', { params })
}

export const setAuths = async (data: { addAuths?: string[], removeAuths?: string[], userIds: string[] }) => {
    return request<Result<boolean>>('/api/member/auth/setAuthPoint', { data, method: 'POST' })
}