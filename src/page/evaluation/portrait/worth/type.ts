export interface ICurSelectTag {
    [key: string]: {
        value: string,
        checked: boolean
    }
}

export interface IWorth {
    isWorth?: boolean
}

export interface IFormItem {
    sense: string;
    content: string;
}

export interface IFilterList {
    id: number;
    name: string;
    checked?: boolean;
}
export interface ITagsList {
    groupName: string;
    tags: IFilterList[]
}

export interface ICurList {
    name: string,
    description: string,
    tagIds: number[]
}
