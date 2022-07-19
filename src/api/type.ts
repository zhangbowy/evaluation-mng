
export interface IGetAllPeopleParams {
    tpf: number;
    appId: string;
    corpId: string;
    curPage: number;
    pageSize: number;
}
export interface ICreteExamParams {
    examTemplateType: string;
    examTemplateId: number;
    examTitle: string;
    examUserList: { userId: string }[],
    fromSourceType?: number;
    fromSourceId?: number;
}

export interface IPointAssetParams {
    tpf: number;
    appId: string;
    corpId: string;
}

export interface IRechargeFlow {
    curPage: number;
    pageSize: number;
    tpf: number;
    appId: string;
    corpId: string;
}
export interface IConsumeFlow {
    curPage: number;
    pageSize: number;
    tpf: number;
    appId: string;
    corpId: string;
    bizType: string;
    flowType: string;
}

export interface IRechargeUrl {
    tpf: number;
    appId: string;
    corpId: string
    outSkuId: string;
}
export interface IExamListParams {
    curPage?: number;
    pageSize?: number;
    isFinish?: number
}

export interface IUnLockParams {
    userId: string;
    templateType: string;
    operationType: string;
    examId?: number;
}

export interface IExamUsers {
    curPage?: number;
    pageSize?: number;
    name?: string;
    resultType?: string;
    status?: number[] | string;
    tags?: string;
}

export interface IBResultParams {
    examPaperId: string;
    userId: string;
}