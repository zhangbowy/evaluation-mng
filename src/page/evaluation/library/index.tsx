import { getExamTemplateList } from '@/api/api';
import { Button, message, Modal, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import { IExamTemplateList, IAddPeopleRef } from './type'
import AddPeople from './AddPeople';
import {
  ExceptionOutlined,
  HomeOutlined
} from '@ant-design/icons';
import Loading from '@/components/loading';
import { getIsGuide } from '@/utils/utils';

const Library = () => {
  const logo = 'https://img2.baidu.com/it/u=2037190485,1131854173&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
  const [libraryList, setLibraryList] = useState<IExamTemplateList[]>([]);
  const [libraryLoading, setLibraryLoading] = useState<boolean>(true);
  const addPeopleRef = useRef<IAddPeopleRef | null>(null)
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
    let timer: NodeJS.Timeout;
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
    addPeopleRef.current?.openModal(item)
    // Modal.confirm({
    //   title: '确定要解锁吗',
    //   content: '解锁【PDP性格测试】需要消耗1000点券',
    //   okText: "确定",
    //   cancelText: '取消',
    //   onOk: (close) => {
    //     message.success('解锁成功');
    //     close()
    //   }
    // });
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
              <div className={styles.Library_isUnlock}>
                <HomeOutlined className={styles.Library_footerIcon} />
                <span>未解锁</span>
              </div>
              <img src={logo} alt="" />
              <p>{item.introduction}</p>
              <p>报告包含：性格取向分析图谱、特质分析、适合行业岗位、工作风格、工作潜力、职业发展规划等</p>
              <div className={styles.Library_topicInfo}>
                <div className={styles.Library_topicInfoLeft}>
                  <label>作答时间<span>{item.durationDesc}</span></label>
                  <label>题目数量<span>{item.examLibrarySum}</span></label>
                </div>
                <div className={styles.Library_topicInfoRight}>
                  <Tooltip placement="top" title={'哈哈哈哈哈哈哈'}>
                    <ExceptionOutlined />
                  </Tooltip>
                </div>
              </div>
              <footer>
                <div className={styles.Library_footerLeft}>
                  <HomeOutlined className={styles.Library_footerIcon} />
                  <span>点券</span>
                  <span>{item.isBuy ? '50/人' : '1000点券解锁'}</span>
                </div>
                <Button type="primary" className={`addPeople${index}`} onClick={() => handleClick(item)} style={item.isBuy ? addPeopleStyle : {}} >{item.isBuy ? '添加人员' : '解锁'}</Button>
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