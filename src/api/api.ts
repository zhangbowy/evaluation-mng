import request from './http';
import { IGetAllPeopleParams, IBResultParams, IUnLockParams, IExamUsers, ICreteExamParams, IExamListParams, IPointAssetParams, IRechargeFlow, IRechargeUrl, IConsumeFlow, IRecruitmentExam, IRecruitmentExamList, IUpdateRecruitment, IUserExamResult, IUnlockItem, IPDFDownLoadParams, IsHasPdfParams, MenuParams, UserRoleParams, PermissionUserListParams } from './type';

export const login = async (data: any) => {
    return request('/api/member/login/qcp/dt', { method: 'POST', data })
}

export const authLogin = async (data: { code: string, appId: string, corpId: string }) => {
    return request('/api/member/login/dt/authorization', { data, method: 'POST' })
}

export const getExamTemplateList = async () => {
    return request('/api/spf-cc/b/evaluation/library/getExamTemplateList', {})
}


export const getUserList = async (params: any) => {
    return request('/api/member/auth/authPoint/list', { params })
}

export const setAuths = async (data: { addAuths?: string[], removeAuths?: string[], userIds: string[] }) => {
    return request('/api/member/auth/setAuthPoint', { data, method: 'POST' })
}

export const editExam = async (data: any) => {
    return request('/api/spf-cc/b/evaluation/management/updateExamInformation', { data, method: 'POST' })
}

export const getJoinExamUsers = async (params: any) => {
    return request('/api/spf-cc/b/evaluation/report/getJoinExamUsers', { params })
}

export const getAllExam = async (params: any) => {
    return request('/api/spf-cc/b/evaluation/report/getUserAllExams', { params })
}


export const queryUser = async (corpId: string, appId: string, fuzzyName?: string) => {
    return request('/api/member/user/aggr/fuzzy', { params: { corpId, appId, fuzzyName, curPage: 1, pageSize: 10 } })
}

export const getSign = async (url: string) => {
    return request('/api/member/dt/app/token/jsapiTicketSign', { data: { url }, method: 'POST' })
}



export const updateExam = async (data: any) => {
    return request('/api/spf-cc/b/evaluation/management/updateExamInformation', { data, method: 'POST' })
}

export const queryDept = async (params: any) => {
    return request('/api/member/dept/aggr/fuzzy', { params })
}
export const getChart = async (params: chartDate) => {
    return request('/api/spf-cc/b/evaluation/management/querySummaryGraphData', { params })
}
export const getAllInfo = async (examid: string) => {
    return request('/api/spf-cc/b/evaluation/management/getExamInformation', { params: { examid } })
}

export const measurementExport = async (examId: string) => {
    return request('/api/spf-cc/b/evaluation/management/exportExcel', { params: { examId } })
}
export const shareInfo = async (data: shareType) => {
    return request('/api/member/dingtalk/message/sendMessage', { data, method: 'POST' })
}
export const isGuide = async (params: any) => {
    return request('/api/spf-cc/b/evaluation/library/queryGuide', { params })
}
export const getBResult = async (params: IBResultParams) => {
    return request('/api/spf-cc/b/evaluation/management/getExamUsers', { params })
}
export const upDateGuide = async (data: any) => {
    return request('/api/spf-cc/b/evaluation/library/updateReadGuide', { data, method: 'POST' })
}
// 获取当前钉钉组织架构下所有人员
export const getAllPeople = async (params: IGetAllPeopleParams) => {
    return request('/api/member/user/aggr/allUserFuzzy', { params })
}
// 获取已选测评人员id
export const queryExamUserIds = async (examId: number) => {
    return request('/api/spf-cc/b/evaluation/management/queryExamUserIds', { params: { examId } })
}
// 创建测评
export const createExam = async (data: ICreteExamParams) => {
    return request('/api/spf-cc/b/evaluation/library/createExam', { data, method: 'POST' })
}
// 获取点券数量
export const getPointAsset = async (params: IPointAssetParams) => {
    return request('/api/trade/b/point/getPointAsset', { params })
}
// 获取充值记录
export const getRechargeFlow = async (params: IRechargeFlow) => {
    return request('/api/trade/b/point/queryRechargeFlow', { params })
}
// 获取消耗记录
export const getConsumeFlow = async (params: IConsumeFlow) => {
    return request('/api/trade/b/point/queryConsumeFlow', { params })
}
// 获取充值链接
export const getRechargeUrl = async (params: IRechargeUrl) => {
    return request('/api/member/c/trade/skuPage', { params })
}
// 获取测评列表
export const getExamList = async (params?: IExamListParams) => {
    return request('/api/spf-cc/b/evaluation/management/getExamInformationList', { params })
}
// 解锁查看
export const UnLockReport = async (data: IUnLockParams) => {
    return request('/api/spf-cc/b/evaluation/management/unlockItem', { data, method: 'POST' })
}
// 获取会话id
export const queryConversationUserList = async (openConversationId: string) => {
    return request('/api/spf-cc/cool/evaluation/queryConversationUserList', { data: { openConversationId }, method: 'post' });
};
// 获取测评详情数据
export const getExamUsers = async (data: IExamUsers) => {
    return request('/api/spf-cc/b/evaluation/management/getExamUsers', { data, method: 'POST' })
}
// 添加招聘测评
export const addRecruitmentExam = async (data: IRecruitmentExam) => {
    return request('/api/spf-cc/b/evaluation/recruitment/addRecruitmentExam', { data, method: 'POST' })
}
// 查询招聘测评列表
export const queryRecruitmentExamList = async (data: IRecruitmentExamList) => {
    return request('/api/spf-cc/b/evaluation/recruitment/queryRecruitmentExamList', { data, method: 'POST' })
}
// 更新招聘信息
export const updateRecruitment = async (data: IUpdateRecruitment) => {
    return request('/api/spf-cc/b/evaluation/recruitment/updateRecruitment', { data, method: 'POST' })
}
// 获取招聘测评的详细信息
export const getUserExamResult = async (data: IUserExamResult) => {
    return request('/api/spf-cc/b/evaluation/recruitment/getUserExamResult', { data, method: 'GET' })
}
// 招聘测试解锁报告
export const recruitmentUnlockItem = async (data: IUnlockItem) => {
    return request('/api/spf-cc/b/evaluation/recruitment/unlockItem', { data, method: 'POST' })
}
// 专业版报告
export const getExamResult = async (params: any) => {
    return request('/api/spf-cc/b/evaluation/management/getUserExamResult', { params })
}
// 招聘获取pdf报告结果
export const getPDFResult = async (params: IUserExamResult) => {
    return request('/api/spf-cc/c/evaluation/result/getUserExamResult', { params, method: 'GET' })
}
// pdf下载
export const getPDFDownLoad = async (params: IPDFDownLoadParams) => {
    return request('/api/spf-cc/c/evaluation/result/downloadPdf', { params, method: 'GET' })
}
// 轮训获取当前完成的key
export const getSelectPdfStatus = async (taskIds: number[]) => {
    return request('/api/spf-cc/c/evaluation/result/selectPdfStatus', { data: { taskIds }, method: 'POST' })
}
// pdf下载
export const getIsHasPdf = async (params: IsHasPdfParams) => {
    return request('/api/spf-cc/c/evaluation/result/isHasPdf', { params, method: 'GET' })
}
// 价值观画像发布
export const portraitPublish = async (data: IPortraitPublish) => {
    return request('/api/member/position/publish', { method: 'POST', data })
}
// 价值观画像列表
export const getPortraitList = async () => {
    return request('/api/member/position/getList')
}
// 获取菜单
export const getMenu = async (params: MenuParams) => {
    return request('/api/member/b/mng/menu/list/db', { params, method: 'GET' })
}
// 人员权限设置
export const setUserRole = async (params: UserRoleParams) => {
    return request('/api/member/auth/setUserRole', { params, method: 'POST' })
}
// 获取人员权限列表
export const queryPermissionUserList = async (params: PermissionUserListParams) => {
    return request('/api/member/auth/queryPermissionUserList', { params, method: 'GET' })
}