import ReportResult from './index';
import { Drawer } from 'antd';
import { useEffect, useState } from 'react';
import { getExamResult } from '@/services/api';

type ExamReportPropsType = {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  userId: string;
  examId: number;
  type:string;
};
const ExamReport: React.FC<ExamReportPropsType> = ({
  visible,
  onVisibleChange,
  userId,
  examId,
  type,
}) => {
  const [result, setResult] = useState<ExamResult>();
  useEffect(() => {
    if (userId && examId) {
      getExamResult({ userId, examId }).then((res) => {
        if (res.code === 1) {
          setResult({ ...res.data, bankType: type });
        }
      });
    }
  }, [userId, examId,type])
  return (
    <Drawer
      visible={visible}
      onClose={() => { onVisibleChange(false);}}
      placement="right"
      title="测评报告详情"
      width="375px"
    >
      <ReportResult result={result} />
    </Drawer>
  );
};

export default ExamReport;
