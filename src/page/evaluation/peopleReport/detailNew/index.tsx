import { getAllExam, UnLockReport, getUserAllExamResultSummaryGraph } from '@/api/api';
import { Breadcrumb, Button, Divider, Tooltip } from 'antd';
import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

const tagsData = ['自信', '决断力高', '竞争性强', '企图心强', '勇于冒险', '热心', '乐观', '活泼', '社交能力强']
const data1 = ['成就客户', '创新', '向前一步', '拥抱变化', '坚信', '感恩'];
const data2 = ['创造潜力', '目标潜力', '探索潜力', '沟通潜力', '理解潜力', '专业潜力'];
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
  const lookResultRef: any = useRef()
  const navigator = useNavigate()
  const cx = classNames.bind(styles);
  useEffect(() => {
    getUserReport();
    getChartsData()
  }, [])
  // 获取列表
  const getUserReport = async () => {
    const res = await getAllExam({ userId })
    if (res.code === 1) {
      console.log(res.data);
      setReportDetailList(res.data)
      setDetailLoading(false)
    }
  }
  // 获取图表数据
  const getChartsData = async () => {
    const res = await getUserAllExamResultSummaryGraph({ userId })
    if (res.code === 1) {
      console.log(res);
      setChartsData(res.data);
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
  useEffect(() => {
    console.log(reportDetailList, tagRef?.current?.clientHeight, tagRef?.current?.scrollHeight );
    if (tagRef.current) {
      if (tagRef?.current?.scrollHeight > tagRef?.current?.clientHeight) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    }
  }, [reportDetailList, tagRef]);

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
        return <Button type='link'>通知测评</Button>
    }
  }
  // 标签的展开收起
  const openTag = () => {
    setIsOpen(true);
  }
  const closeTag = () => {
    setIsOpen(false);
  }
  if (detailLoading) {
    return <Loading />
  }
  return (
    <div className={styles.detail_layout}>
      <Breadcrumb separator=">" className={styles.detail_nav}>
        <Breadcrumb.Item href="#/evaluation/peopleReport">人才报告</Breadcrumb.Item>
        <Breadcrumb.Item>{reportDetailList?.name}</Breadcrumb.Item>
      </Breadcrumb>
      <Divider />
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
              <p className={styles.detail_left_info_name}>
                <span>{reportDetailList?.name}</span>
                <Tooltip placement="top" title={`性别：${ISex[reportDetailList!.sex]}`}>
                  <div className={reportDetailList?.sex == 1 ? styles.detail_gender_1 : styles.detail_gender_2}>
                    {reportDetailList?.sex == 1 ? <ManOutlined /> : <WomanOutlined />}
                  </div>
                </Tooltip>
              </p>
            </div>
            <div className={styles.detail_left_position}>
              <div className={styles.detail_left_position_content}>
                <span className={styles.detail_left_position_content_title}>所在部门</span>
                <span className={styles.detail_left_position_content_text}>管理数字化</span>
              </div>
              <div className={styles.detail_left_position_content}>
                <span className={styles.detail_left_position_content_title}>职位</span>
                <span className={styles.detail_left_position_content_text}>高级产品经理</span>
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
                  totalScore={100}
                  score={20}
                />
              </div>
              <div className={styles.detail_left_evaluation_content}>
                {
                  reportDetailList?.evaluationVoList.map((item) => (
                    <div key={item?.examId} className={styles.detail_left_evaluation_content_item}>
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
                <MatchingArea />
              </div>
              <div className={styles.detail_content_right_summary_consult}>
                <div className={styles.detail_content_right_summary_consult_left}>
                  <div className={styles.detail_content_right_summary_consult_left_header}>
                    <span className={styles.detail_content_right_summary_consult_left_header_title}>
                      <span>价值观匹配参考</span>
                      <QuestionCircleFilled className={styles.detail_content_right_summary_consult_left_header_title_question} />
                    </span>
                    <span className={styles.detail_content_right_summary_consult_left_header_precent}>90%</span>
                  </div>
                  <div className={styles.detail_content_right_summary_consult_left_content}>
                    <div className={styles.detail_content_right_summary_consult_left_content_filter}>
                      <p>请先完成所有测评</p>
                      <p>再查看结果</p>
                    </div>
                    {
                      data1.map((v: string) => (
                        <div key={v} className={styles.detail_content_right_summary_consult_left_content_item}>
                          <span className={styles.detail_content_right_summary_consult_left_content_item_text}>{v}</span>
                          <Progress
                            width={37}
                            height={6}
                            totalScore={100}
                            score={20}
                            fontSize={14}
                            left={14}
                          />
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div className={styles.detail_content_right_summary_consult_right}>
                  <div className={styles.detail_content_right_summary_consult_right_header}>
                    <span className={styles.detail_content_right_summary_consult_right_header_title}>
                      <span>价值观匹配参考</span>
                      <QuestionCircleFilled className={styles.detail_content_right_summary_consult_right_header_title_question} />
                    </span>
                    <span className={styles.detail_content_right_summary_consult_right_header_precent}>90%</span>
                  </div>
                  <div className={styles.detail_content_right_summary_consult_right_content}>
                    <div className={styles.detail_content_right_summary_consult_right_content_filter}>
                      <div>请先完成所有测评</div>
                      <div>再查看结果</div>
                    </div>
                    {
                      data2.map((v: string) => (
                        <div key={v} className={styles.detail_content_right_summary_consult_right_content_item}>
                          <span className={styles.detail_content_right_summary_consult_right_content_item_text}>{v}</span>
                          <div className={styles.detail_content_right_summary_consult_right_content_item_wrap}>
                            <CheckCircleFilled style={{ color: '#6BC881' }} />
                            {/* <CloseCircleFilled style={{ color: '#EF6544' }} /> */}
                            <span className={styles.detail_content_right_summary_consult_right_content_item_status}>匹配</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.detail_content_right_result}>
            <div className={styles.detail_content_right_result_wrap}>
              <MbtiResult chartsData={chartsData.mbtiResultChart} />
              <PdpResult chartsData={chartsData.pdpResultChart} />
            </div>
            <div className={styles.detail_content_right_result_wrap}>
              <DiscResult chartsData={chartsData.discResultChart} />
              <CaResult chartsData={chartsData.caResultChart} />
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
                    <ul key={item?.examId}>
                      <li>
                        {
                          (item.answerStatus === 1 || item.answerStatus === 0) &&
                          <div className={item.answerStatus === 1 ? styles.detail_card_num : styles.detail_card_num_no}>
                            <span className={styles.detail_card_num_status}>{item.answerStatus === 1 ? '测试中' : '未开始'}</span>
                            <span>2/30</span>
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
    </div>

  )
}

export default Detail