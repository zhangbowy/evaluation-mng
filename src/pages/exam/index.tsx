import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Switch } from 'antd';

const ExamList: React.FC = () => {
  const columns: ProColumnType<ExamListItem>[] = [
    { title: '序号', valueType: 'index', dataIndex: 'id' },
    { title: '测试名称', dataIndex: 'evaluationName' },
    { title: '覆盖人数', dataIndex: 'totalNumber' },
    { title: '完成人数', dataIndex: 'finishNumber', valueType: 'progress' },
    { title: '完成率', dataIndex: 'completion' },
    { title: '创建人', dataIndex: '' },
    { title: '创建时间', dataIndex: 'created', valueType: 'dateTime' },
    { key: 'detail', render: (_dom, entity) => <a>查看详情</a> },
    {
      key: 'op',
      title: '操作',
      valueType: 'option',
      render: (_dom, entity) => [
        <a key="edit">编辑</a>,
        <Switch
          key="switch"
          checkedChildren="开启"
          unCheckedChildren="关闭"
          onClick={(checked) => {}}
          checked={!!entity}
        />,
      ],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: {} }}>
      <ProCard>
        <ProTable<ExamListItem> search={false} rowKey="id" columns={columns} />
      </ProCard>
    </PageContainer>
  );
};

export default ExamList;
