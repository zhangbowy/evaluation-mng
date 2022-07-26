export interface IColumns {
  id: number,
  tpf: number,
  appId: number,
  corpId: number,
  name: string,
  job: string,
  phone: string,
  email: string,
  examPaperId: number,
  templateType: string,
  shortLink: string,
  examStatus: string,
  isOpen: boolean,
  created: string
}

export enum rectuitMap {
  '待答题' = 0,
  '进行中' = 1,
  '已完成' = 10,
}

export type RecruitStatus = {
  label: string,
  value: number
}

export interface paramsType {
  candidateName?: string,
  job?: string,
  examStatus?: number,
  pageSize: number,
  curPage: number
}