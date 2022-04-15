import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { Avatar, Empty, message, Space, Switch } from 'antd';
import { useRef } from 'react';
import { getUserList, queryUser, setAuths } from '@/services/api';
import queryString from 'query-string';
import debounce from 'lodash/debounce';

const UserList: React.FC = () => {
  const { corpId, appId } = queryString.parse(location.search);
  const actionRef = useRef<ActionType>();
  const fetchRef = useRef(0);
  const fetchUser = async (value: string) => {
    fetchRef.current += 1;
    const fetchId = fetchRef.current;
    // @ts-ignore
    const res = await queryUser(appId, value);
    if (fetchId !== fetchRef.current) {
      // for fetch callback order
      return;
    }
    if (res.code === 1 && res.data.totalItem > 0) {
      return res.data.resultList.map((item) => {
        return {
          value: item.userId,
          text: (
            <Space>
              <Avatar src={item.avatar}>{item.name}</Avatar>
              <span>{item.name}</span>
            </Space>
          ),
        };
      });
    }
    return [];
  };
  const columns: ProColumnType<User>[] = [
    { title: 'id', dataIndex: 'userId', valueType: 'index', search: false },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'select',
      fieldProps: {
        showSearch: true,
        placeholder: '支持姓名模糊查询',
        defaultActiveFirstOption: false,
        showArrow: true,
        filterOption: false,
        onSearch: async (fuzzyName) => {
          return debounce(fetchUser, 500)(fuzzyName);
        },
        notFoundContent: <Empty />,
      },
    },
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
          rowKey="userId"
          columns={columns}
          actionRef={actionRef}
          options={false}
          request={async (params) => {
            const res = await getUserList({
              corpId,
              appId,
              authPoint: 'admin',
              name: params.name,
              curPage: params.current,
              pageSize: params.pageSize,
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

export default UserList;
