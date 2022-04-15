declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design Dedicated environment variable, please do not use it in your project.
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

type Result<T> = {
    code: number;
    message: string;
    data: T
}

type Page<T> = {
    curPage: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
    resultList: T[];
}

type LoginResult = {
    user: User;
    token: string;
    authLogin: boolean; // true 已经授权过
}

type User = {
    userId: string;
    name: string;
    avatar: string;
    auths: string[];
    depts: { deptId: number; name: string }[];
    gender: 0 | 1 | 2; // 0 未设置 1 男 2女
}


type UserReport = {
    userId: string;
    name: string;
    sex: number;
    completion: number;
    totalNum: number;
    successNum: number;
    deptAggregationDTOS: {
        name: string;
    }[];
}
type ExamUsers = {
    num: number;
    finishValue: string;
    examTitle: string;
    introduction: string;
    userExamVos: ExamUser[];
}

type ExamUser = {
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

type ExamListItem = {
    id: number;
    evaluationName: string;
    totalNumber: number;
    finishNumber: number;
    completion: number;
    created: string;
    type: boolean;
}

type ExamTemplateListItem = {
    id: number;
    title: string;
    type: string;
    introduction: string;
    introductionImage: string;
    durationType: string;
    duration: string;
    durationDesc: string;
    //题库总数
    examLibrarySum: number;
}

type AllExam = {
    deptList: { name }[];
    name: string;
    sex: number;
    successNum: number;
    remainingNum: number;
    userTagVoList: {
        id: string;
        name: string;
        icon: string;
    }[];
    evaluationVoList: Exan[]
}

type Exam = {
    examId: number;
    examName: string;
    date: string;
    // 答题状态 0:未开始 1：答题中 2:答题完成 3:分析中 10:分析完成
    answerStatus: number;
}

type ExamResult = {
    user: {
        name: string;
        avatar: string;
        userId: string;
    };
    // 答题进度, questionSeqId
    progress: number;
    status: number;
    polygon: string;
    textDesc: string;
    imageDesc: string;
    htmlDesc: string;
    results: {
        type: string;
        typeIcon: string;
    }[];
    tags: {
        name: string;
        icon: string;
    }
}

type SignResult = {
    agentId: string;
    corpId: string;
    timeStamp: string;
    nonceStr: string;
    signature: string;
}