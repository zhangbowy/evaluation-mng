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
    return request<Result<ExamUsers>>(
        '/api/spf-cc/b/evaluation/management/getExamUsers', { params })
}

export const getUserList = async (params: any) => {
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

export const getJoinExamUsers = async (params: any) => {
    return request<Result<Page<UserReport>>>('/api/spf-cc/b/evaluation/report/getJoinExamUsers', { params })
}

export const getAllExam = async (params: any) => {
    return request<Result<AllExam>>('/api/spf-cc/b/evaluation/report/getUserAllExams', { params })
}

export const getExamResult = async (params: any) => {
    return request<Result<ExamResult>>('/api/spf-cc/b/evaluation/management/getUserExamResult', { params })
}

export const queryUser = async (corpId: string, appId: string, fuzzyName?: string) => {
    return request<Result<Page<User>>>('/api/member/user/aggr/fuzzy', { params: { corpId, appId, fuzzyName, curPage: 1, pageSize: 10 } })
}

export const getSign = async (url: string) => {
    return request<Result<SignResult>>('/api/member/dt/app/token/jsapiTicketSign', { data: { url }, method: 'POST' })
}

export const queryExamUserIds = async (examId: number) => {
    return request<Result<string[]>>('/api/spf-cc/b/evaluation/management/queryExamUserIds', { params: { examId } })
}

export const updateExam = async (data: any) => {
    return request<Result<boolean>>('/api/spf-cc/b/evaluation/management/updateExamInformation', { data, method: 'POST' })
}

export const queryDept = async (params: any) => {
    return request<Result<Page<{ deptId: string, name: string }>>>('/api/member/dept/aggr/fuzzy', { params })
}