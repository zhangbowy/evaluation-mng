import { getAllInfo, getChart, queryDept, } from '@/api/api'
import { Breadcrumb, Button, Select, Tabs, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import { useParams } from 'react-router-dom'
import { getAllUrlParam, } from '@/utils/utils'
import { IOption, IEvaluation, IFromName, } from '../type'
import LookResult from '@/components/lookResult'
import LookIntroduce from './lookintroduce'
import OverviewStatistics from './overviewStatistics';
import PeopleStatistics from './peopleStatistics'
import { observer } from 'mobx-react-lite'
import { EvalDetail, SearchData } from '@/store'

const Detail = observer(() => {
  const params = useParams() as { id: string }
  const { corpId, appId } = getAllUrlParam()
  const [measurement, setMeasurement] = useState<IMeasurement>(); //测评信息
  const [department, setDepartment] = useState<IOption[]>([]); // 部门option
  const [deptId, setDeptId] = useState<number>(); // 选中的部门deptId
  const lookResultRef: any = useRef();
  const peopleStatisticsRef: any = useRef();
  const lookIntroduceRef: any = useRef();
  const { TabPane } = Tabs;
  const [curTab, setCurTab] = useState<string>(SearchData.searchObj.curTab ?? '1')

  useEffect(() => {
    lookIntroduceRef
    getAppraisalInfo()
    getDetailList()
    getDepartment()
  }, [])
  // 获取列表
  const getDetailList = async (from?: IFromName) => {
    // 获取图表数据
    const item = await getChart({ tpf: 1, appId, corpId, examId: params.id || '0', deptId: from?.deptId || deptId })
    if (item.code === 1) {
      EvalDetail.setEvalDetailInfo(item.data)
      // EvalDetail.evalDetailInfo = item.data
    }
    // getTableList({ ...from, curPage: current, pageSize })
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
    const res = await queryDept({ corpId, appId, pageSize: 10000, curPage: 1 })
    if (res.code == 1) {
      setDepartment(res.data.resultList)
    }
  }
  // 选中部门
  const onSelectChange = (value: number) => {
    EvalDetail.setDepartmentId(value)
    getDetailList({ deptId: value })
    curTab != '1' && peopleStatisticsRef.current.getTableList({ deptId: value })
  }
  // 查看介绍
  const onLookIntroduceClick = () => {
    lookIntroduceRef.current.onOpenDrawerClick(measurement)
  }
  // tag点击
  const onTagClick = (name: string) => {
    // getTableList({ tags: name })
  }
  // tab点击
  const onTabChange = (key: string) => {
    setCurTab(key)
    SearchData.setSearchObj({ ...SearchData.searchObj, curTab: key })
  }
  const detailTab = [
    {
      id: 1,
      name: '概览统计',
      component: <OverviewStatistics chartList={EvalDetail.evalDetailInfo} onTabChange={onTabChange} type={measurement?.examTemplateType || ''} />
    },
    {
      id: 2,
      name: '人员统计',
      component: <PeopleStatistics ref={peopleStatisticsRef} chartList={EvalDetail.evalDetailInfo} type={measurement?.examTemplateType || ''} />
    }
  ]
  return (
    <div className={styles.detail_layout}>
      <header>
        <Breadcrumb separator=">" className={styles.detail_nav}>
          <Breadcrumb.Item href="#/evaluation/management">盘点测评</Breadcrumb.Item>
          <Breadcrumb.Item>测评详情</Breadcrumb.Item>
        </Breadcrumb>
        <Select
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          optionFilterProp="children"
          onChange={onSelectChange}
          filterOption={(input, option) =>
            (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
          }
          placeholder="请选择部门"
          showSearch
          allowClear
          style={{ width: 240 }} >
          {
            department.map((item: IDept) => <Select.Option key={item.deptId} value={item.deptId}>{item.name}</Select.Option>)
          }
        </Select>
      </header>
      <nav>
        <div className={styles.detail_titleCard}>
          <img src={measurement?.planImage} alt="" />
          <div className={styles.detail_right}>
            <div className={styles.detail_top}>
              <div className={styles.detail_title}>
                <Tooltip placement="top" title={measurement?.examTitle}>
                  <p>{measurement?.examTitle}</p>
                </Tooltip>
                <span>{IEvaluation[measurement?.examTemplateType || "MBTI"]}</span>
              </div>
              {measurement?.examTemplateType !== 'CPI' && <Button type="link" onClick={onLookIntroduceClick}>查看介绍</Button>}
            </div>
            <p className={styles.detail_bottom}>{measurement?.introduction}</p>
          </div>
        </div>
      </nav>
      <Tabs activeKey={curTab} className={styles.tabs} onChange={onTabChange}>
        {
          detailTab.map(res => (
            <TabPane key={res.id} tab={res.name}>
              {res.component}
            </TabPane>
          ))
        }
      </Tabs>
      <LookIntroduce ref={lookIntroduceRef} />
    </div>
  )
})

export default Detail