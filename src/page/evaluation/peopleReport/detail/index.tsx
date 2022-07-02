import { getAllExam } from '@/api/api';
import { Breadcrumb, Button, Divider, Progress } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import styles from './index.module.less';
import { IReportDetail, IUserTagVoList, IEvaluationVoList } from '../type';
import LookResult from '@/components/lookResult'
import Loading from '@/components/loading'

const Detail = () => {
  const { userId } = useParams()
  const [reportDetailList, setReportDetailList] = useState<IReportDetail>()
  const [detailLoading, setDetailLoading] = useState(true)
  const logo = '//qzz-static.forwe.store/evaluation-mng/imgs/%E8%B6%A3%E6%B5%8B%E8%AF%84logo2.png'
  const lookResultRef: any = useRef()
  useEffect(() => {
    getUserReport()
  }, [])
  // 获取列表
  const getUserReport = async () => {
    const res = await getAllExam({ userId })
    if (res.code === 1) {
      setReportDetailList(res.data)
      setDetailLoading(false)
    }
  }
  // 是否存在报告的样式
  const isReportStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    backdropFilter: 'blur(0px)'
  }
  // 是否已完成
  const isDone = (status: number) => status == 10
  // 查看详情
  const onDetailClick = (item: IEvaluationVoList) => {
    lookResultRef.current.onOpenDrawer(item)
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
        <div className={styles.detail_header}>
          <img src={logo} alt="" />
          <h2>{`${reportDetailList?.name}-${reportDetailList?.deptList[0].name}`}</h2>
        </div>
        <ul className={styles.detail_tags}>
          {reportDetailList?.userTagVoList.map((tag: IUserTagVoList) => (
            <li key={tag.id}>{tag.name}</li>
          ))}
        </ul>
        <div className={styles.detail_message}>
          <ul>
            <li>完成测评：{reportDetailList?.successNum}个</li>
            <li>剩余测评：{reportDetailList?.remainingNum}个</li>
          </ul>
          <ul><Progress percent={reportDetailList?.finishValue} size="small" /></ul>
        </div>
        <div className={styles.detail_card_wrapper}>
          {
            reportDetailList?.evaluationVoList.map(item => (
              <ul key={item.examId} style={isDone(item.answerStatus) ? {} : isReportStyle}>
                <li>
                  <img src={logo} alt="" />
                  <article>
                    <h1>{item.examName}</h1>
                    <section>
                      <span>报告包含：性格取向分析图谱、特质分析、适合行业岗位、工作风格、工作潜力、职业发展规划等。</span>
                      <span>{item.date}</span>
                    </section>
                  </article>
                </li>
                <Button onClick={() => onDetailClick(item)} type={isDone(item.answerStatus) ? 'link' : 'text'} disabled={!isDone(item.answerStatus)}>{isDone(item.answerStatus) ? '查看详情' : '测评进行中…'}</Button>
              </ul>
            ))
          }
          <div className={styles.detail_card}></div>
        </div>
      </div>
      <LookResult ref={lookResultRef} />
    </div>

  )
}

export default Detail