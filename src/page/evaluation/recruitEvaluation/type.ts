export interface IColumns {
  id: number;
  tpf: number;
  appId: number;
  corpId: number;
  name: string;
  job: string;
  phone: string;
  email: string;
  examPaperId: string;
  templateType: string;
  templateTitle: string;
  shortLink: string;
  examStatus: string;
  isOpen: boolean;
  created: string;
  userId: string;
}

export enum rectuitMap {
  '待答题' = 0,
  '进行中' = 1,
  '已完成' = 10
}

export type RecruitStatus = {
  label: string;
  value: number
}

export interface paramsType {
  candidateName?: string;
  job?: string;
  examStatus?: number;
  pageSize: number;
  curPage: number
}

export interface ISelectPdfStatusBack {
  created: number;
  exam_paper_id: number;
  id: number;
  isDeleted: number;
  oss_url: null;
  status: number;
  task_id: number;
  template_type: number;
  updated: number;
  user_id: string;
}

export type SelectPdfStatus = { examPaperId: string, taskId: number, fileName: string }