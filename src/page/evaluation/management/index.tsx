import { Button, Radio, RadioChangeEvent, Table, Progress, Switch, Divider, message, Tooltip, Modal } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import React, { Fragment, useEffect, useState } from 'react'
import styles from './index.module.less'
import { ColumnsType } from 'antd/lib/table';
import { getExamList, editExam, getAllPeople, queryExamUserIds, updateExam } from '@/api/api'
import * as dd from 'dingtalk-jsapi';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { ddAddPeople, getIsGuide } from '@/utils/utils'
import Loading from '@/components/loading';

const Management = () => {
  const logo = '//qzz-static.forwe.store/evaluation-mng/imgs/%E8%B6%A3%E6%B5%8B%E8%AF%84logo2.png'
  const defaultImg = '//qzz-static.forwe.store/evaluation-mng/imgs/qcc_mng_nodata.png'
  const options = [
    { label: '全部', value: '[]' },
    { label: '未完成', value: '[0, 1, 2, 3]' },
    { label: '已完成', value: '[10]' },
  ];
  const navigator = useNavigate()
  const [radioValue, setRadioValue] = useState('[]'); // 筛选
  const [evaluationList, setEvaluationList] = useState<DataType[]>([]);//  列表数据
  const [tableLoading, setTableLoading] = useState<boolean>(true);// tableLoading
  const [search] = useSearchParams();
  const corpId = search.get('corpId') || '0'
  const appId = search.get('appId') || '0'
  useEffect(() => {
    getEvaluationList()
  }, [])
  useEffect(() => {
    let timer:any;
    if (!tableLoading) {
      timer = setTimeout(() => {
        currentStep(evaluationList)
      }, 1000)
    }
    () => {
      clearTimeout(timer)
    }
  }, [tableLoading])
  // 引导步骤
  const currentStep = (arr: DataType[]) => {
    const stepsArr: StepsType[] = [{
      element: "#appraisal_Management",
      intro: "该模块主要用于查看测评量表的测试进度和各人员的测试结果",
      position: "bottom",
    }]
    if (arr.length > 0) {
      stepsArr.push({
        element: "#lookDetail0",
        intro: "点击查看测评数据分析",
        position: "bottom",
      }, {
        element: "#addPeople0",
        intro: "如有新人员需要参与测试，可直接在此添加",
        position: "bottom",
      })
    }
    getIsGuide(stepsArr, 2)
  }
  // 筛选
  const onRadioChange = ({ target: { value } }: RadioChangeEvent) => {
    setRadioValue(value);
  };
  // 列表
  const getEvaluationList = async (curPage: number = 1) => {
    const params = { curPage, pageSize: 20 }
    const res = await getExamList(params)
    if (res?.code == 1) {
      setEvaluationList(res.data.resultList)
      setTableLoading(false)
    }
  }
  // 开关
  const handleSwitch = async (checked: boolean, id: number) => {
    const res = await editExam({ type: checked, examId: id });
    if (res.code === 1) {
      message.success('修改成功');
      getEvaluationList();
    }
  }
  // 创建测评
  const createEvaluation = () => {
    navigator('/evaluation/management/library')
  }
  // 添加人员
  const onAddPeopleClick = async (item: DataType) => {
    const params = {
      id: item.id,
      appId,
      corpId,
      successFn: () => {
        message.success('修改成功');
        getEvaluationList();
      },
      failFn:()=>{}
    }
    ddAddPeople(params,'update')
  }
  const columns: ColumnsType<DataType> = [
    {
      dataIndex: 'createName',
      fixed: 'left',
      width: 340,
      render: (text: string, record: DataType) => {
        return (
          <div className={styles.create_userInfo}>
            <img src={logo} alt="" />
            <div className={styles.create_right}>
              <Tooltip placement="top" title={record.evaluationName}>
                <p>{record.evaluationName}</p>
              </Tooltip>
              <span>创建人:{record.createName || 'null'}    {record.created}</span>
            </div>
          </div>
        )
      }
    },
    {
      dataIndex: 'totalNumber',
      width: 130,
      render: (text: string) => {
        return (
          <div className={styles.create_right}>
            <p>{text}</p>
            <span>覆盖人数(人)</span>
          </div>
        )
      }
    },
    {
      dataIndex: 'finishNumber',
      width: 130,
      render: (text: string) => {
        return (
          <div className={styles.create_right}>
            <p>{text}</p>
            <span>完成人数(人)</span>
          </div>
        )
      }
    },
    {
      dataIndex: 'completion',
      width: 130,
      render: (text: string, record: DataType) => {
        return (
          <div className={styles.create_right}>
            <Progress percent={record.completion} size="small" />
            <span>完成率</span>
          </div>
        )
      }
    },
    {
      dataIndex: 'option',
      fixed: 'right',
      render: (text: string, record: DataType, index: number) => {
        const onLookDetail = () => {
          navigator(`/evaluation/management/detail/${record.id}`)
        }
        return (
          <div className={styles.create_option}>
            <Button type="link" onClick={onLookDetail} id={`lookDetail${index}`}>查看详情</Button>
            <Divider type="vertical" />
            <Button type="link" onClick={() => onAddPeopleClick(record)} id={`addPeople${index}`}>添加人员</Button>
            <Divider type="vertical" />
            <Switch unCheckedChildren='关' checked={record.type} onChange={(checked) => handleSwitch(checked, record.id)} checkedChildren='开' />
          </div>
        )
      }
    }
  ]
  if (tableLoading) {
    return <Loading />
  }
  return (
    <div className={styles.management_layout}>
      {
        !tableLoading && (evaluationList.length > 0 ?
          <Fragment>
            <header>
              <h1 id='appraisal_Management'>测评管理</h1>
              <div>
                <Radio.Group className={styles.management_radio} options={options} onChange={onRadioChange} value={radioValue} optionType="button" />
                <Button type="primary" onClick={createEvaluation} icon={<PlusCircleOutlined />} size="large">
                  创建测评
                </Button>
              </div>
            </header>
            <Table loading={tableLoading} rowKey={(row) => row.id} showHeader={false} columns={columns} scroll={{ y: 450 }} pagination={{ showQuickJumper: true, defaultPageSize: 10 }} dataSource={evaluationList}></Table>
          </Fragment>
          :
          <div className={styles.management_defaultPage}>
            <img src={defaultImg} alt="" />
            <p>暂无测评，点击下方按钮去创建试试吧</p>
            <Button type="primary" onClick={createEvaluation} icon={<PlusCircleOutlined />} size="large">
              创建测评
            </Button>
          </div>)
      }
    </div>
  )
}

export default Management
