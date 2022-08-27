
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

export interface IRecruitmentExam {
    name: string,
    job: string,
    phone?: string,
    email?: string,
    templateType: string
}

export interface IRecruitmentExamList {
    candidateName?: string,
    job?: string,
    examStatus?: number,
    pageSize: number,
    curPage: number
}
export interface IUpdateRecruitment {
    isOpen: number,
    rId: number
}
export interface IUserExamResult {
    userId: string,
    examPaperId: string,
    major?: boolean
}
export interface IUnlockItem {
    operationType: string,
    templateType: string,
    userId: string | number
}
export interface IBResultParams {
    examPaperId: string;
    userId: string;
}

export interface IUserExamResultBack {
    IUserExamResult: string;
    examTemplateType: string;
    htmlDesc: {
        ability: {
            [key: string]: string;
        };
        dimensional: {
            advantage: string;
            data: string;
            jpg: string;
            name: string;
            shortcoming: string;
            tag: string;
        }[];
        personality: any;
    }
    polygon: string;
    results: {
        type: string;
        typeIcon: string;
    }[];
    scoreDetail: {
        [key: string]: {
            fullScore: number;
            resultType: string;
            score: number;
        }
    };
    status: number;
    tags: {
        appId: string;
        icon: string;
        id: number;
        tpf: number;
    }[];
    textDesc: string[];
    user: {
        avatar: string;
        gender: number;
        name: string;
        userId: string;
    }
}


export interface IPDFDownLoadParams {
    url: string;
    examPaperId: string;
    userId: string;
    templateType: number;
}

export interface IsHasPdfParams {
    examPaperId: string;
    templateType: number;
}

export interface MenuParams {
    tpf: 1,
    appId: string
}

export interface UserRoleParams {
    userIds: string[];
    roleKeys: string[];
}
export interface PermissionUserListParams {
    name?: string;
    roleName?: string;
    deptId?: number;
    pageSize: number;
    curPage: number
}