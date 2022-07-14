
export interface TabsArr {
    title: string;
    key: string;
    content: JSX.Element;
}

export interface IConsumeFlowParams {
    userId: string;
    name: string;
    avatar: string;
}
export interface IConsumeTableList {
    id: number;
    amount: number;
    buyer: IConsumeFlowParams | null;
    name: string;
    operateDate: string;
    operator: IConsumeFlowParams | null;
}

export interface IPaging {
    pageSize?: number;
    curPage?: number;
}
export interface IConsumeTableParams extends IPaging {
    flowType?: string;
}

