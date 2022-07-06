export interface IReportParams {
    name?: string;
    deptId?: number;
    curPage?: number;
}
export interface IReportList {
    totalNum: number;
    completion: number;
    isDimission: number;
    name: string;
    sex: ISex;
    successNum: number;
    userId: string;
    id: number;
}

export interface IDeptAggregationDTOS {
    deptId: number;
    name: string;
}
export enum ISex {
    '男' = 1,
    '女' = 2
}
export enum IisDimission {
    '在职',
    '离职'
}
type IDeptList = {
    name: string;

}
export type IEvaluationVoList = {
    answerStatus: number;
    date: string;
    examId: number;
    examName: string;
    examPaperId: number;
    examTemplateType: string;
    logoImage:string;
    includeText:string;
}
export type IUserTagVoList = {
    id: number;
    name: string;
}
export interface IReportDetail {
    deptList: IDeptList[];
    evaluationVoList: IEvaluationVoList[];
    finishValue: number;
    name: string;
    remainingNum: number;
    sex: ISex;
    successNum: number;
    userTagVoList: IUserTagVoList[];
    avatar:string;
}