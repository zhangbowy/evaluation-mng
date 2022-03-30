import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getJoinExamUsers } from '@/services/api';

const UserReport: React.FC = () => {
  const columns: ProColumnType<ExamUser & { completion: string; evalutionNum: number }>[] = [
    {
      dataIndex: 'id',
      title: '序号',
      valueType: 'index',
      search: false,
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
      search: false,
    },
    {
      title: '测评完成率',
      dataIndex: '',
      search: false,
    },
    {
      title: '测评',
      search: false,
      key: 'report',
      valueType: 'option',
      render: (dom, entity) => [<a key="rep">报告</a>],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: {} }}>
      <ProCard>
        <ProTable<ExamUser & { completion: string; evalutionNum: number }>
          rowKey="id"
          columns={columns}
          request={async (params) => {
            const res = await getJoinExamUsers(params);
            if (res.code !== 1) {
              return {
                success: true,
                data: res.data,
              };
            }
            return {
              success: false,
            };
          }}
        />
      </ProCard>
    </PageContainer>
  );
};

export default UserReport;
