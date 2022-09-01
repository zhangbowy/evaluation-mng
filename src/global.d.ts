declare module '*.css';
declare module '*.less';
declare module 'dingtalk-jsapi'

interface IMenuItem {
    id: number;
    name: string;
    icon?: string;
    path: string;
    authKey?: string;
    children?: IMenuItem[];
}
interface shareType {
    cid: string;
    message: any;
    userId: string | undefined;
}
interface chartDate {
    tpf: 1,
    appId: string;
    corpId: string;
    userId?: string | undefined;
    examId: string;
    deptId?: number;
}
interface DataType {
    completion: number;
    createName: string | null;
    created: string;
    evaluationName: string;
    examTemplateType: string;
    finishNumber: number;
    id: number;
    templateId: number;
    totalNumber: number;
    type: boolean;
    logoImage: string;
    paperPrice: number;
    fromSourceType: number;
}
interface IBack {
    code: number;
    data: any;
    message: string;
    requestId: string;
}
interface IMeasurement {
    num: number;
    finishValue: string;
    examTitle: string;
    introduction: string;
    examTemplateType: 'CA' | 'PDP' | 'MBTI' | 'CPI' | 'DISC' | 'MBTI_O';
    introductionImage: {
        admin: string;
        mobile: {
            detail: string
        }
    }
    introduction: string;
    planImage: string;
}

interface IBackResult {
    code: number;
    data: any;
    message: string;
}
interface IDept {
    deptId: number;
    name: string;
}

enum IGender {
    '男' = 1,
    '女' = 2
}
interface ILogin {
    authLogin: boolean;
    token: string;
    user: {
        admin: false,
        auths: string[],
        avatar: string,
        deptIds: Array,
        gender: IGender,
        name: string,
        userId: string
        roles: string[]
    }
}

interface IAddPeopleParams {
    appId: string;
    corpId: string;
    id?: number;
    successFn: () => void;
    failFn: () => void
    examTemplateType?: string;
    examTemplateId?: number;
    examTitle?: string;
    examUserList?: { userId: string }[]
    pointPrice?: number;
    availableBalance: number;
}
interface IDDSelectPeopleParams {
    usersList: string[];
    selectedUsers?: string[];
    corpId: string;
    successFn: (data: Multiple[]) => void;
    pointPrice?: number;
    availableBalance?: number
}
interface Multiple {
    name: string;
    avatar: string;
    emplId: string;
}

interface ComplexPicker {
    selectedCount: number;
    users: Multiple[]
}

interface IUser {
    userId: string;
    name: string;
}
interface StepsType {
    intro: string;
    element?: string | HTMLElement | Element | undefined;
    position?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'bottom-left-aligned'
    | 'bottom-middle-aligned'
    | 'bottom-right-aligned'
    | 'auto' | undefined;
    tooltipClass?: string | undefined;
    highlightClass?: string | undefined;
    scrollTo?: 'off' | 'tooltip' | 'element' | undefined;
    disableInteraction?: boolean | undefined;
    title?: string | undefined;
    step?: number | undefined;
}

// 环境变量变量声明
interface ImportMetaEnv {
    readonly VITE_PROJECT_ENV: string
    readonly VITE_BASE_URL: string;
    readonly VITE_COOLAPPCODE: string;
}


interface IObjType {
    [key: string]: any;
}
// interface IBackResult<T> {
//     code: number;
//     data: T;
//     message: null | string
// }