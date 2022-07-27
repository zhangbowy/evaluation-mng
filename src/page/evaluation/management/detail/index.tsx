import { getAllInfo, getChart, getExamResult, getExamUsers, measurementExport, queryDept, UnLockReport } from '@/api/api'
import { Breadcrumb, Button, Divider, Empty, Form, Input, Select, Spin, Table, Tag } from 'antd'
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.module.less'
import { useNavigate, useParams } from 'react-router'
import { debounce, getAllUrlParam, randomRgbaColor, randomRgbColor } from '@/utils/utils'
import { Liquid, Pie } from '@antv/g2plot';
import { useSearchParams } from 'react-router-dom'
import { IOption, IChartList, characterProportions, IEvaluation, ITableParams, IResultTable, ISex, IisDimission, IFromName, IDepartment, IResultList } from '../type'
import { ColumnsType } from 'antd/lib/table'
import { LockOutlined } from '@ant-design/icons'
import LookResult from '@/components/lookResult'
import LookIntroduce from './lookintroduce'
import Loading from '@/components/loading'
import { FullscreenOutlined } from '@ant-design/icons';
import LookAllTags from './lookAllTags'
import { abilityList, TagSort } from '@/components/report/MBTI/type'
import { sortBy } from '@antv/util';
import { useCallbackState } from '@/utils/hook'

const Detail = () => {
  const navigator = useNavigate()
  const params = useParams() as { id: string }
  const [measurement, setMeasurement] = useState<IMeasurement>(); //测评信息
  const [department, setDepartment] = useState<IOption[]>([]); // 部门option
  const [chartList, setChartList] = useState<IChartList>() // 图表数据
  const [deptId, setDeptId] = useState<string>(); // 选中的部门deptId
  const [tableList, setTableList] = useState<IResultTable>() // 表格数据
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [downLoading, setDownLoading] = useState<number>(); // 下载的loading
  const [exportLoading, setExportLoading] = useState<boolean>(false) // 导出loading
  const [totalNum, setTotalNum] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10) // 多少条
  const [unlockLoading, setUnlockLoading] = useState<boolean[]>([]);
  const [unlockFail, setUnlockFail] = useState<boolean[]>([]);
  const [resultDetial, setResultDetial] = useCallbackState({});
  const [form] = Form.useForm();
  const { corpId, appId } = getAllUrlParam()
  const visualRef: any = useRef([])
  const lookResultRef: any = useRef();
  const lookIntroduceRef: any = useRef();
  const lookAllTagsRef: any = useRef()
  const pdfDetail: any = useRef();

  // 完成情况select
  const doneCondition: characterProportions[] = [
    {
      name: '完成',
      value: '10',
    },
    {
      name: '未完成',
      value: '0, 1, 2, 3',
    },
  ]
  const tagsColor = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ]
  useEffect(() => {
    getDetailList()
    getDepartment()
    getAppraisalInfo()
  }, [])
  const paginationObj = {
    showQuickJumper: true,
    defaultPageSize: 10,
    total: totalNum,
    current: current,
    showTotal: () => `共 ${totalNum} 条数据`,
    onChange: (page: number, pageSize: number) => {
      getTableList({ curPage: page, pageSize, ...form.getFieldsValue() })
    }
  }
  useEffect(() => {
    if (visualRef?.current?.length > 0) {
      visualRef.current[0].innerHTML = '';
      visualRef.current[1].innerHTML = '';
      completionList()
      personalityList()
    }
  }, [tableList])
  // 获取列表
  const getDetailList = async (from?: IFromName) => {
    // 获取图表数据
    const item = await getChart({ tpf: 1, appId, corpId, examId: params.id || '0', deptId: from?.deptId || deptId })
    if (item.code === 1) {
      setChartList(item.data);
    }
    getTableList({ ...from, curPage: current, pageSize })
  }
  // 获取测评信息
  const getAppraisalInfo = async () => {
    const res = await getAllInfo(params.id)
    if (res.code == 1) {
      setMeasurement(res.data)
    }
  }
  // 获取部门
  const getDepartment = async () => {
    const res = await queryDept({ corpId, appId })
    if (res.code == 1) {
      setDepartment(res.data.resultList)
    }
  }
  // 选中部门
  const onSelectChange = (value: string) => {
    setDeptId(value)
    getDetailList({ ...form.getFieldsValue(), deptId: value })
  }
  // 获取表格数据
  const getTableList = async (item?: ITableParams) => {
    const obj = {
      examid: params.id,
      curPage: item?.curPage || 1,
      pageSize: item?.pageSize || pageSize,
      ...item,
      status: item?.status?.split(',').map(Number)
    }
    !item?.status && delete obj.status
    const res: IBackResult = await getExamUsers(obj)
    if (res.code === 1) {
      setTableList(res.data)
      setTableLoading(false)
      setPageSize(res.data.pageSize)
      setTotalNum(res.data.totalItem)
      setCurrent(res.data.curPage)
    }
  }
  // 测评完成率
  const completionList = () => {
    const liquidPlot = new Liquid(visualRef.current[0], {
      percent: (Number(chartList?.finishDegree) || 0) / 100,
      height: 120,
      width: 120,
      outline: {
        border: 2,
        style: {
          stroke: '#F1F7FF',
          // strokeOpacity: 0.9
        },
        distance: 4,
      },
      statistic: {
        content: {
          customHtml: (container, view, { percent }: any) => {
            const text = `${(percent * 100).toFixed(0)}%`;
            return `<div style="font-size:14px;color: #464C5B;font-weight: 500;">${text}</div>`
          }
        }
      },
      wave: {
        length: 192,
      },
    });
    liquidPlot.render()
  }
  // 人格占比图
  const personalityList = () => {
    const piePlot = new Pie(visualRef.current[1], {
      height: 110,
      width: 330,
      data: chartList?.personalityProportions || [],
      angleField: 'value',
      colorField: 'name',
      radius: 1,
      innerRadius: 0.6,
      pieStyle: {
        lineWidth: 7,
      },
      label: false,
      meta: {
        value: {
          formatter: (v: any) => {
            return `${v || 0}人`
            // return `${((chartList?.personalityProportions?.length || 0) / v) * 100}%`
          },
        },
      },
      legend: {
        offsetX: -50,
        itemName: {
          formatter: (text, item) => {
            return text;
          },
          style: () => {

          }
        },
        // itemValue: {
        //   formatter: (text, item) => {
        //     return ``;
        //   },
        //   style: {
        //     fontSize: 12
        //   },
        // },
      },
      statistic: {
        title: false,
        content: {
          style: {
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '14px',
          },
        },
      },
    })
    piePlot.on('element:click', (ev: any) => {
      getTableList({ resultType: ev.data.data.name })
    })
    piePlot.render()
  }
  // 下拉筛选
  const backFilterEle = (arr: characterProportions[] = [], type?: number) => {
    return arr.map((res: characterProportions) => <Select.Option key={res.name} value={type ? res.value : res.name}>{res.name}</Select.Option>)
  }
  // 搜索
  const onSearchClick = () => {
    getTableList(form.getFieldsValue())
  }
  // 重置
  const onResetClick = () => {
    form.resetFields()
    getTableList()
  }
  // 查看介绍
  const onLookIntroduceClick = () => {
    lookIntroduceRef.current.onOpenDrawerClick(measurement)
  }
  // 导出
  const onDeriveClick = async () => {
    setExportLoading(true)
    const res = await measurementExport(params.id)
    if (res.code == 1) {
      let a = document.createElement('a')
      a.href = `${location.protocol}//${res.data.bucket}.${res.data.endpoint}/${res.data.path}`
      a.download = res.data.cname
      a.click()
      setExportLoading(false)
    }
  }
  // 查看所有tags
  const onMagnifyClick = () => {
    lookAllTagsRef?.current?.openModal(chartList?.characterProportions)
  }
  // tag点击
  const onTagClick = (name: string) => {
    getTableList({ tags: name })
  }
  const columns: ColumnsType<IResultList> = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 70,
      fixed: 'left',
      render: (text, record, index) => `${index + 1}`
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 80,
      fixed: 'left',
    },
    {
      title: '部门',
      width: 150,
      dataIndex: 'deptAggregationDTOS',
      render: (text: IDepartment[]) => {
        const nameArr = text.map(res => res.name)
        const department = nameArr.join(',')
        return <span>{department}</span>
      }
    },
    {
      title: '性别',
      width: 70,
      dataIndex: 'sex',
      render: (text: number) => ISex[text] || '-'
    },
    {
      title: '人格类型',
      dataIndex: 'resultType',
      width: 170,
      render: (text: string) => text || '-'
    },
    {
      title: '性格类型',
      dataIndex: 'tags',
      width: 230,
      render: (text: string[]) => {
        const tags: string[] = JSON.parse(JSON.stringify(text))
        const tagsArr = tags.length > 3 ? tags.splice(0, 3) : tags
        return (
          <div className={styles.table_list_tags}>
            {tagsArr.length > 0 ? tagsArr?.map(res => (<span key={res}>{res}</span>)) : '-'}
            {text.length > 3 && <div>...</div>}
          </div>
        )
      }
    },
    {
      title: '测评时间',
      width: 200,
      dataIndex: 'startTime',
      render: (text: string) => text || '-'
    },
    {
      title: '是否在职',
      width: 120,
      dataIndex: 'isDimission',
      render: (text: number) => IisDimission[text] || '-'
    },
    {
      title: '测评报告',
      dataIndex: 'status',
      fixed: 'right',
      width: 220,
      render: (text: number, record, index: number) => {
        // 查看报告
        const onLookResult = () => {
          if (measurement?.examTemplateType === 'MBTI') {
            navigator(`/evaluation/management/detail/${params.id}/lookReport/${record.examPaperId}~${record.userId}`);
            return;
          }
          const cur = lookResultRef as any;
          cur.current.onOpenDrawer(record)
        }
        // 解锁查看
        const onUnlockClick = async () => {
          unlockLoading[index] = true
          setUnlockLoading([...unlockLoading])
          const params = {
            userId: record.userId,
            templateType: measurement?.examTemplateType as string,
            operationType: '1',
            examId: record.examId
          }
          const res = await UnLockReport(params)
          if (res.code == 1) {
            getDetailList()
          } else {
            unlockFail[index] = true
            setUnlockFail([...unlockFail])
          }
        }
        const onDownLoad = async () => {
          setDownLoading(record.examPaperId);
          const res = await getExamResult({ examPaperId: record.examPaperId, userId: record.userId, major: true })
          if (res.code === 1) {
            const newData = { ...res.data };
            if (res.data.results) {
              const { htmlDesc } = newData;
              const newDimensional = {};
              htmlDesc?.dimensional.forEach((item: any) => {
                Object.assign(newDimensional, {
                  [item.tag]: item,
                });
              });
              const newList = abilityList.map((item: any) => {
                if (htmlDesc?.ability) {
                  return {
                    ...item,
                    sort: (TagSort as any)[htmlDesc?.ability?.[item.name]]
                  }
                }
              });
              sortBy(newList, function (item: any) { return item.sort });

              Object.assign(newData, {
                resultType: res.data.results[0].type,
                examTemplateArr: res.data.results[0].type.split(''),
                htmlDesc: {
                  ...htmlDesc,
                  dimensional: newDimensional,
                  abilityList: newList,
                }
              })
            }
            setResultDetial(newData, () => {
              pdfDetail.current.exportPDF(() => {
                setDownLoading(0);
              });
            });
          }
        }

        const getText = (key: number) => {
          switch (key) {
            case 0:
              return <Button type='text' disabled>未参加测评</Button>
            case 1 || 2 || 3:
              return <Button type='text' disabled>测评中</Button>
            case 5:
              return <Button loading={unlockLoading[index] && !unlockFail[index]} icon={!unlockFail[index] && <LockOutlined />}
                onClick={onUnlockClick} type="link">
                {unlockFail[index] ? '点券不足，充值后解锁查看' : unlockLoading[index] ? `解锁中` : '解锁查看'}</Button>
            case 10:
              return (
                <>
                  <Button type="link" onClick={onLookResult}>查看报告</Button>
                  {/* {
                    measurement?.examTemplateType === 'MBTI' &&
                    <>
                      <Divider type="vertical" />
                      <Button
                        type="link"
                        onClick={() => onDownLoad()}
                        loading={downLoading === record.examPaperId}>下载</Button>
                    </>
                  } */}
                </>
              )
            default:
              break;
          }
        }
        return (getText(text))
      }
    },
  ]
  if (tableLoading) {
    return <Loading />
  }
  return (
    <div className={styles.detail_layout}>
      <header>
        <Breadcrumb separator=">" className={styles.detail_nav}>
          <Breadcrumb.Item href="#/evaluation/management">盘点测评</Breadcrumb.Item>
          <Breadcrumb.Item>测评详情</Breadcrumb.Item>
        </Breadcrumb>
      </header>
      <div className={styles.detail_wrapper}>
        <nav>
          <div className={styles.detail_titleCard}>
            <img src={measurement?.planImage} alt="" />
            <div className={styles.detail_right}>
              <div className={styles.detail_top}>
                <div className={styles.detail_title}>
                  <p>{measurement?.examTitle}</p>
                  <span>{IEvaluation[measurement!.examTemplateType]}</span>
                </div>
                <Button type="link" onClick={onLookIntroduceClick}>查看介绍</Button>
              </div>
              <p className={styles.detail_bottom}>{measurement?.introduction}</p>
            </div>
          </div>
        </nav>
        <main>
          <div className={styles.detail_main_header}>
            <span className={styles.detail_main_title}>测评报表</span>
            <Select
              optionFilterProp="children"
              onChange={onSelectChange}
              filterOption={(input, option) =>
                (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
              placeholder="请选择部门"
              showSearch
              style={{ width: 240 }} >
              {
                department.map((item: IDept) => <Select.Option key={item.deptId} value={item.deptId}>{item.name}</Select.Option>)
              }
            </Select>
          </div>
          <div className={styles.detail_main_chart}>
            <div className={styles.detail_percentageComplete}>
              <p>测评完成率</p>
              <div className={styles.detail_percentageComplete_wrapper}>
                <div ref={(el) => visualRef.current[0] = el} />
                <div className={styles.detail_percentageComplete_info}>
                  <ul>覆盖人数<li>{chartList?.totalNum}</li></ul>
                  <ul>完成人数<li>{chartList?.finishNum}</li></ul>
                </div>
              </div>
            </div>
            <div className={styles.detail_proportion}>
              <p>人格分布占比</p>
              <div className={styles.detail_proportion_wrapper}>
                <div ref={(el) => visualRef.current[1] = el} />
              </div>
            </div>
            <div className={styles.detail_distribution}>
              <FullscreenOutlined onClick={onMagnifyClick} className={styles.detail_magnify} />
              <p>性格标签分布</p>
              <div className={styles.detail_distribution_wrapper}>
                {
                  chartList?.characterProportions.map((item: characterProportions) => {
                    const colorText = tagsColor[Math.floor(Math.random() * tagsColor.length)]
                    return (
                      <Tag className={styles.detail_distribution_tag} onClick={() => onTagClick(item.name)} color={colorText} key={item.name}>{item.name} x{item.value}</Tag>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className={styles.detail_main_filter}>
            <div className={styles.detail_main_filter_left}>
              <Form className={styles.from_layout} form={form}  >
                <Form.Item label="姓名" labelCol={{ span: 6 }} name="name">
                  <Input placeholder="请输入姓名" style={{ width: 240 }} />
                </Form.Item>
                <Form.Item label="完成情况" name="status">
                  <Select placeholder="请选择" style={{ width: 240 }}>{backFilterEle(doneCondition, 1)}</Select>
                </Form.Item>
                <Form.Item label="性格类型" name="tags">
                  <Select placeholder="请选择" style={{ width: 240 }}>{backFilterEle(chartList?.characterProportions as characterProportions[])}</Select>
                </Form.Item>
                <Form.Item label="人格类型" name="resultType">
                  <Select placeholder="请选择" style={{ width: 240 }}>{backFilterEle(chartList?.personalityProportions as characterProportions[])}</Select>
                </Form.Item>
              </Form>
            </div>
            <div className={styles.detail_main_filter_right}>
              <Button onClick={onResetClick}>重置</Button>
              <Button type="primary" onClick={onSearchClick}>搜索</Button>
            </div>
          </div>
          <div className={styles.detail_main_table}>
            <Button type="primary" loading={exportLoading} onClick={onDeriveClick}>导出</Button>
            <Table pagination={paginationObj} scroll={{ x: 1500, }} loading={tableLoading} rowKey={(row) => row.userId} columns={columns} dataSource={tableList?.resultList} />
          </div>
        </main>
      </div>
      <LookResult ref={lookResultRef} />
      <LookIntroduce ref={lookIntroduceRef} />
      <LookAllTags ref={lookAllTagsRef} onTagClick={onTagClick} />
    </div>
  )
}

export default Detail