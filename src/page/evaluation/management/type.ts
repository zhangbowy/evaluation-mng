export type IOption = {
    deptId: number;
    name: string;
}
export type characterProportions = {
    name: string;
    value: number | string;
}
export interface IChartList {
    characterProportions: characterProportions[];
    finishDegree: number;
    finishNum: number;
    personalityProportions: characterProportions[];
    totalNum: number;
}
export interface IResultTable {
    curPage: number;
    pageSize: number;
    resultList: IResultList[];
    totalItem: number;
    totalPage: number;
}
export interface IResultList {
    examPaperId: number;
    deptAggregationDTOS: {
        name: string;
    }[],
    examId: number;
    name: string;
    sex: number;
    userId: string;
    startTime: string;
    // 状态 0:未开始 1：答题中 2:答题完成 3:分析中 10:分析完成
    status: number;
}

export interface IDepartment {
    name: string
}

export interface IFromName {
    name?: string;
    status?: string;
    tags?: string;
    resultType?: string;
}
export interface ITableParams extends IFromName {
    curPage?: number;
    pageSize?: number;
}


export interface IResult {
    examTemplateType: string;
    polygon: string;
    results: {
        type: string;
        typeIcon: string;
    }[];
    tags: {
        appId: string;
        icon: string;
        id: number;
        name: string;
        tpf: number;
    }[];
    textDesc: string[];
    user: {
        avatar: string;
        name: string;
        userId: string;
    };
    imageDesc: string[];
}
export enum ISex {
    '男' = 1,
    '女' = 2
}
export enum IisDimission {
    '在职',
    '离职'
}

export type ITagsProps = {
    onTagClick: (name: string) => void;
}
export type IOptions = {
    label: string;
    value: number
}
export type IExamListParams={
    curPage?: number;
    pageSize?: number;
    isFinishType?:number
}