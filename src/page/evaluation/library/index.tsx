import { getExamTemplateList, UnLockReport } from '@/api/api';
import { Button, message, Modal, Tooltip } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import { IExamTemplateList, IAddPeopleRef } from './type'
import AddPeople from './AddPeople';
import {
  ExceptionOutlined,
  HomeOutlined
} from '@ant-design/icons';
import Loading from '@/components/loading';
import { getIsGuide } from '@/utils/utils';
import { CountContext } from '@/utils/hook'

const Library = () => {
  const libraryImg = '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_coupons.png'
  const notUnlockedImg = '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_notunlocked.png'
  const [libraryList, setLibraryList] = useState<IExamTemplateList[]>([]);
  const [libraryLoading, setLibraryLoading] = useState<boolean>(true);
  const { dispatch } = useContext(CountContext)
  const addPeopleRef = useRef<IAddPeopleRef | null>(null)
  const qcp_user = JSON.parse(sessionStorage.getItem('QCP_B_USER') || '{}')
  const addPeopleStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '4px',
    border: '1px solid #2B85FF',
    color: 'var(--primary-color)'
  }
  useEffect(() => {
    getLibraryList()
  }, [])
  useEffect(() => {
    let timer: any;
    if (!libraryLoading) {
      timer = setTimeout(() => {
        currentStep(libraryList)
      }, 1000)
    }
    () => {
      clearTimeout(timer)
    }
  }, [libraryLoading])
  // 引导步骤
  const currentStep = (arr: IExamTemplateList[]) => {
    if (arr.length > 0) {
      const setsArr: StepsType[] = [{
        element: ".addPeople0",
        intro: "第一次创建测评，需要先在此添加人员哦～",
        position: "bottom",
      }]
      getIsGuide(setsArr, 1)
    }
  }
  // 获取测评库列表
  const getLibraryList = async () => {
    const res: IBack = await getExamTemplateList();
    if (res.code == 1) {
      setLibraryList(res.data)
      setLibraryLoading(false)
    }
  }
  // 解锁、添加人员
  const handleClick = (item: IExamTemplateList) => {
    if (item.isBuy) {
      addPeopleRef.current?.openModal(item)
    } else {
      Modal.confirm({
        title: '确定要解锁吗',
        content: `解锁【${item.title}】需要消耗${item.examTemplateCommodityDetail.originalPointPrice}点券`,
        okText: "确定",
        cancelText: '取消',
        onOk: async (close) => {
          const params = {
            userId: qcp_user.userId,
            templateType: item?.type,
            operationType: '0'
          }
          const res = await UnLockReport(params)
          if (res.code == 1) {
            message.success('解锁成功');
            dispatch()
            getLibraryList()
            close()
          }
        }
      });
    }
  }
  if (libraryLoading) {
    return <Loading />
  }
  return (
    <div className={styles.Library_layout}>
      <h1>测评库</h1>
      <main>
        {
          libraryList.map((item: IExamTemplateList, index: number) => (
            <div key={item.id} className={styles.Library_card_wrapper}>
              {!item.isBuy && <div className={styles.Library_card_mantle} />}
              <img src={item.planImage} alt="" />
              <p>{item.introduction}</p>
              <p>{item.includeText}</p>
              <div className={styles.Library_topicInfo}>
                <div className={styles.Library_topicInfoLeft}>
                  <label>作答时间<span>{item.durationDesc}</span></label>
                  <label>题目数量<span>{item.examLibrarySum}</span></label>
                </div>
                {!item.isBuy && <img src={notUnlockedImg} alt="" />}
                <div className={styles.Library_topicInfoRight}>
                  <Tooltip placement="top" title={'实例报告 '}>
                    <div className={styles.Library_card_toolBorder}>
                      <ExceptionOutlined />
                    </div>
                  </Tooltip>
                </div>
              </div>
              <footer>
                <div className={styles.Library_footerLeft}>
                  <img src={libraryImg} className={styles.Library_footerIcon} alt="" />
                  <span>{item.isBuy ? `${item.examCouponCommodityDetail.pointPrice}点券/人` : '待解锁'}</span>
                </div>
                <Button type="primary" className={`addPeople${index}`} onClick={() => handleClick(item)} style={item.isBuy ? addPeopleStyle : {}} >{item.isBuy ? '添加人员' : `${item.examTemplateCommodityDetail.pointPrice}点券解锁`}</Button>
              </footer>
            </div>
          ))
        }
      </main>
      <AddPeople ref={addPeopleRef} />
    </div>
  )
}

export default Library 