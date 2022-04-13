import { request } from 'umi'

export const login = async (data: any) => {
    return request<Result<LoginResult>>('/api/member/login/dt', { method: 'POST', data })
}

export const authLogin = async (data: { code: string, appId: string, corpId: string }) => {
    return request<Result<LoginResult>>('/api/member/login/dt/authorization', { data, method: 'POST' })
}

export const getExamTemplateList = async () => {
    return request<Result<ExamTemplateListItem[]>>('/api/spf-cc/b/evaluation/library/getExamTemplateList')
}

export const getExamUsers = async (params: any) => {
    return request<Result<ExamUser & { completion: string, evalutionNum: number }[]>>(
        '/api/spf-cc/b/evaluation/management/getExamUsers', { params })
}

export const getUserList = async (params: { curPage?: number, pageSize?: number, name?: string }) => {
    return request<Result<Page<User>>>('/api/member/auth/authPoint/list', { params })
}

export const setAuths = async (data: { addAuths?: string[], removeAuths?: string[], userIds: string[] }) => {
    return request<Result<boolean>>('/api/member/auth/setAuthPoint', { data, method: 'POST' })
}

export const createExam = async (data: any) => {
    return request<Result<boolean>>('/api/spf-cc/b/evaluation/library/createExam', { data, method: 'POST' })
}

export const examList = async (params?: any) => {
    return request<Result<Page<ExamListItem>>>('/api/spf-cc/b/evaluation/management/getExamInformationList', { params })
}

export const editExam = async (data: any) => {
    return request<Result<boolean>>('/api/spf-cc/b/evaluation/management/updateExamInformation', { data, method: 'POST' })
}
