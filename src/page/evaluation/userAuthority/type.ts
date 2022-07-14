export interface IUserParams {
    corpId: string;
    appId: string;
    authPoint: string;
    curPage?: number;
    pageSize?: number;
    fuzzyName?: string | undefined;
    deptId?: number | undefined;
}



export interface IColumns {
    auths: string[];
    depts: IDept[];
    name: string;
    avatar: string;
    userId: string;
}