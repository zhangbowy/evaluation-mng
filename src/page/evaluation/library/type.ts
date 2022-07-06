export interface IExamTemplateList {
    durationDesc: string;
    examLibrarySum: number;
    id: number;
    introduction: string;
    introductionImage: string;
    isBuy: boolean;
    title: string;
    type: string;
    includeText:string;
    planImage:string;
    examTemplateCommodityDetail: {
        originalPointPrice: number;
        pointPrice:number;
    };
    examCouponCommodityDetail: {
        originalPointPrice: number;
        pointPrice:number;
    }
}
export interface IAddPeopleRef {
    openModal: (item: IExamTemplateList) => void;
}
