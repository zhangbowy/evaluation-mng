import { IReportDetail } from '../../../type';

export interface propsType {
  reportDetail: IReportDetail | undefined;
  visible: boolean;
  addEvaluation: (id: any) => void;
  closeEvaluation: () => void;
  examType: string
}