export interface IOption {
    deptId: number;
    name: string;
}
export interface characterProportions {
    name: string;
    number?: number | string;
    value: number | string;
}
export interface IChartList {
    characterProportions: characterProportions[];
    finishDegree: number;
    finishNum: number;
    personalityProportions: characterProportions[];
    totalNum: number;
    otherGraph: {
        [key: string]: any
    }
}
export interface IResultTable {
    curPage: number;
    pageSize: number;
    resultList: IResultList[];
    totalItem: number;
    totalPage: number;
}
export interface IResultList {
    examPaperId: number
    examTemplateTitle: string;
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
    deptId?: number;
}
export interface ITableParams extends IFromName {
    curPage?: number;
    pageSize?: number;
}


export interface IResult {
    htmlDescList: {
        matching: string;
        character: string;
        features: string;
        decision: string;
        [key: string]: string
    }[];
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

export enum IEvaluation {
    MBTI = 'MBTI-专业版',
    PDP = 'PDP',
    CA = '职业锚',
    CPI = '魅力指数',
    MBTI_O = 'MBTI-普通版',
    DISC = 'DISC',
    'XD-03' = '康帕斯价值观'
}
export interface ITagsProps {
    onTagClick?: (name: string) => void;
}
export interface IOptions {
    label: string;
    value: number
}
export interface IExamListParams {
    curPage?: number;
    pageSize?: number;
    isFinishType?: number
}

export interface ScoreParams {
    fullScore: string,
    resultType: string,
    score: string,
}

export type LineChart = {
    fraction: string;
    people: number
}
export type Average = {
    fullScore: null;
    resultSimpleType: string;
    resultType: string;
    score: number;
    groupName: string;
}

export type TeamAnalysis = {
    name: string;
    type: string;
    number: number
}
