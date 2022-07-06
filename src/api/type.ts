import { type } from "os";

export type IGetAllPeopleParams = {
    tpf: number;
    appId: string;
    corpId: string;
    curPage: number;
    pageSize: number;
}
export type ICreteExamParams = {
    examTemplateType: string;
    examTemplateId: number;
    examTitle: string;
    examUserList: { userId: string }[],
}

export type IPointAssetParams = {
    tpf: number;
    appId: string;
    corpId: string;
}

export type IRechargeFlow = {
    curPage: number;
    pageSize: number;
    tpf: number;
    appId: string;
    corpId: string;
}
export type IConsumeFlow = {
    curPage: number;
    pageSize: number;
    tpf: number;
    appId: string;
    corpId: string;
    bizType: string;
    flowType: string;
}

export type IRechargeUrl = {
    tpf: number;
    appId: string;
    corpId: string
    outSkuId: string;
}
export type IExamListParams = {
    curPage?: number;
    pageSize?: number;
    isFinish?: number
}

export type IUnLockParams = {
    userId: string;
    templateType: string;
    operationType: string;
    examId?:number;
}