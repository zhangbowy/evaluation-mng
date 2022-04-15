import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getJoinExamUsers, queryDept, queryUser } from '@/services/api';
import { Avatar, Empty, Space, Spin } from 'antd';
import { history } from 'umi';
import debounce from 'lodash/debounce';
import { useMemo, useRef, useState } from 'react';
import queryString from 'query-string';

const UserReport: React.FC = () => {
  const { corpId, appId } = queryString.parse(location.search);
  // const [userOptions, setUserOptions] = useState<any[]>([]);
  // const [userId, setUserId] = useState<string>();
  const [deptId, setDeptId] = useState<string>();
  const [deptOptions, setDeptOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchRef = useRef(0);
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
  // const debounceUserFetcher = useMemo(() => {
  //   const fetchUser = async (value: string) => {
  //     fetchRef.current += 1;
  //     const fetchId = fetchRef.current;
  //     setUserOptions([]);
  //     setLoading(true);
  //     try {
  //       // @ts-ignore
  //       queryUser(corpId, appId, value).then((res) => {
  //         if (fetchId !== fetchRef.current) {
  //           // for fetch callback order
  //           return;
  //         }
  //         if (res.code === 1 && res.data.totalItem > 0) {
  //           setUserOptions(
  //             res.data.resultList.map((item) => {
  //               return {
  //                 value: item.userId,
  //                 label: (
  //                   <Space>
  //                     <Avatar size="small" src={item.avatar}>
  //                       {item.name}
  //                     </Avatar>
  //                     {item.name}
  //                   </Space>
  //                 ),
  //               };
  //             }),
  //           );
  //         }
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   return debounce(fetchUser, 500);
  // }, [appId, corpId]);
  const columns: ProColumnType<UserReport>[] = [
    {
      key: 'id',
      valueType: 'index',
      title: '序号',
      search: false,
    },
    {
      dataIndex: 'name',
      title: '姓名',
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
      //   notFoundContent: loading ? <Spin size="small" /> : <Empty />,
      // },
    },
    {
      title: '部门',
      dataIndex: 'deptAggregationDTOS',
      valueType: 'select',
      fieldProps: {
        labelInValue: true,
        showSearch: true,
        placeholder: '支持部门模糊查询',
        defaultActiveFirstOption: false,
        filterOption: false,
        options: deptOptions,
        onSelect: (value: any) => {
          setDeptId(value.key);
        },
        onSearch: debounceDeptFetcher,
        notFoundContent: loading ? <Spin /> : <Empty />,
      },
      render: (dom, entity) => {
        return <Space>{entity.deptAggregationDTOS?.map((item) => item.name)}</Space>;
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueEnum: {
        0: '未设置',
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
          <a
            onClick={() => {
              if (entity.successNum === 0) {
                return;
              }
              history.push(`/report/user?id=${entity.userId}`);
            }}
          >
            报告({entity.successNum}/{entity.totalNum})
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
          params={{ deptId }}
          request={async (params) => {
            const res = await getJoinExamUsers({
              pageSize: params.pageSize,
              curPage: params.current,
              name: params.name,
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
              success: false,
            };
          }}
        />
      </ProCard>
    </PageContainer>
  );
};

export default UserReport;
