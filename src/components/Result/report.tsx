import ReportResult from './index';
import { Drawer } from 'antd';

type ExamReportPropsType = {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  userId: string;
  examId: number;
  type: string
};
const ExamReport: React.FC<ExamReportPropsType> = ({
  visible,
  onVisibleChange,
  userId,
  examId,
  type
}) => {
  return (
    <Drawer
      visible={visible}
      onClose={() => onVisibleChange(false)}
      placement="right"
      title="测评报告详情"
      width="425px"
    >
      <ReportResult type={type} userId={userId} examId={examId} />
    </Drawer>
  );
};

export default ExamReport;
