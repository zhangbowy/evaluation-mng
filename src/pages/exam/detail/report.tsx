import { Drawer } from 'antd';

type ExamReportPropsType = {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  userId: string;
  examId: number;
};
const ExamReport: React.FC<ExamReportPropsType> = ({ visible, onVisibleChange }) => {
  return (
    <Drawer
      visible={visible}
      onClose={() => onVisibleChange(false)}
      placement="right"
      title="测评报告详情"
    >
      <p></p>
    </Drawer>
  );
};

export default ExamReport;
