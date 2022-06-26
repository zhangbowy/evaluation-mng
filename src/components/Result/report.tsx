import ReportResult from './index';
import { Drawer } from 'antd';
import { useEffect, useState } from 'react';
import { getExamResult } from '@/services/api';

type ExamReportPropsType = {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  examPaperId: number;
  userId:string;
  type: string;
};
const ExamReport: React.FC<ExamReportPropsType> = ({
  visible,
  onVisibleChange,
  examPaperId,
  userId,
  type,
}) => {
  const [result, setResult] = useState<ExamResult>();
  useEffect(() => {
    if (userId&&examPaperId) {
      getExamResult({ examPaperId,userId }).then((res) => {
        if (res.code === 1) {
          setResult({ ...res.data, bankType: type });
        }
      });
    }
  }, [userId,examPaperId, type])
  return (
    <Drawer
      visible={visible}
      onClose={() => { onVisibleChange(false); }}
      placement="right"
      title="测评报告详情"
      width={type == 'PDP' ? '375px' : '410px'}
    >
      <ReportResult result={result} />
    </Drawer>
  );
};

export default ExamReport;
