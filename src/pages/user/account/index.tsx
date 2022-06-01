import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { Button, Empty, message, Space, Spin, Switch } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getUserList, setAuths, queryDept } from '@/services/api';
import queryString from 'query-string';
import debounce from 'lodash/debounce';
import { PlusOutlined } from '@ant-design/icons';
import dd from 'dingtalk-jsapi';
import './index.less';
import { getIsGuide } from '@/utils/utils'

const UserList: React.FC = () => {
  const { corpId, appId } = queryString.parse(location.search);
  const actionRef = useRef<ActionType>();
  const [deptId, setDeptId] = useState<string>();
  const [deptOptions, setDeptOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchRef = useRef(0);
  const handleClick = async () => {
    const pickResult = await dd.biz.contact.choose({
      multiple: true, //是否多选：true多选 false单选； 默认true
      corpId,
    });
    if (pickResult.length < 1) {
      return;
    }
    const res = await setAuths({
      addAuths: ['admin'],
      userIds: pickResult.map((item: any) => item.emplId),
    });
    if (res.code === 1) {
      message.success('新建成功');
      actionRef.current?.reload();
    }
  };
  const debounceDeptFetcher = useMemo(() => {
    const fetchDept = async (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setDeptOptions([]);
      setLoading(true);
      try {
        queryDept({ corpId, appId, fuzzyName: value }).then((res) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }
          if (res.code === 1 && res.data.resultList.length > 0) {
            setDeptOptions(
              res.data.resultList.map((item) => {
                return {
                  value: item.deptId,
                  label: item.name,
                };
              }),
            );
          }
        });
      } finally {
        setLoading(false);
      }
    };
    return debounce(fetchDept, 500);
  }, [appId, corpId]);
  const columns: ProColumnType<User>[] = [
    { title: '序号', key: 'id', valueType: 'index', search: false },
    {
      title: '姓名',
      dataIndex: 'name',
      // valueType: 'select',
      // fieldProps: {
      //   labelInValue: true,
      //   showSearch: true,
      //   placeholder: '支持姓名模糊查询',
      //   defaultActiveFirstOption: false,
      //   filterOption: false,
      //   options: userOptions,
      //   onSelect: (value: any) => {
      //     setUserId(value.key);
      //   },
      //   onSearch: debounceUserFetcher,
      //   notFoundContent: loading ? <Spin /> : <Empty />,
      // },
    },
    {
      title: '部门',
      valueType: 'select',
      fieldProps: {
        labelInValue: true,
        showSearch: true,
        placeholder: '支持部门模糊查询',
        defaultActiveFirstOption: false,
        filterOption: false,
        options: deptOptions,
        onClear: () => setDeptId(undefined),
        onSelect: (value: any) => {
          setDeptId(value.key);
        },
        onSearch: debounceDeptFetcher,
        notFoundContent: loading ? <Spin /> : <Empty />,
      },
      render: (_, record) => {
        return (
          <Space>
            {record.depts?.length > 2
              ? record.depts
                .slice(0, 1)
                .map((item) => <span key={item.deptId}>{item.name}</span>)
                .concat(<span>...</span>)
              : record.depts.map((item) => <span key={item.deptId}>{item.name}</span>)}
          </Space>
        );
      },
    },
    {
      title: '操作',
      key: 'op',
      search: false,
      valueType: 'option',
      render: (_dom, record) => [
        <Switch
          style={{ color: 'red' }}
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
  useEffect(() => {
    const setsArr: stepsType[] = [{
      element: ".addpermissions",
      intro: "添加后，对应人员可以登录趣测评企业管理后台查看数据报表。",
      position: "bottom",
      disableInteraction: true,
    }]
    getIsGuide(setsArr,4)
  }, [])
  return (
    <PageContainer header={{ breadcrumb: {} }}>
      <ProCard className="heads"></ProCard>

      <ProTable<User>
        search={{ className: 'tabTitle' }}
        rowKey="userId"
        columns={columns}
        actionRef={actionRef}
        options={false}
        params={{ deptId }}
        toolBarRender={() => [
          <Button
            style={{ display: 'inline-block', marginRight: 36 }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            className='addpermissions'
            onClick={handleClick}
          >
            新建权限
          </Button>,
        ]}
        request={async (params) => {
          const res = await getUserList({
            corpId,
            appId,
            authPoint: 'admin',
            fuzzyName: params.name,
            curPage: params.current,
            pageSize: params.pageSize,
            deptId,
          });
          if (res.code === 1) {
            return {
              success: true,
              data: res.data.resultList,
              total: res.data.totalItem,
            };
          }
          return {
            success: true,
            data: res.data.resultList,
            total: res.data.totalItem,
          };
        }}
      />
    </PageContainer>
  );
};

export default UserList;
