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
    id:number;
    amount: number;
    buyer: IConsumeFlowParams | null;
    name: string;
    operateDate: string;
    operator: IConsumeFlowParams | null;
}