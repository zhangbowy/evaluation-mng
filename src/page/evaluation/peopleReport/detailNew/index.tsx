import { getAllExam, UnLockReport, getUserAllExamResultSummaryGraph, getWorthMatch, notification } from '@/api/api';
import { Breadcrumb, Button, Divider, Tooltip, message } from 'antd';
import React, { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import styles from './index.module.less';
import { IReportDetail, IUserTagVoList, ISex, IEvaluationVoList } from '../type';
import LookResult from '@/components/lookResult'
import Loading from '@/components/loading'
import {
  LockOutlined,
  ManOutlined,
  WomanOutlined,
  DownOutlined,
  UpOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  QuestionCircleFilled
 } from '@ant-design/icons'
import { useNavigate } from 'react-router'
import { majorType } from '@/assets/data';
import Progress from './components/Progress';
import MatchingArea from './components/MatchingArea';
import classNames from 'classnames/bind';
import MbtiResult from './components/MbtiResult';
import PdpResult from './components/PdpResult';
import DiscResult from './components/DiscResult';
import CaResult from './components/CaResult';
import { getAllUrlParam, openLink } from "@/utils/utils";
import cs from 'classnames';
// import ModalScreen from '@/components/modalScreen';

const tagsData = ['自信', '决断力高', '竞争性强', '企图心强', '勇于冒险', '热心', '乐观', '活泼', '社交能力强']
const data1 = [
  {
    match: 1,
    valueId: 1,
    valueName: '成就客户'
  }, {
    match: 1,
    valueId: 2,
    valueName: '创新'
  }, {
    match: 1,
    valueId: 3,
    valueName: '向前一步'
  }, {
    match: 1,
    valueId: 4,
    valueName: '拥抱变化'
  }, {
    match: 1,
    valueId: 5,
    valueName: '坚信'
  }, {
    match: 1,
    valueId: 6,
    valueName: '感恩'
  }
]
const data2 = [
  {
    match: 1,
    valueId: 1,
    valueName: '创造潜力',
    isExist: true
  }, {
    match: 1,
    valueId: 2,
    valueName: '目标潜力',
    isExist: true
  }, {
    match: 1,
    valueId: 3,
    valueName: '探索潜力',
    isExist: true
  }, {
    match: 1,
    valueId: 4,
    valueName: '沟通潜力',
    isExist: true
  }, {
    match: 1,
    valueId: 5,
    valueName: '理解潜力',
    isExist: true
  }, {
    match: 1,
    valueId: 6,
    valueName: '专业潜力',
    isExist: true
  }
]
const Detail = () => {
  const { userId } = useParams()
  const tagRef: any = useRef();
  const [reportDetailList, setReportDetailList] = useState<IReportDetail>()
  const [detailLoading, setDetailLoading] = useState(true)
  const [unlockLoading, setUnlockLoading] = useState<boolean[]>([]);
  const [unlockFail, setUnlockFail] = useState<boolean[]>([]);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chartsData, setChartsData] = useState<any>({});
  const [totalData, setTotalData] = useState<any>({});
  const [deptName, setDeptName] = useState<string>();
  const [totalNum, setTotalNum] = useState<number>(1);
  const [isOpenWorth, setIsOpenWorth] = useState<boolean>(false);
  const [isOpenPosition, setIsOpenPosition] = useState<boolean>(false);
  const lookResultRef: any = useRef()
  const navigator = useNavigate()
  const cx = classNames.bind(styles);
  const { corpId, appId, clientId } = getAllUrlParam();
  useEffect(() => {
    getUserReport();
    getChartsData();
    getTotalData()
  }, [])
  // 获取列表
  const getUserReport = async () => {
    const res = await getAllExam({ userId })
    if (res.code === 1) {
      const str = res.data.deptList.map((v: any) => v.name).join(',');
      const totalNum = res.data.successNum + res.data.remainingNum;
      setTotalNum(totalNum);
      setDeptName(str);
      setReportDetailList(res.data)
      setDetailLoading(false)
    }
  }
  // 获取图表数据
  const getChartsData = async () => {
    const res = await getUserAllExamResultSummaryGraph({ userId })
    if (res.code === 1) {
      setChartsData(res.data);
    }
  }
  // 获取总结的数据
  const getTotalData = async () => {
    const res = await getWorthMatch({ userId })
    if (res.code === 1) {
      setTotalData(res.data);
    }
  }
  // 是否存在报告的样式
  const isReportStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    backdropFilter: 'blur(0px)'
  }
  // 是否已完成
  const isDone = (status: number) => {
    const arr = [5, 10]
    return arr.includes(status)
  }
  // 获取匹配数据
  const {valueData, positionData} = useMemo(() => {
    let a = [];
    let b = [];
    const num = reportDetailList?.remainingNum || 0;
    if (num > 0) {
      return {
        valueData: data1,
        positionData: data2,
      }
    } else {
      if (isOpenWorth) {
        a = totalData?.valuesMatchDTO?.valuePointMatchList
      } else {
        a = totalData?.valuesMatchDTO?.valuePointMatchList?.slice(0, 6)
      }
      if (isOpenPosition) {
        b = totalData?.positionMatchDTO?.positionMatchList
      } else {
        b = totalData?.positionMatchDTO?.positionMatchList?.slice(0, 6)
      }
      return {
        valueData: a,
        positionData: b
      }
    }

  }, [totalData, isOpenWorth, isOpenPosition, reportDetailList]);
  useEffect(() => {
    if (tagRef.current) {
      if (tagRef?.current?.scrollHeight > tagRef?.current?.clientHeight) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    }
  }, [reportDetailList, tagRef]);
  // 发送通知
  const sendNotice = (examPaperId: string | number) => {
    notification({
      examPaperIds: [examPaperId]
    }).then(res => {
      if (res.code === 1) {
        message.success('通知测评成功');
      }
    })
  };

  // 返回按钮
  const backText = (item: IEvaluationVoList, index: number) => {
    // 查看详情
    const onDetailClick = (item: IEvaluationVoList) => {
      if (item.examTemplateType === 'MBTI' || item.examTemplateType === 'DISC' || item.examTemplateType === 'PDP' || item.examTemplateType === 'CA') {
        navigator(`/evaluation/peopleReport/lookReport/${userId}/${item.examPaperId}~${userId}~${item.examTemplateType}`);
      } 
      lookResultRef.current.onOpenDrawer({ examPaperId: item.examPaperId, userId })
    }
    // 解锁查看
    const onUnlockClick = async () => {
      unlockLoading[index] = true
      setUnlockLoading([...unlockLoading])
      const params = {
        userId: userId!,
        templateType: item?.examTemplateType as string,
        operationType: '1',
        examId: item.examId
      }
      const res = await UnLockReport(params)
      if (res.code == 1) {
        getUserReport()
      } else {
        unlockFail[index] = true
        setUnlockFail([...unlockFail])
      }
    }
    switch (item.answerStatus) {
      // 10-已完成，5-未解锁，1-测评中，0-未测评
      case 10:
        return <Button type="link" onClick={() => onDetailClick(item)}>查看报告</Button>
      case 5:
        return <Button loading={unlockLoading[index] && !unlockFail[index]} icon={!unlockFail[index] && <LockOutlined />}
          onClick={onUnlockClick} type="link">
          {unlockFail[index] ? '点券不足，充值后解锁查看' : unlockLoading[index] ? `解锁中` : '解锁查看'}</Button>
      case 1:
        return <Button type='text' disabled>测评进行中…</Button>
      default:
        return <Button type='link' onClick={() => sendNotice(item.examPaperId)}>通知测评</Button>
    }
  }
  // 标签的展开收起
  const openTag = () => {
    setIsOpen(true);
  }
  const closeTag = () => {
    setIsOpen(false);
  }
  // 价值观的展开收起
  const openWorth = () => {
    setIsOpenWorth(true);
  }
  const closeWorth = () => {
    setIsOpenWorth(false);
  }
  // 岗位潜力的展开收起
  const openPosition = () => {
    setIsOpenPosition(true);
  }
  const closePosition = () => {
    setIsOpenPosition(false);
  }
  if (detailLoading) {
    return <Loading />
  }
  const goShare = () => {
    const a = 'https://share.shanhaibi.com/62f5c17d88fe0?ddtab=true'
    openLink({
      url: `${window.location.origin}/admin/?corpId=${corpId}&appId=${appId}&clientId=${clientId}#/share?ddtab=true`
    }, true)
  }
  return (
    <div className={styles.detail_layout}>
      <Breadcrumb separator=">" className={styles.detail_nav}>
        <Breadcrumb.Item href="#/evaluation/peopleReport">人才报告</Breadcrumb.Item>
        <Breadcrumb.Item>{reportDetailList?.name}</Breadcrumb.Item>
      </Breadcrumb>
      <Divider />
      {/* <Button onClick={goShare}>点击跳转</Button> */}

      <div className={styles.detail_content}>
        <div className={styles.detail_content_left}>
          <div className={styles.detail_content_left_wrap}>
            <div className={styles.detail_content_left_info}>
              {
                reportDetailList?.avatar ?
                  <img src={reportDetailList?.avatar} alt="" /> :
                  <div className={styles.detail_notAvatar}>
                    {reportDetailList?.name?.slice(0, 1)}
                  </div>
              }
              <div className={styles.detail_left_info_name}>
                <span className={styles.detail_left_info_name_text}>{reportDetailList?.name}</span>
                <Tooltip placement="top" title={`性别：${reportDetailList?.sex == 1 ? '男' : '女'}`}>
                  <div className={reportDetailList?.sex == 1 ? styles.detail_gender_1 : styles.detail_gender_2}>
                    {reportDetailList?.sex == 1 ? <ManOutlined /> : <WomanOutlined />}
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className={styles.detail_left_position}>
              <div className={styles.detail_left_position_content}>
                <span className={styles.detail_left_position_content_title}>所在部门</span>
                <span className={styles.detail_left_position_content_text}>{deptName}</span>
              </div>
              <div className={styles.detail_left_position_content}>
                <span className={styles.detail_left_position_content_title}>职位</span>
                <span className={styles.detail_left_position_content_text}>{reportDetailList?.position ? reportDetailList?.position : '-'}</span>
              </div>
            </div>
            <div className={styles.detail_left_line}></div>
            <div className={styles.detail_left_tag}>
              <div className={styles.detail_left_tag_title}>
                <span>标签</span>
              </div>
              <div ref={tagRef} className={cx({
                'detail_left_tag_content': true,
                'is-hidden': !isOpen,
                'is-show': isOpen,
              })}>
                {
                  reportDetailList?.userTagVoList.map((tag: IUserTagVoList) => (
                    <div key={tag.id} className={styles.detail_left_tag_content_item}>{tag.name}</div>
                  ))
                }
              </div>
              {
                isHidden && <>
                  {
                    isOpen ? <UpOutlined onClick={closeTag} className={styles.detail_left_tag_content_icon} />
                      : <DownOutlined onClick={openTag} className={styles.detail_left_tag_content_icon} />
                  }
                </>
              }
            </div>
            <div className={styles.detail_left_evaluation}>
              <div className={styles.detail_left_evaluation_header}>
                <span className={styles.detail_left_evaluation_header_title}>测评</span>
                <Progress
                  width={29}
                  height={5}
                  totalScore={totalNum}
                  score={(reportDetailList?.successNum || 0)}
                />
              </div>
              <div className={styles.detail_left_evaluation_content}>
                {
                  reportDetailList?.evaluationVoList.map((item) => (
                    <div
                      key={item?.examPaperId}
                      className={item.answerStatus === 0 ? cs(styles.detail_left_evaluation_content_item, styles.no) : styles.detail_left_evaluation_content_item}
                    >
                      <div
                        className={cx({
                          'detail_left_evaluation_content_item_icon': true,
                          'is_pdp': item.examTemplateType === 'PDP',
                          'is_mbti': item.examTemplateType === 'MBTI',
                          'is_ca': item.examTemplateType === 'CA',
                          'is_cpi': item.examTemplateType === 'CPI',
                          'is_disc': item.examTemplateType === 'DISC',
                          'is_mbti_o': item.examTemplateType === 'MBTI_O' 
                        })}
                      >
                        {item.examTemplateType === 'CA' ? '职' : item.examTemplateType.slice(0, 1)}
                      </div>
                      <div className={styles.detail_left_evaluation_content_item_name}>
                        <span>
                          {item.examTemplateType === 'CA' ? '职业锚' : item.examTemplateType}
                        </span>
                        {
                          item.answerStatus === 0 && <span className={styles.detail_left_evaluation_content_item_name_pend}>
                            待测评
                          </span>
                        }
                        
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
        <div className={styles.detail_content_right}>
          <div className={styles.detail_content_right_summary}>
            <div className={styles.detail_content_right_summary_header}>
              <span className={styles.detail_content_right_summary_header_title}>人才总结</span>
              <span className={styles.detail_content_right_summary_header_tips}>测评数据展示人才潜力评估</span>
            </div>
            <div className={styles.detail_content_right_summary_content}>
              <div className={styles.detail_content_right_summary_content_area}>
                <MatchingArea reportDetailList={reportDetailList} totalData={totalData} />
              </div>
              <div className={styles.detail_content_right_summary_consult}>
                <div className={styles.detail_content_right_summary_consult_left}>
                  <div className={styles.detail_content_right_summary_consult_left_header}>
                    <span className={styles.detail_content_right_summary_consult_left_header_title}>
                      <span className={styles.detail_content_right_summary_consult_left_header_icon}>
                        <i className="iconfont icon-jiazhi" style={{ fontSize: '12px', color: '#fff' }} />
                      </span>
                      <span>价值观匹配参考</span>
                      <Tooltip title='测评全部完成后会给出价值观匹配参考依据，具体请结合线下该员工一系列行为综合评判。'>
                        <QuestionCircleFilled className={styles.detail_content_right_summary_consult_left_header_title_question} />
                      </Tooltip>
                    </span>
                    <span className={styles.detail_content_right_summary_consult_left_header_precent}>
                      {(reportDetailList?.remainingNum || 0) > 0 ? '-' : `${totalData?.valuesMatchDTO?.totalMatch}%`}
                    </span>
                  </div>
                  <div className={styles.detail_content_right_summary_consult_left_content}>
                    {
                      (reportDetailList?.remainingNum ? reportDetailList?.remainingNum : 0) > 0 && <div className={styles.detail_content_right_summary_consult_left_content_filter}>
                        <p>请先完成所有测评</p>
                        <p>再查看结果</p>
                      </div>
                    }
                    {
                      valueData?.map((v: any) => (
                        <div key={v.valueId} className={styles.detail_content_right_summary_consult_left_content_item}>
                          <span className={styles.detail_content_right_summary_consult_left_content_item_text}>{v.valueName}</span>
                          <Progress
                            width={37}
                            height={6}
                            totalScore={100}
                            score={v.match}
                            fontSize={14}
                          />
                        </div>
                      ))
                    }
                    {
                      valueData?.length > 6 && <div className={styles.detail_content_right_summary_consult_left_icon_wrap}>
                      {
                        isOpenWorth ? <UpOutlined onClick={closeWorth} className={styles.detail_content_right_summary_consult_left_icon} />
                          : <DownOutlined onClick={openWorth} className={styles.detail_content_right_summary_consult_left_icon} />
                      }
                      </div>
                    }
                  </div>
                </div>
                <div className={styles.detail_content_right_summary_consult_right}>
                  <div className={styles.detail_content_right_summary_consult_right_header}>
                    <span className={styles.detail_content_right_summary_consult_right_header_title}>
                      <span className={styles.detail_content_right_summary_consult_right_header_icon}>
                        <i className="iconfont icon-gangwei" style={{ fontSize: '12px', color: '#fff' }} />
                      </span>
                      <span>岗位潜力匹配参考</span>
                      <Tooltip title='测评全部完成后会给出价值观匹配参考依据，具体请结合线下该员工一系列行为综合评判。'>
                        <QuestionCircleFilled className={styles.detail_content_right_summary_consult_right_header_title_question} />
                      </Tooltip>
                    </span>
                    <span className={styles.detail_content_right_summary_consult_right_header_precent}>
                      {(reportDetailList?.remainingNum || 0) > 0 ? '-' : `${totalData?.positionMatchDTO?.totalMatch}%`}
                    </span>
                  </div>
                  <div className={styles.detail_content_right_summary_consult_right_content}>
                    {
                      (reportDetailList?.remainingNum ? reportDetailList?.remainingNum : 0) > 0 && <div className={styles.detail_content_right_summary_consult_right_content_filter}>
                        <div>请先完成所有测评</div>
                        <div>再查看结果</div>
                      </div>
                    }
                    {
                      positionData?.map((v: any) => (
                        <div key={v.valueId} className={styles.detail_content_right_summary_consult_right_content_item}>
                          <span className={styles.detail_content_right_summary_consult_right_content_item_text}>{v.valueName}</span>
                          <div className={styles.detail_content_right_summary_consult_right_content_item_wrap}>
                            {
                              v.isExist ? <CheckCircleFilled style={{ color: '#6BC881' }} />
                                : <CloseCircleFilled style={{ color: '#EF6544' }} />
                            }
                            <span className={styles.detail_content_right_summary_consult_right_content_item_status}>
                              {
                                v.isExist ? '匹配' : '不匹配'
                              }
                            </span>
                          </div>
                        </div>
                      ))
                    }
                    {
                      positionData?.length > 6 && <div className={styles.detail_content_right_summary_consult_right_icon_wrap}>
                      {
                        isOpenPosition ? <UpOutlined onClick={closePosition} className={styles.detail_content_right_summary_consult_right_icon} />
                          : <DownOutlined onClick={openPosition} className={styles.detail_content_right_summary_consult_right_icon} />
                      }
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.detail_content_right_result}>
            <div className={styles.detail_content_right_result_wrap}>
              <MbtiResult sendNotice={sendNotice} chartsData={chartsData.mbtiResultChart} />
              <PdpResult sendNotice={sendNotice} chartsData={chartsData.pdpResultChart} />
            </div>
            <div className={styles.detail_content_right_result_wrap}>
              <DiscResult sendNotice={sendNotice} chartsData={chartsData.discResultChart} />
              <CaResult sendNotice={sendNotice} chartsData={chartsData.caResultChart} />
            </div>
          </div>
          <div className={styles.detail_content_right_report}>
            <div className={styles.detail_content_right_report_header}>
              <span className={styles.detail_content_right_report_header_title}>测评报告（4/4）</span>
            </div>
            <div className={styles.detail_content_right_report_content}>
              <div className={styles.detail_card_wrapper}>
                {
                  reportDetailList?.evaluationVoList?.map((item, index) => (
                    <ul key={item?.examPaperId}>
                      <li>
                        {
                          (item.answerStatus === 1 || item.answerStatus === 0) &&
                          <div className={item.answerStatus === 1 ? styles.detail_card_num : styles.detail_card_num_no}>
                            <span className={styles.detail_card_num_status}>{item.answerStatus === 1 ? '测试中' : '未开始'}</span>
                            <span>{item.finishQuestionCount}/{item.totalQuestionCount}</span>
                          </div>
                        }
                        <img src={item?.logoImage} alt="" />
                        <article>
                          <h1>{item?.examName}</h1>
                          <section>
                            <span>完成时间：{item?.date ? item?.date : '-'}</span>
                          </section>
                        </article>
                      </li>
                      {backText(item, index)}
                    </ul>
                  ))
                }
                <div className={styles.detail_card}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LookResult ref={lookResultRef} />
      {/* <ModalScreen visible={true} /> */}
    </div>

  )
}

export default Detail