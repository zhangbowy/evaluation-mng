import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Switch } from 'antd';
import { editExam, examList } from '@/services/api';
import { history } from 'umi';

const ExamList: React.FC = () => {
  const handleClick = (id: number) => {
    history.push('/exam/' + id);
  };
  const columns: ProColumnType<ExamListItem>[] = [
    { title: '序号', valueType: 'index', dataIndex: 'id' },
    { title: '测试名称', dataIndex: 'evaluationName' },
    { title: '覆盖人数', dataIndex: 'totalNumber' },
    { title: '完成人数', dataIndex: 'finishNumber' },
    { title: '完成率', dataIndex: 'completion', valueType: 'progress' },
    { title: '创建人', dataIndex: 'createName' },
    { title: '创建时间', dataIndex: 'created', valueType: 'dateTime' },
    {
      key: 'detail',
      render: (_dom, entity) => <a onClick={() => handleClick(entity.id)}>查看详情</a>,
    },
    {
      key: 'op',
      title: '操作',
      valueType: 'option',
      render: (_dom, entity) => [
        // <a key="edit">编辑</a>,
        <Switch
          key="switch"
          checkedChildren="开启"
          unCheckedChildren="关闭"
          onClick={(checked) => {
            editExam({ type: checked, examId: entity.id });
          }}
          checked={entity.type}
        />,
      ],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: {} }}>
      <ProCard>
        <ProTable<ExamListItem>
          search={false}
          rowKey="id"
          columns={columns}
          request={async (params) => {
            const res = await examList({ ...params, curPage: params.current });
            if (res.code === 1) {
              return {
                success: true,
                data: res.data.resultList,
                total: res.data.totalItem,
              };
            }
            return { success: false };
          }}
        />
      </ProCard>
    </PageContainer>
  );
};

export default ExamList;
