import { createExam, getAllPeople, getExamTemplateList, queryConversationUserList, UnLockReport } from '@/api/api';
import { Button, message, Modal, Select, Tooltip } from 'antd';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import { IExamTemplateList, IAddPeopleRef } from './type'
import AddPeople from './AddPeople';
import { createGroup, installCoolAppToGroup } from 'dingtalk-jsapi/plugin/coolAppSdk';
import {
  DownOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import Loading from '@/components/loading';
import { getAllUrlParam, getIsGuide } from '@/utils/utils';
import { CountContext } from '@/utils/context'
import { ddSelectPeople } from '@/utils/utils'
import process from 'process';

const Library = (props: { type?: number }) => {
  const libraryImg = '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_coupons.png'
  const notUnlockedImg = '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_notunlocked.png'
  const [libraryList, setLibraryList] = useState<IExamTemplateList[]>([]);
  const [libraryLoading, setLibraryLoading] = useState<boolean>(true);
  const [isSelectShow, setIsSelectShow] = useState<boolean[]>([]);
  const { dispatch } = useContext(CountContext)
  const { corpId, appId, clientId } = getAllUrlParam()
  const addPeopleRef = useRef<IAddPeopleRef | null>(null)
  const qcp_user = JSON.parse(sessionStorage.getItem('QCP_B_USER') || '{}')

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
    if (arr.length < 1) return
    const addIndex = arr.findIndex(res => res.isBuy)
    if (addIndex == -1) return
    if (arr.length > 0) {
      const setsArr: StepsType[] = [{
        element: `.addIndex${addIndex}`,
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
  //解锁
  const handleUnlock = (item: IExamTemplateList) => {
    Modal.confirm({
      title: '确定要解锁吗',
      content: `解锁【${item.title}】需要消耗${item.examTemplateCommodityDetail.pointPrice}点券`,
      okText: "确定",
      cancelText: '取消',
      onOk: async (close) => {
        const params = {
          userId: qcp_user.userId,
          templateType: item?.type,
          operationType: '0',
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
  // 添加人员
  const handleClick = (item: IExamTemplateList) => {
    addPeopleRef.current?.openModal(item)
  }
  // 建群测评
  const onColonizationClick = async (item: IExamTemplateList) => {
    // 选人成功回调
    const handelCreateGroup = (data: Multiple[]) => {
      createGroup({
        context: {
          // coolAppCode: 'COOLAPP-1-101BA56791222107E31B000Q', // 线上
          coolAppCode: import.meta.env.VITE_COOLAPPCODE || '0', // 日常
          clientId: clientId as string,
          corpId: corpId as string, // 根据对应场景获取 corpId
        },
        title: `${item.type}测试酷应用`,
        memberUserIds: data?.map((item: any) => item.emplId),
        managementOptions: {
          validationType: 1,
          mentionAllAuthority: 1
        },
      }).then(async res => {
        if (res.errorCode === '0') {
          const result = await createExam({
            examTemplateType: item.type,
            examTemplateId: item.id,
            examTitle: item.title,
            fromSourceType: 1,
            fromSourceId: res.detail.openConversationId,
            examUserList: data?.map((item: any) => ({ userId: item.emplId })),
          });
          if (result.code == 1) {
            message.success('创建群组成功');
          }
          // 建群成功
        }
      }).catch(err => {
        console.log(err, '创建失败')
        message.error('创建群组失败');
        // 用户主动退出安装
      });
    }
    const obj = {
      tpf: 1,
      appId,
      corpId,
      curPage: 1,
      pageSize: 1000
    }
    const res = await getAllPeople(obj)
    if (res.code == 1) {
      const params = {
        corpId,
        usersList: res.data.resultList.map((user: IUser) => user.userId),
        successFn: handelCreateGroup,
      }
      ddSelectPeople(params, 'update')
    }
  }
  // 建群测评
  const onSelectGroupClick = async (item: IExamTemplateList) => {
    const res = await installCoolAppToGroup({
      coolAppCode: import.meta.env.VITE_COOLAPPCODE || '0', // 日常
      clientId: clientId as string,
      corpId: corpId as string, // 根据对应场景获取 corpId
    })
    if (res.errorCode === '0') {
      const data = await queryConversationUserList(res.detail.openConversationId)
      if (data.code == 1) {
        const result = await createExam({
          examTemplateType: item.type,
          examTemplateId: item.id,
          examTitle: item.title,
          fromSourceType: 1,
          fromSourceId: res.detail.openConversationId,
          examUserList: data?.map((item: any) => ({ userId: item })),
        });
        if (result.code == 1) {
          message.success('安装酷应用成功');
        }
      }
    }
  }
  // 是否显示选择框
  const tooltip = (item: IExamTemplateList) => {
    return (
      <div className={styles.Library_tooltipList}>
        <Button onClick={() => onSelectGroupClick(item)}>选群测评</Button>
        <Button onClick={() => onColonizationClick(item)}>建群测评</Button>
      </div>
    )
  }
  // 显示隐藏的回调
  const onVisibleChange = (visible: boolean, index: number) => {
    isSelectShow[index] = visible
    setIsSelectShow([...isSelectShow])
  }
  if (libraryLoading) {
    return <Loading />
  }
  return (
    <div className={styles.Library_layout}>
      {!props.type && <h1>测评库</h1>}
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
                  {/* <Tooltip placement="top" title={'示例报告 '}>
                    <div className={styles.Library_card_toolBorder}>
                      <FileProtectOutlined />
                    </div>
                  </Tooltip> */}
                </div>
              </div>
              <footer>
                <div className={styles.Library_footerLeft}>
                  {
                    appId.split('_')[0] === '1' && <>
                      <img src={libraryImg} className={styles.Library_footerIcon} alt="" />
                      <span>{item.isBuy ? ` ${item.examCouponCommodityDetail.pointPrice}点券/人` : '待解锁'}</span>
                    </>
                  }
                </div>
                {
                  item.isBuy ?
                    <div className={styles.Library_btn_right}>
                      <Tooltip overlayClassName={styles.Library_tooltip} color={'#fff'} placement="bottom" onVisibleChange={(visible) => onVisibleChange(visible, index)} title={() => tooltip(item)}>
                        <div className={styles.Library_select_group}>
                          <span>酷测评</span>
                          <DownOutlined className={styles.menu_down} style={{ transform: `translateY(-50%) rotate(${isSelectShow[index] ? '180deg' : '0deg'})` }} />
                        </div>
                      </Tooltip>
                      <Button type="primary" className={`addPeople${index} ${styles.Library_appPeople}`}
                        onClick={() => handleClick(item)} >
                        添加人员
                      </Button>
                    </div>
                    :
                    <Button type="primary" onClick={() => handleUnlock(item)}>
                      {`${item.examTemplateCommodityDetail.pointPrice}点券解锁`}
                    </Button>
                }
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
