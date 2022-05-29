import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getJoinExamUsers, queryDept } from '@/services/api';
import { Empty, Space, Spin } from 'antd';
import { history, useLocation } from 'umi';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import queryString from 'query-string';
import './index.less';
import { getIsGuide } from '@/utils/utils'

const UserReport: React.FC = () => {
  const { corpId, appId } = queryString.parse(location.search);
  // const [userOptions, setUserOptions] = useState<any[]>([]);
  // const [userId, setUserId] = useState<string>();
  const [deptId, setDeptId] = useState<string>();
  const [deptOptions, setDeptOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [reportList, setReportList] = useState<any>(); // 列表数据
  const locquery: any = useLocation()
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
  useEffect(() => {
    if (reportList) {
      const setpsArr: stepsType[] = [{
        element: ".ant-page-header-heading-title",
        intro: "用于从员工维度查看每个人参与测评的情况，和报告详情",
        position: "bottom"
      }]
      if (reportList.length > 0) {
        setpsArr.push({
          element: ".reportBtn0",
          intro: "点击可查看员工标签和报告详情",
          position: "bottom"
        })
      }
      getIsGuide(setpsArr,3)
    }
  }, [reportList])
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
        onClear: () => setDeptId(undefined),
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
        return (
          <Space>
            {entity.deptAggregationDTOS?.length > 2
              ? entity.deptAggregationDTOS
                .slice(0, 1)
                .map((item) => item.name)
                .concat('...')
              : entity.deptAggregationDTOS.map((item) => item.name)}
          </Space>
        );
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
      title: '是否在职',
      dataIndex: 'isDimission',
      valueEnum: {
        0: '在职',
        1: '离职',
      },
    },
    {
      title: '测评',
      search: false,
      key: 'report',
      valueType: 'option',
      render: (dom, entity, index) => {
        return (
          <a
            className={`reportBtn${index}`}
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
      <ProCard className='head'></ProCard>
      <ProTable<UserReport>
        search={{ className: 'proTitle' }}
        rowKey="id"
        columns={columns}
        params={{ deptId }}
        options={false}
        request={async (params) => {
          const res = await getJoinExamUsers({
            pageSize: params.pageSize,
            curPage: params.current,
            name: params.name,
            deptId,
          });
          if (res.code === 1) {
            setReportList(res.data.resultList)
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
        pagination={{
          showSizeChanger: true,
          pageSize: 10,
          current: locquery.query.current || 1,
          onChange: (e) => {
            history.push(`/report?current=${e}`)
          }
        }}
      />
    </PageContainer>
  );
};

export default UserReport;
