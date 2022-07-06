declare module '*.css';
declare module '*.less';
declare module 'dingtalk-jsapi'

interface IMenuItem {
    id: number;
    name: string;
    icon?: string;
    path: string;
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
    userId: string | undefined;
    examId: string;
    deptId?: string;
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
    logoImage:string;
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
    examTemplateType: string;
    introductionImage: {
        admin: string;
        mobile: {
            detail: string
        }
    }
    introduction: string;
    planImage:string;
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
    originalPointPrice?:number;
}
interface IDDSelectPeopleParams {
    usersList: string[];
    selectedUsers?: string[];
    corpId: string;
    successFn: (data: Multiple[]) => void;
    originalPointPrice?:number;
}
interface Multiple {
    name: string;
    avatar: string;
    emplId: string;
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