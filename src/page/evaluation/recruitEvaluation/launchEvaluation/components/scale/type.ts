
export interface scaleType {
  isLock: boolean;
  title: string,
  content: string,
  isSelect: boolean
}

export interface propsType {
  setStampsNum: (num: number, type: string) => void
}

export interface IExamTemplateList {
  durationDesc: string;
  examLibrarySum: number;
  id: number;
  introduction: string;
  introductionImage: string;
  isBuy: boolean;
  title: string;
  type: string;
  includeText: string;
  planImage: string;
  examTemplateCommodityDetail: {
    pointPrice: number;
  };
  examCouponCommodityDetail: {
    pointPrice: number;
  }
}

export type titleType = {
  [key: string]: string
}