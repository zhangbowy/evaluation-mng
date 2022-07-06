import { type } from "os";

export type TabsArr = {
    title: string;
    key: string;
    content: JSX.Element;
}

export type IConsumeFlowParams = {
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

export type IPaging = {
    pageSize?: number;
    curPage?: number;
}
export interface IConsumeTableParams extends IPaging {
    flowType?: string;
}

