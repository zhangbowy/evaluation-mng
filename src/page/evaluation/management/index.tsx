import { Button, Radio, RadioChangeEvent, Table, Progress, Switch, Divider, message, Tooltip, Modal, ConfigProvider, Tag } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import React, { Fragment, useContext, useEffect, useState } from 'react'
import styles from './index.module.less'
import { ColumnsType } from 'antd/lib/table';
import { getExamList, editExam, getAllPeople, queryExamUserIds, updateExam } from '@/api/api'
import * as dd from 'dingtalk-jsapi';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { ddAddPeople, getIsGuide, getAllUrlParam } from '@/utils/utils'
import Loading from '@/components/loading';
import { IOptions, IExamListParams } from './type'
import { CountContext } from '@/utils/context';

const Management = () => {
  const defaultImg = '//qzz-static.forwe.store/evaluation-mng/imgs/qcc_mng_nodata.png'
  const notDoneImg = '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_nodone.png'
  const DoneImg = '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_done.png'
  const options: IOptions[] = [
    { label: '全部', value: -1 },
    { label: '未完成', value: 0 },
    { label: '已完成', value: 1 },
  ];
  const navigator = useNavigate()
  const [radioValue, setRadioValue] = useState<number>(-1); // 筛选
  const [evaluationList, setEvaluationList] = useState<DataType[]>([]);//  列表数据
  const [tableLoading, setTableLoading] = useState<boolean>(true);// tableLoading
  const [totalNum, setTotalNum] = useState<number>(0); // 总数
  const [current, setCurrent] = useState<number>(1)  // 当前页
  const [pageSize, setPageSize] = useState<number>(10) // 多少条
  const { state, dispatch } = useContext(CountContext)
  const { corpId, appId } = getAllUrlParam()
  const paginationObj = {
    showQuickJumper: true,
    defaultPageSize: 10,
    defaultCurrent: 1,
    current: current,
    showTotal: () => `共 ${totalNum} 条数据`,
    total: totalNum,
    onChange: (page: number, pageSize: number) => {
      getEvaluationList({ curPage: page, pageSize, isFinishType: radioValue })
    }
  }
  useEffect(() => {
    getEvaluationList()
  }, [])
  useEffect(() => {
    let timer: any;
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
    getEvaluationList({ isFinishType: value })
  };
  // 列表
  const getEvaluationList = async (params?: IExamListParams) => {
    setTableLoading(true)
    //isFinishType 0 完成 已完成
    const obj: IExamListParams = {
      curPage: params?.curPage || 1,
      pageSize: params?.pageSize || pageSize,
      isFinishType: params?.isFinishType
    }
    obj.isFinishType == -1 && delete obj.isFinishType
    const res = await getExamList(obj)
    if (res.code == 1) {
      setEvaluationList(res.data.resultList)
      setTableLoading(false)
      setPageSize(res.data.pageSize)
      setTotalNum(res.data.totalItem)
      setCurrent(res.data.curPage)
    }
  }
  // 创建测评
  const createEvaluation = () => {
    navigator('/evaluation/management/library/1')
  }

  const columns: ColumnsType<DataType> = [
    {
      dataIndex: 'createName',
      fixed: 'left',
      width: 340,
      render: (text: string, record: DataType) => {
        return (
          <div className={styles.create_userInfo}>
            <img src={record.logoImage} alt="" />
            <div className={styles.create_right}>
              <div className={styles.create_title}>
                <Tooltip placement="top" title={record.evaluationName}>
                  <p>{record.evaluationName}</p>
                </Tooltip>
                {
                  record.examTemplateType == 'MBTI' && <span className={styles.create_tag}>专</span>
                }
                {
                  record.fromSourceType == 1 && <Tag className={styles.create_tag2} color="processing">酷应用</Tag>
                }
              </div>
              <span>创建人:{record.createName || '暂无'}    {record.created}</span>
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
      width: 200,
      render: (text: string, record: DataType, index: number) => {
        // 开关
        const handleSwitch = async (checked: boolean, id: number) => {
          const res = await editExam({ type: checked, examId: id });
          if (res.code === 1) {
            message.success('修改成功');
            getEvaluationList({ curPage: current });
          }
        }
        // 查看详情
        const onLookDetail = () => {
          navigator(`/evaluation/management/detail/${record.id}`)
        }
        // 添加人员
        const onAddPeopleClick = async (item: DataType) => {
          const params = {
            id: item.id,
            appId,
            corpId,
            successFn: () => {
              message.success('修改成功');
              getEvaluationList({ curPage: current, pageSize, isFinishType: radioValue });
              dispatch()
            },
            failFn: () => null,
            availableBalance: state,
            pointPrice: item?.paperPrice
          }
          ddAddPeople(params, 'update')
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
  const customizeRenderEmpty = () => {
    const img = radioValue == -1 ? defaultImg : radioValue == 0 ? notDoneImg : DoneImg
    const text = radioValue == -1 ? '暂无测评，点击右上方按钮去创建试试吧' : radioValue == 0 ? '很棒，全部人员都已完成测评咯' : '抱歉，暂无完成的测评，快去一键通知他们吧'
    return (
      <div className={styles.management_defaultPage}>
        <img src={img} alt="" />
        <p>{text}</p>
      </div>
    )
  };
  // if (tableLoading) {
  //   return <Loading />
  // }
  return (
    <div className={styles.management_layout}>
      <header>
        <h1 id='appraisal_Management'>盘点测评</h1>
        <div>
          <Radio.Group defaultValue={-1} className={styles.management_radio} options={options} onChange={onRadioChange} value={radioValue} optionType="button" />
          <Button type="primary" onClick={createEvaluation} icon={<PlusCircleOutlined />} >
            创建测评
          </Button>
        </div>
      </header>
      <main>
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <Table loading={tableLoading} rowKey={(row) => row.id}
            showHeader={false} columns={columns}
            scroll={evaluationList.length > 0 ? { x: 1100, } : {}}
            pagination={paginationObj}
            dataSource={evaluationList}>
          </Table>
        </ConfigProvider>
      </main>
    </div>
  )
}

export default Management
