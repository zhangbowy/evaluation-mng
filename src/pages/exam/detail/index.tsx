import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { useParams, useLocation, useHistory, } from 'umi';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Col, message, Progress, Row, Space, Typography, Breadcrumb, Button, Select, Input, Drawer, Empty, Spin } from 'antd';
import { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ExamReport from '../../../components/Result/report';
import { getExamUsers, getChart, queryDept, getAllInfo,measurementExport } from '@/services/api';
import { Liquid, Column, Treemap } from '@antv/g2plot';
import debounce from 'lodash/debounce';
import queryString from 'query-string';
import './index.less';

const ExamDetail: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [examId, setExamId] = useState<number>();
  const [examUsers, setExamUsers] = useState<ExamUsers>(); //  table表格数据
  const [measurement, setMeasurement] = useState<Measurement>(); //测评信息
  const [department, setDepartment] = useState<any>([]); // 部门option
  const [introduceVisible, setIntroduceVisible] = useState<boolean>(false); // 侧边盒子显示
  const [chartList, setChartList] = useState<any>() // 图表数据
  const [deptId, setDeptId] = useState<string>(); // 选中的部门deptId
  const [nameSearchLoading, setNameSearchLoading] = useState<boolean>(false); // 名字搜索的loading
  const completionRef: any = useRef([]) // 图表显示的节点
  const fetchRef = useRef(0);
  const [fetching, setFetching] = useState(false);
  const locat: any = useLocation()
  const { corpId, appId, clientId } = queryString.parse(location.search) as {
    corpId: string;
    appId: string;
    clientId: string;
  };

  const columns: ProColumnType<ExamUser>[] = [
    {
      key: 'id',
      title: '序号',
      valueType: 'index',
    },
    {
      dataIndex: 'name',
      title: '姓名',
    },
    {
      title: '部门',
      dataIndex: 'deptAggregationDTOS',
      render: (dom, entity) => {
        return <Space>{entity.deptAggregationDTOS.map((item) => item.name)}</Space>;
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
    },
    {
      title: '测评时间',
      dataIndex: 'startTime',
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
      title: '测评报告',
      key: 'report',
      valueType: 'option',
      render: (dom, entity) => {
        if (entity.status === 10) {
          return (
            <a
              key="view"
              style={{ float: 'right', marginRight: 20 }}
              onClick={() => {
                setVisible(true);
                setUserId(entity.userId);
                setExamId(entity.examId);
              }}
            >
              查看报告
            </a>
          );
        }
        return entity.status === 0 ? (
          <span style={{ color: 'rgba(0, 0, 0, 0.45)', marginRight: 10, float: 'right' }}>
            未参加测评
          </span>
        ) : (
          <span style={{ marginRight: 30, float: 'right' }}>
            测评中
          </span>
        );
      },
    },
  ];
  const history = useHistory()
  const { id } = useParams() as { id: string };
  // 获取表格数据
  const getTableList = (name?: string) => {
    getExamUsers({ examid: id, name }).then((res) => {
      if (res.code === 1) {
        setExamUsers(res.data);
        setNameSearchLoading(false)
      }
    });
  }
  useEffect(() => {
    if (!id) {
      message.error('缺少必要参数');
      return;
    }
    getTableList()
    getAllInfo(id).then(res => {
      if (res.code === 1) {
        setMeasurement(res.data)
      }
    })
  }, [id]);
  useEffect(() => {
    getChart({ tpf: 1, appId, corpId, userId, examId: id, deptId }).then(res => {
      if (res.code === 1) {
        setChartList(res.data);
      }
    })
  }, [deptId])
  useEffect(() => {
    // console.log(completionRef.current.length)
    if (completionRef.current.length > 0) {
      completionList().render()
      personalityList().render()
      characterList().render()
    }
  }, [examUsers])
  // 部门onSerach
  const debounceFetcher = useMemo(() => {
    const loadOptions = async (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setDepartment([]);
      setFetching(true);
      try {
        queryDept({ corpId, appId, fuzzyName: value }).then(res => {
          if (fetchId !== fetchRef.current) {
            return;
          }
          if (res.code == 1 && res.data.resultList.length > 0) {
            setDepartment(res.data.resultList.map((item) => {
              return {
                value: item.deptId,
                label: item.name,
              };
            }))
            setFetching(false);
          }
        })
      } catch (error) {
        setFetching(false);
      }
    };

    return debounce(loadOptions, 500);
  }, [corpId, appId]);
  if (!examUsers) {
    return <PageLoading />;
  }
  // 测评完成率
  const completionList = () => {
    const liquidPlot = new Liquid(completionRef.current[0], {
      percent: chartList?.finishDegree && chartList?.finishDegree / 100,
      height: 280,
      width: 250,
      outline: {
        border: 4,
        distance: 8,
      },
      wave: {
        length: 128,
      },
    });
    return liquidPlot
    // liquidPlot.render();
  }
  // 人格分布占比
  const personalityList = () => {
    const columnPlot = new Column(completionRef.current[1], {
      width: 400,
      height: 300,
      data: chartList?.personalityProportions,
      xField: 'name',
      yField: 'value',
      color: '#fe7345',
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      yAxis: {
        max: 5,
        min: 0
      },
      meta: {
        value: {
          alias: '人格占比',
        },
      },
    });
    return columnPlot
    // columnPlot.render();
  }
  // 性格图表
  const characterList = () => {
    const data = {
      name: 'root',
      children: chartList?.characterProportions
    }
    const treemapPlot = new Treemap(completionRef.current[2], {
      width: 400,
      height: 300,
      data,
      colorField: 'name',
    });
    return treemapPlot
    // treemapPlot.render();
  }
  // 表格名称搜索
  const onSearch = (value: string) => {
    setNameSearchLoading(true)
    // getTableList(value)
    // console.log(completionList())
  }
  // 导出
  const onDeriveClick = () =>{
    // measurementExport().then(res=>{
    //   console.log(res)
    // })
  }
  return (
    <PageContainer>
      <ExamReport type={locat?.query?.type} userId={userId} examId={examId} visible={visible} onVisibleChange={setVisible} />
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>
          <a href='#/exam/index'>测评管理</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{measurement?.examTitle}</Breadcrumb.Item>
      </Breadcrumb>
      <div className='detatil_card_layout'>
        <div className='detatil_card_top'>
          <div className='detatil_card_left'>
            <div>{measurement?.examTitle}</div>
            <Button type="link" onClick={() => setIntroduceVisible(true)}>查看详情介绍&gt;</Button>
          </div>
          <div className='detatil_card_right'>
            <Progress
              className="detatil_card_progress"
              type="line"
              percent={parseFloat(measurement?.finishValue || '0')}
              format={(percent) => `完成度${percent}%`}
              strokeColor="#1890ff"
            />
            <div>覆盖人数:{measurement?.num}</div>
          </div>
        </div>
        <div className='detatil_card_bottom'>
          {measurement?.introduction}
        </div>
      </div>
      <div className='detatil_visualarea_layout'>
        <div className='detatil_visualarea_header'>
          <div className='detatil_visualarea_title'>报表</div>
          <div className='detatil_visualarea_right'>
            <span className='detatil_visualarea_text'>部门</span>
            <Select
              style={{ width: 200 }}
              placeholder="全部"
              filterOption={false}
              labelInValue
              showSearch
              notFoundContent={fetching ? <Spin /> : <Empty />}
              onSearch={debounceFetcher}
              defaultActiveFirstOption={false}
              options={department}
              allowClear
              onClear={() => setDeptId(undefined)}
              onSelect={(value: any) => {
                setDeptId(value.key);
              }}
            />
          </div>
        </div>
        <div className='detatil_visualarea_content'>
          <div className='detatil_visualarea_title'>
            <p>测评完成率</p>
            <div ref={(el) => completionRef.current[0] = el} />
            <span>覆盖人数: {chartList?.totalNum}人  完成认识: {chartList?.finishNum}人</span>
          </div>
          <div className='detatil_visualarea_title'>
            <p>人格分布占比</p>
            <div ref={(el) => completionRef.current[1] = el} />
          </div>
          <div className='detatil_visualarea_title'>
            <p>性格标签分布</p>
            <div ref={(el) => completionRef.current[2] = el} />
          </div>
        </div>
      </div>
      <div className='detatil_table_layout'>
        <div className='detatil_table_title'>测评详情</div>
        {/* <div className='detatil_table_operation'>
          <div className='detatil_table_left'>
            <span className='detatil_table_name'>姓名</span>
            <Input.Search
              placeholder="请输入"
              allowClear
              loading={nameSearchLoading}
              enterButton="查询"
              size="large"
              onSearch={onSearch}
            />
          </div>
          <div className='detatil_table_right' onClick={onDeriveClick}>导出</div>
        </div> */}
      </div>
      <ProTable<ExamUser>
        search={false}
        options={false}
        columns={columns}
        rowKey="id"
        dataSource={examUsers?.resultList}
        pagination={{
          showSizeChanger: true,
          pageSize: 20,
          current: locat.query.current || 1,
          onChange: (e) => {
            history.push(`/exam/${id}?type=${locat.query.type}&current=${e}`)
          }
        }}
      />
      <Drawer
        visible={introduceVisible}
        onClose={() => setIntroduceVisible(false)}
        placement="right"
        title="测评介绍"
        closable={false}
        destroyOnClose={true}
      >
        <div>
          {/* <img src="" alt="" /> */}
          1111
        </div>
      </Drawer>
    </PageContainer>
  );
};

export default ExamDetail;
