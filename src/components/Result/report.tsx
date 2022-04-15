import ReportResult from './index';
import { Drawer } from 'antd';

type ExamReportPropsType = {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  userId: string;
  examId: number;
};
const ExamReport: React.FC<ExamReportPropsType> = ({
  visible,
  onVisibleChange,
  userId,
  examId,
}) => {
  return (
    <Drawer
      visible={visible}
      onClose={() => onVisibleChange(false)}
      placement="right"
      title="测评报告详情"
      width="375px"
    >
      <ReportResult userId={userId} examId={examId} />
    </Drawer>
  );
};

export default ExamReport;
