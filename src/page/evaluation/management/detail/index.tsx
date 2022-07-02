import { getAllInfo, getChart, getExamUsers, measurementExport, queryDept } from '@/api/api'
import { Breadcrumb, Button, Empty, Form, Input, Select, Spin, Table } from 'antd'
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.module.less'
import { useParams } from 'react-router'
import { debounce, randomRgbaColor, randomRgbColor } from '@/utils/utils'
import { Liquid, Pie } from '@antv/g2plot';
import { useSearchParams } from 'react-router-dom'
import { IOption, IChartList, characterProportions, ITableParams, IResultTable, ISex, IisDimission, IFromName, IDepartment, IResultList } from '../type'
import { ColumnsType } from 'antd/lib/table'
import { LockOutlined } from '@ant-design/icons'
import LookResult from '@/components/lookResult'
import LookIntroduce from './lookintroduce'
import Loading from '@/components/loading'

const Detail = () => {
  const params = useParams() as { id: string }
  const [search, setSearch] = useSearchParams()
  const [userId, setUserId] = useState<string>();
  const [measurement, setMeasurement] = useState<IMeasurement>(); //测评信息
  const [department, setDepartment] = useState<IOption[]>([]); // 部门option
  const [chartList, setChartList] = useState<IChartList>() // 图表数据
  const [fetching, setFetching] = useState(false);// 是否有数据
  const [deptId, setDeptId] = useState<string>(); // 选中的部门deptId
  const [tableList, setTableList] = useState<IResultTable>() // 表格数据
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [form] = Form.useForm();
  const corpId = search.get('corpId') || '0'
  const appId = search.get('appId') || '0'
  const fetchRef = useRef(0);
  const visualRef: any = useRef([])
  const lookResultRef: any = useRef();
  const lookIntroduceRef: any = useRef();
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
  useEffect(() => {
    getDetailList()
    getDepartment()
    getAppraisalInfo()
  }, [])
  useEffect(() => {
    if (visualRef?.current && visualRef?.current?.length > 0) {
      visualRef.current[0].innerHTML = '';
      visualRef.current[1].innerHTML = '';
      completionList(visualRef.current[0]).render()
      personalityList(visualRef.current[1]).render()
    }
  }, [chartList])
  // 获取列表
  const getDetailList = async (from?: IFromName) => {
    // 获取图表数据
    const item = await getChart({ tpf: 1, appId, corpId, userId, examId: params.id || '0', deptId })
    if (item.code === 1) {
      setChartList(item.data);
    }
    getTableList(from)
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
    getDetailList(form.getFieldsValue())
  }
  // 获取表格数据
  const getTableList = async (item?: ITableParams) => {
    const obj = { examid: params.id, curPage: 1, pageSize: 20, ...item, status: item?.status?.split(',').map(Number) }
    !item?.status && delete obj.status
    const res: IBackResult = await getExamUsers(obj)
    if (res.code === 1) {
      setTableList(res.data)
      setTableLoading(false)
    }
  }
  // 测评完成率
  const completionList = (node1: HTMLElement) => {
    const liquidPlot = new Liquid(node1, {
      percent: (Number(chartList?.finishDegree) || 0) / 100,
      height: 120,
      width: 120,
      outline: {
        border: 2,
        style: {
          stroke: '#F1F7FF',
          strokeOpacity: 0.5
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
    return liquidPlot
  }
  // 人格占比图
  const personalityList = (node2: HTMLElement) => {
    const piePlot = new Pie(node2, {
      height: 110,
      width: 200,
      data: chartList?.personalityProportions || [],
      angleField: 'value',
      colorField: 'name',
      radius: 1,
      innerRadius: 0.6,
      pieStyle: {
        lineWidth: 7,
      },
      label: false,
      tooltip: false,
      meta: {
        value: {
          formatter: (v: any) => `${(v / (chartList?.personalityProportions?.length || 0) || 0) * 100}%`,
        },
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
    return piePlot
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
    const res = await measurementExport(params.id)
    if (res.code == 1) {
      let a = document.createElement('a')
      a.href = `${location.protocol}//${res.data.bucket}.${res.data.endpoint}/${res.data.path}`
      a.download = res.data.cname
      a.click()
    }
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
      render: (text: number) => ISex[text]
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
      render: (text: number, record) => {
        const onLookResult = () => {
          const cur = lookResultRef as any;
          cur.current.onOpenDrawer(record)
        }
        const getText = (key: number) => {
          switch (key) {
            case 0:
              return <Button type='text' disabled>未参加测评</Button>
            case 1 | 2 | 3:
              return <Button type='text' disabled>测评中</Button>
            case 4:
              return <Button type="link">点券不足，充值后解锁查看</Button>
            case 5:
              return <Button icon={<LockOutlined />} type="link">解锁查看</Button>
            case 10:
              return <Button type="link" onClick={onLookResult}>查看报告</Button>
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
          <Breadcrumb.Item href="#/evaluation/management">测评管理</Breadcrumb.Item>
          <Breadcrumb.Item>测评详情</Breadcrumb.Item>
        </Breadcrumb>
      </header>
      <div className={styles.detail_wrapper}>
        <nav>
          <div className={styles.detail_titleCard}>
            <img src={"https://img2.baidu.com/it/u=3684117954,695988885&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1656176400&t=5667b2e2f36e2ac46fca03f78d08bc16"} alt="" />
            <div className={styles.detail_right}>
              <div className={styles.detail_top}>
                <div className={styles.detail_title}>
                  <p>{measurement?.examTitle}</p>
                  <span>{measurement?.examTemplateType}</span>
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
              placeholder="请选择"
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
              <p>性格标签分布</p>
              <div className={styles.detail_distribution_wrapper}>
                {
                  chartList?.characterProportions.map((item: characterProportions) => {
                    const num = randomRgbColor()
                    const color = `rgb(${num},1)`
                    const bgColor = `rgb(${num},0.2)`
                    return (
                      <div key={item.name} className={styles.detail_distribution_tag} style={{ color, backgroundColor: bgColor }}>{item.name}  x{item.value}</div>
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
                  <Select placeholder="请选择" style={{ width: 240 }}>{backFilterEle(chartList?.personalityProportions as characterProportions[])}</Select>
                </Form.Item>
                <Form.Item label="人格类型" name="resultType">
                  <Select placeholder="请选择" style={{ width: 240 }}>{backFilterEle(chartList?.characterProportions as characterProportions[])}</Select>
                </Form.Item>
              </Form>
            </div>
            <div className={styles.detail_main_filter_right}>
              <Button onClick={onResetClick}>重置</Button>
              <Button type="primary" onClick={onSearchClick}>搜索</Button>
            </div>
          </div>
          <div className={styles.detail_main_table}>
            <Button type="primary" onClick={onDeriveClick}>导出</Button>
            <Table scroll={{ x: 1500 }} loading={tableLoading} rowKey={(row) => row.userId} columns={columns} dataSource={tableList?.resultList} pagination={false} />
          </div>
        </main>
      </div>
      <LookResult ref={lookResultRef} />
      <LookIntroduce ref={lookIntroduceRef} />
    </div>
  )
}

export default Detail