import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { useParams, useLocation, useHistory, } from 'umi';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Col, message, Progress, Modal, Row, Space, Typography, Breadcrumb, Button, Select, Input, Drawer, Empty, Spin } from 'antd';
import { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ExamReport from '../../../components/Result/report';
import { getExamUsers, getChart, queryDept, getAllInfo, measurementExport } from '@/services/api';
import { Liquid, Column, Treemap } from '@antv/g2plot';
import debounce from 'lodash/debounce';
import queryString from 'query-string';
import './index.less';
import { FullscreenOutlined } from '@ant-design/icons';

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
  const [searchName, setSearchName] = useState<string>(); // 搜索的name
  const [searchComplete, setSearchComplete] = useState<any>(); // 搜索的完成情况
  const [nameSearchLoading, setNameSearchLoading] = useState<boolean>(false); // 名字搜索的loading
  const [isModalVisible, setIsModalVisible] = useState(false); // 性格点击弹窗
  const [resultSearch, setResultSearch] = useState<string>(); // 人格搜索
  const [characterSearch, setCharacterSearch] = useState<string[]>([]); // 性格搜索
  const isModalRef: any = useRef()
  const visualRef: any = useRef([])
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
      // key: 'id',
      title: '序号',
      valueType: 'index',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
    },
    {
      dataIndex: 'name',
      title: '姓名',
      width: 80,
      fixed: 'left',
    },
    {
      title: '部门',
      dataIndex: 'deptAggregationDTOS',
      width: 120,
      render: (dom, entity) => {
        const mo = entity.deptAggregationDTOS.map((item) => item.name)
        return <span className='personalityType'>{mo.join(',')}</span>;
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 50,
      valueEnum: {
        0: '未设置',
        1: '男',
        2: '女',
      },
    },
    {
      title: '人格类型',
      width: 100,
      dataIndex: 'resultType',
    },
    {
      title: '性格类型',
      width: 140,
      dataIndex: 'tags',
      render: (dom, entity) => {
        return <span className='personalityType'>{entity?.tags?.join(',')}</span>;
      },
    },

    {
      title: '测评时间',
      width: 140,
      dataIndex: 'startTime',
    },
    {
      title: '是否在职',
      width: 100,
      dataIndex: 'isDimission',
      valueEnum: {
        0: '在职',
        1: '离职',
      },
    },
    {
      title: '测评报告',
      key: 'report',
      width: 100,
      valueType: 'option',
      fixed: 'right',
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
  const getTableList = (params: any) => {
    const { name, deptId, status, curPage = 1, pageSize = 20, resultType, tags } = params
    const selectVal = (status && status.length > 0 && searchComplete!.split(',').map(Number)) || ''
    const obj = { examid: id, name, status: selectVal, deptId, curPage, pageSize, resultType, tags };
    (!obj.name || obj.name == '') && delete obj.name;
    (!obj.status || obj.status == '') && delete obj.status;
    (!obj.deptId) && delete obj.deptId;
    (!obj.resultType || obj.resultType == '') && delete obj.resultType;
    (!obj.tags || obj.tags.length > 1) && delete obj.tags;
    getExamUsers(obj).then((res) => {
      if (res.code === 1) {
        setExamUsers(res.data);
        setNameSearchLoading(false)
      }
    });
  }
  useEffect(() => {
    getChart({ tpf: 1, appId, corpId, userId, examId: id, deptId }).then(res => {
      if (res.code === 1) {
        setChartList(res.data);
      }
    })
    getTableList({ name: searchName, deptId, status: searchComplete, resultType: resultSearch, tags: characterSearch })
  }, [deptId])
  useEffect(() => {
    if (!id) {
      message.error('缺少必要参数');
      return;
    }
    getAllInfo(id).then(res => {
      if (res.code === 1) {
        setMeasurement(res.data)
      }
    })
    debounceFetcher('')
  }, [id]);
  useEffect(() => {
    if (visualRef?.current && visualRef?.current?.length > 0) {
      visualRef.current[0].innerHTML = '';
      visualRef.current[1].innerHTML = '';
      visualRef.current[2].innerHTML = '';
      completionList(visualRef.current[0]).render()
      personalityList(visualRef.current[1]).render()
      characterList(visualRef.current[2], 430, 300).render()
    }
  }, [examUsers, chartList])
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
  useEffect(() => {
    if (isModalRef.current) {
      isModalRef.current.innerHTML = '';
      characterList(isModalRef.current).render()
    }
  }, [isModalVisible])
  if (!examUsers) {
    return <PageLoading />;
  }
  // 测评完成率
  const completionList = (node1: HTMLElement) => {
    const liquidPlot = new Liquid(node1, {
      percent: chartList?.finishDegree && chartList?.finishDegree / 100 || 0,
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
    // liquidPlot.render();
    return liquidPlot
  }
  // 人格分布占比
  const personalityList = (node2: HTMLElement) => {
    const maxNum = chartList?.personalityProportions && Math.max(...chartList?.personalityProportions.map((res: any) => res.value))
    const columnPlot = new Column(node2, {
      width: 400,
      height: 300,
      data: chartList?.personalityProportions || [],
      xField: 'name',
      yField: 'value',
      color: '#fe7345',
      autoFit: true,
      appendPadding: [20, 0, 0, 0],
      columnWidthRatio: 0.3,
      label: {
        position: 'top',
        content: (xValue) => {
          return `${xValue.value}人`
        }
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
        top: true
      },
      yAxis: {
        min: 0,
        tickCount: maxNum < 5 ? maxNum + 1 : 6,
      },
      meta: {
        value: {
          alias: '人格占比',
          formatter: (text: string) => {
            return `${text}人`
          },
        },
      },
    });
    columnPlot.on('element:click', (ev: any) => {
      getTableList({ name: searchName, deptId, status: searchComplete, resultType: ev.data.data.name, tags: characterSearch })
      setResultSearch(ev.data.data.name)
    })
    // columnPlot.render();
    return columnPlot
  }
  // 性格图表
  const characterList = (node3: HTMLElement, width?: number, height?: number) => {
    // let list = []
    // let last = []
    // let num = 0;
    // let data = {}
    // if (chartList?.characterProportions) {
    //   if (chartList?.characterProportions.length > 20) {
    //     list = chartList?.characterProportions && chartList?.characterProportions.slice(0, 19)
    //     last = chartList?.characterProportions && chartList?.characterProportions.slice(19, chartList?.characterProportions.length)
    //     num = last && last.reduce((a: any, b: any) => a + b.value, 0)
    //     data = {
    //       name: 'root',
    //       children: (list && [...list, { name: '其他', value: num }]) || []
    //     }
    //   } else {
    //     data = {
    //       name: 'root',
    //       children: chartList?.characterProportions || []
    //     }
    //   }
    // }
    const data = {
      name: 'root',
      children: chartList?.characterProportions || []
    }
    const treemapPlot = new Treemap(node3, {
      data,
      colorField: 'name',
      autoFit: true,
      width,
      height,
      label: {
        content: (xValue) => {
          return `${xValue.name}-${xValue.value}人`
        },
      },
      tooltip: {
        formatter: (datum: any) => {
          return { name: datum.name, value: datum.value + '人' };
        },
      }
    });
    treemapPlot.on('element:click', (ev: any) => {
      getTableList({ name: searchName, deptId, status: searchComplete, resultType: resultSearch, tags: [ev.data.data.name] })
      setCharacterSearch([ev.data.data.name]);
    })
    // treemapPlot.render();
    return treemapPlot
  }
  // 表格名称搜索
  const onSearch = (e: any) => {
    setSearchName(e?.target?.value)
  }
  // 导出
  const onDeriveClick = () => {
    measurementExport(id).then((res: any) => {
      if (res.code == 1) {
        let a = document.createElement('a')
        a.href = `${location.protocol}//${res.data.bucket}.${res.data.endpoint}/${res.data.path}`
        a.download = res.data.cname
        a.click()
      }
    })
  }
  // 搜索
  const onSearchClick = () => {
    setNameSearchLoading(true)
    getTableList({ name: searchName, deptId, status: searchComplete, resultType: resultSearch, tags: characterSearch })
  }
  // 重置
  const onResetClick = () => {
    setSearchName('')
    getTableList({ deptId })
    setSearchComplete(null)
    setResultSearch(undefined)
    setCharacterSearch([])
  }
  // 选择框的onchange
  const handleChange = (e: string) => {
    setSearchComplete(e)
  }
  // 人格选中时的回调
  const onResultSelect = (e: string) => {
    setResultSearch(e)
  }
  // 标签选中时的回调
  const onCharacterSelect = (e: string) => {
    setCharacterSearch([e])
  }
  // 清除回调
  const handelClear = async (num: number) => {
    // 1完成情况  2人格类型 3性格类型
    const obj = {
      name: searchName,
      deptId,
      status: num == 1 ? null : searchComplete,
      resultType: num == 2 ? undefined : resultSearch,
      tags: num == 3 ? [] : characterSearch
    }
    if (num == 1) {
      setSearchComplete(null)
    } else if (num == 2) {
      setResultSearch(undefined)
    } else if (num == 3) {
      setCharacterSearch([])
    }
    await getTableList(obj)
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
          <div className='detatil_visualarea_titlebao'>报表</div>
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
                setSearchName('')
                setSearchComplete(null)
              }}
            />
          </div>
        </div>
        <div className='detatil_visualarea_content'>
          <div className='detatil_visualarea_title'>
            <p>测评完成率</p>
            <div ref={(el) => visualRef.current[0] = el} />
            <span>覆盖人数: <div>{chartList?.totalNum || 0}</div>人 &ensp;&ensp;&ensp;   完成人数: <div>{chartList?.finishNum || 0}</div>人</span>
          </div>
          <div className='detatil_visualarea_title'>
            <p>人格分布占比</p>
            <div ref={(el) => visualRef.current[1] = el} />
          </div>
          <div className='detatil_visualarea_title'>
            <p className='theLabel'>性格标签分布</p>
            <div className='characterWrapper'>
              <FullscreenOutlined className='Fullscreen' onClick={() => setIsModalVisible(true)} />
              <div ref={(el) => visualRef.current[2] = el} />
            </div>
          </div>
        </div>
      </div>
      <div className='detatil_table_layout'>
        <div className='detatil_table_title'>测评详情</div>
        <div className='detatil_table_operation'>
          <div className='detatil_table_leftWrapper'>
            <div className='detatil_table_left'>
              <span className='detatil_table_name'>姓名:</span>
              <Input
                placeholder="请输入"
                value={searchName}
                onChange={onSearch}
                style={{ width: 180 }}
              />
            </div>
            <div className='detatil_table_left'>
              <span className='detatil_table_name'>完成情况:</span>
              <Select onClear={() => handelClear(1)} allowClear placeholder="请选择" style={{ width: 180 }} value={searchComplete} onChange={handleChange}>
                <Select.Option value='10'>已完成</Select.Option>
                <Select.Option value='0, 1, 2, 3'>未完成</Select.Option>
              </Select>
            </div>
            <div className='detatil_table_left'>
              <span className='detatil_table_name'>人格类型:</span>
              <Select onClear={() => handelClear(2)} allowClear placeholder="请选择" style={{ width: 180 }} value={resultSearch} onSelect={onResultSelect}>
                {
                  chartList?.personalityProportions?.map((res: any) => <Select.Option key={res.name} value={res.name}>{res.name}</Select.Option>)
                }
              </Select>
            </div>
            <div className='detatil_table_left'>
              <span className='detatil_table_name'>性格类型:</span>
              <Select onClear={() => handelClear(3)} allowClear placeholder="请选择" style={{ width: 180 }} value={characterSearch} onSelect={onCharacterSelect}>
                {
                  chartList?.characterProportions?.map((res: any) => <Select.Option key={res.name} value={res.name}>{res.name}</Select.Option>)
                }
              </Select>
            </div>
          </div>
          <div className='detatil_table_right'>
            <Button onClick={onSearchClick} loading={nameSearchLoading} type="primary" >搜索</Button>
            <Button onClick={onResetClick} style={{ margin: '0 25px' }}>重置</Button>
            <div className='detatil_table_right_export' onClick={onDeriveClick}>导出</div>
          </div>
        </div>
      </div>
      <ProTable
        search={false}
        options={false}
        columns={columns}
        rowKey="examPaperId"
        dataSource={examUsers?.resultList}
        scroll={{ x: 900 }}
        pagination={{
          showSizeChanger: true,
          current: examUsers.curPage,
          total: examUsers.totalItem,
          onChange: (pageNo, pageSize) => {
            getTableList({ name: searchName, deptId, curPage: pageNo, pageSize, status: searchComplete, resultType: resultSearch, tags: characterSearch })
            // history.push(`/exam/${id}?type=${locat.query.type}&current=${pageNo}`)
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
        width="390px"
      >
        <img className='introduce_img' src={measurement?.introductionImage?.admin} alt="" />
      </Drawer>
      <Modal footer={null} width={'95%'} visible={isModalVisible} onCancel={() => setIsModalVisible(false)}>
        <div style={{ padding: '20px 0' }}>
          <div ref={isModalRef} />
        </div>
      </Modal>
    </PageContainer>
  );
};

export default ExamDetail;
