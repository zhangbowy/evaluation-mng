import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { message, Space, Switch } from 'antd';
import { useRef } from 'react';
import { getUserList, setAuths } from '@/services/api';

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumnType<User>[] = [
    { title: 'id', dataIndex: 'userId', valueType: 'index', search: false },
    { title: '姓名', dataIndex: 'name' },
    {
      title: '部门',
      render: (_, record) => {
        return (
          <Space>
            {record.depts?.map((item) => (
              <span key={item.deptId}>{item.name}</span>
            ))}
          </Space>
        );
      },
    },
    {
      title: '操作',
      key: 'op',
      search: false,
      valueType: 'option',
      render: (_, record) => [
        <Switch
          key="switch"
          checkedChildren="开启"
          unCheckedChildren="关闭"
          onClick={async (checked) => {
            const data = checked
              ? {
                  addAuths: ['admin'],
                  userIds: [record.userId],
                }
              : {
                  removeAuths: ['admin'],
                  userIds: [record.userId],
                };
            const res = await setAuths(data);
            if (res.code === 1) {
              actionRef.current?.reload();
              message.success('操作成功');
            }
          }}
          checked={record.auths?.includes('admin')}
        />,
      ],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: {} }}>
      <ProCard>
        <ProTable<User>
          rowKey="id"
          columns={columns}
          actionRef={actionRef}
          options={false}
          request={async (params) => {
            const res = await getUserList({
              name: params.name,
              curPage: params.current,
              pageSize: params.pageSize,
            });
            if (res.code) {
              return {
                success: true,
                data: res.data,
                total: res.data.length,
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

export default UserList;
