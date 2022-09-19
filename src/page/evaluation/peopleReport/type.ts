export interface IReportParams {
    name?: string;
    deptId?: number;
    curPage?: number;
    pageSize?: number;
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
interface IDeptList {
    name: string;
}
export interface IEvaluationVoList {
    answerStatus: number;
    date: string;
    examId: number;
    examName: string;
    examPaperId: number;
    examTemplateType: string;
    logoImage: string;
    includeText: string;
    finishQuestionCount: number;
    totalQuestionCount: number;
}
export interface IUserTagVoList {
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
    avatar: string;
    position: string;
    userId: shareType;
}