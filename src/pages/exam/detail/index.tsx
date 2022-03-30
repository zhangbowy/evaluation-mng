import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { useParams } from 'umi';
import { useEffect, useState } from 'react';
import { message, Progress } from 'antd';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ExamReport from './report';

const ExamDetail: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [examId, setExamId] = useState<number>();

  const columns: ProColumnType<ExamUser>[] = [
    {
      dataIndex: 'id',
      title: '序号',
      valueType: 'index',
    },
    {
      dataIndex: 'username',
      title: '姓名',
    },
    {
      title: '部门',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '测评时间',
      dataIndex: 'created',
    },
    {
      title: '测评报告',
      key: 'report',
      valueType: 'option',
      render: (dom, entity) => [
        <a
          key="view"
          onClick={() => {
            setVisible(true);
            setUserId(entity.userId);
            setExamId(entity.examId);
          }}
        >
          查看报告
        </a>,
      ],
    },
  ];
  const { id } = useParams() as { id: string };
  useEffect(() => {
    if (!id) {
      message.error('缺少必要参数');
      return;
    }
  }, [id]);
  return (
    <PageContainer>
      <ExamReport userId={userId} examId={examId} visible={visible} onVisibleChange={setVisible} />
      <ProCard>
        <ProCard direction="row">
          <ProCard>
            <Progress type="circle" percent={75} format={(percent) => `完成度${percent}%`} />
          </ProCard>
        </ProCard>
        <ProTable<ExamUser> search={false} columns={columns} rowKey="id" />
      </ProCard>
    </PageContainer>
  );
};

export default ExamDetail;
