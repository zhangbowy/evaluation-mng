import { request } from 'umi'

export const login = async (data: any) => {
    return request<Result<LoginResult>>('/api/member/login/qcp/dt', { method: 'POST', data })
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
export const getChart = async (params: chartDate) => {
    return request<Result<any>>('/api/spf-cc/b/evaluation/management/querySummaryGraphData', { params })
}
export const getAllInfo = async (examid: string) => {
    return request<Result<Measurement>>('/api/spf-cc/b/evaluation/management/getExamInformation', { params: { examid } })
}

export const measurementExport = async (examId: string) => {
    return request<Result<any>>('/api/spf-cc/b/evaluation/management/exportExcel', { params: { examId } })
}
export const shareInfo = async (data: shareType) => {
    return request<Result<any>>('/api/member/dingtalk/message/sendMessage', { data, method: 'POST' })
}
export const isGuide = async (params: any) => {
    return request<Result<any>>('/api/spf-cc/b/evaluation/library/queryGuide', { params })
}

export const upDateGuide = async (data: any) => {
    return request<Result<any>>('/api/spf-cc/b/evaluation/library/updateReadGuide', { data, method: 'POST' })
}


