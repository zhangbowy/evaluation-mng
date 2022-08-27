export interface IUserParams {
    corpId: string;
    appId: string;
    authPoint: string;
    curPage?: number;
    pageSize?: number;
    fuzzyName?: string | undefined;
    deptId?: number | undefined;
}

export interface IUserNewParams {
    curPage: number;
    pageSize: number;
    name?: string | undefined;
    deptId?: number | undefined;
}


export interface IUserObj {
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
interface rolesType {
    id: number;
    name: string;
    roleKey: string;
}
export interface IColumnsNew {
    createDate: string;
    deptName: string;
    name: string;
    avatar: string;
    userId: string;
    roles: rolesType[]
}
