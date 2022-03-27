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
    gender: 0 | 1 | 2; // 0 未设置 1 男 2女
}

type ExamListItem = {
    id: number;
    evaluationName: string;
    totalNumber: number;
    finishNumber: number;
    completion: string;
    created: string;
}

type ExamTemplateListItem = {
    id: number;
    title: string;
    type: string;
    introduction: string;
    durationType: string;
    duration: string;
    //题库总数
    examLibrarySum: number;
}