export type IGetAllPeopleParams = {
    tpf: number;
    appId: string;
    corpId: string;
    curPage: number;
    pageSize: number;
}
export type ICreteExamParams = {
    examTemplateType: string;
    examTemplateId: number;
    examTitle: string;
    examUserList: {userId:string}[],
}