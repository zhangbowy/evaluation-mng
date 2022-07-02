export interface IExamTemplateList {
    durationDesc: string;
    examLibrarySum: number;
    id: number;
    introduction: string;
    introductionImage: string;
    isBuy: boolean;
    title: string;
    type: string;
}
export interface IAddPeopleRef {
    openModal: (item: IExamTemplateList) => void;
}
