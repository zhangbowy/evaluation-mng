import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getJoinExamUsers } from '@/services/api';
import { Space } from 'antd';

const UserReport: React.FC = () => {
  const columns: ProColumnType<UserReport>[] = [
    {
      dataIndex: 'id',
      key: 'id',
      title: '序号',
      valueType: 'index',
      search: false,
    },
    {
      dataIndex: 'name',
      title: '姓名',
    },
    {
      title: '部门',
      dataIndex: 'deptAggregationDTOS',
      render: (dom, entity) => {
        return <Space>{entity.deptAggregationDTOS?.map((item) => item.name)}</Space>;
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueEnum: {
        1: '男',
        2: '女',
      },
      search: false,
    },
    {
      title: '测评完成率',
      dataIndex: 'completion',
      valueType: 'progress',
      search: false,
    },
    {
      title: '测评',
      search: false,
      key: 'report',
      valueType: 'option',
      render: (dom, entity) => {
        return (
          <a>
            报告({entity.successNum}/{entity.remainingNum})
          </a>
        );
      },
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: {} }}>
      <ProCard>
        <ProTable<UserReport>
          rowKey="id"
          columns={columns}
          request={async (params) => {
            const res = await getJoinExamUsers({
              ...params,
              curPage: params.current,
            });
            if (res.code === 1) {
              return {
                success: true,
                data: res.data.resultList,
                total: res.data.totalItem,
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
