import { getAllExam, UnLockReport } from '@/api/api';
import { Breadcrumb, Button, Divider, Progress, Tooltip } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import styles from './index.module.less';
import { IReportDetail, IUserTagVoList, ISex, IEvaluationVoList } from '../type';
import LookResult from '@/components/lookResult'
import Loading from '@/components/loading'
import { LockOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'
import { majorType } from '@/assets/data';

const Detail = () => {
  const { userId } = useParams()
  const [reportDetailList, setReportDetailList] = useState<IReportDetail>()
  const [detailLoading, setDetailLoading] = useState(true)
  const [unlockLoading, setUnlockLoading] = useState<boolean[]>([]);
  const [unlockFail, setUnlockFail] = useState<boolean[]>([]);
  const lookResultRef: any = useRef()
  const navigator = useNavigate()
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
  const isDone = (status: number) => {
    const arr = [5, 10]
    return arr.includes(status)
  }

  // 返回按钮
  const backText = (item: IEvaluationVoList, index: number) => {
    // 查看详情
    const onDetailClick = (item: IEvaluationVoList) => {
      if (item.examTemplateType === 'MBTI' || item.examTemplateType === 'DISC') {
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
      case 10:
        return <Button type="link" onClick={() => onDetailClick(item)}>查看详情</Button>
      case 5:
        return <Button loading={unlockLoading[index] && !unlockFail[index]} icon={!unlockFail[index] && <LockOutlined />}
          onClick={onUnlockClick} type="link">
          {unlockFail[index] ? '点券不足，充值后解锁查看' : unlockLoading[index] ? `解锁中` : '解锁查看'}</Button>
      default:
        return <Button type='text' disabled>测评进行中…</Button>
    }
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
          {
            reportDetailList?.avatar ?
              <img src={reportDetailList?.avatar} alt="" /> :
              <div className={styles.detail_notAvatar}>{reportDetailList?.name?.slice(0, 1)}</div>
          }
          <h2>{`${reportDetailList?.name}-${reportDetailList?.deptList[0]?.name || ''}`}</h2>
          <Tooltip placement="top" title={`性别：${ISex[reportDetailList!.sex]}`}>
            <div className={reportDetailList?.sex == 1 ? styles.detail_gender_1 : styles.detail_gender_2}>
              {reportDetailList?.sex == 1 ? <ManOutlined /> : <WomanOutlined />}
            </div>
          </Tooltip>
        </div>
        <ul className={styles.detail_tags}>
          {reportDetailList?.userTagVoList?.map((tag: IUserTagVoList) => (
            <li key={tag.id}>{tag?.name}</li>
          ))}
        </ul>
        <div className={styles.detail_message}>
          <ul>
            <li>完成测评：{reportDetailList?.successNum}个</li>
            <li>剩余测评：{reportDetailList?.remainingNum}个</li>
          </ul>
          <ul>
            <Tooltip placement="top" title={`完成测评：${reportDetailList?.successNum}个  剩余测评：${reportDetailList?.remainingNum}个`}>
              <Progress percent={reportDetailList?.finishValue} size="small" />
            </Tooltip>
          </ul>
        </div>
        <div className={styles.detail_card_wrapper}>
          {
            reportDetailList?.evaluationVoList?.map((item, index) => (
              <ul key={item?.examId} style={isDone(item?.answerStatus) ? {} : isReportStyle}>
                <li>
                  <img src={item?.logoImage} alt="" />
                  <article>
                    <h1>{item?.examName}</h1>
                    <section>
                      <span>{item?.includeText}</span>
                      <span>{item?.date}</span>
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
      <LookResult ref={lookResultRef} />
    </div>

  )
}

export default Detail