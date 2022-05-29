import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button, Drawer, message, Modal, Result } from 'antd';
import { createExam, getExamTemplateList, shareInfo, isGuide, } from '@/services/api';
import dd from 'dingtalk-jsapi';
import queryString from 'query-string';
import { history, useModel } from 'umi';
import { useEffect, useRef, useState } from 'react';
import { getIsGuide } from '@/utils/utils'

import styles from './index.less';

const ExamTemplate: React.FC = () => {
  const { corpId, appId, clientId } = queryString.parse(location.search);
  const [visible, setVisible] = useState<boolean>(false);
  const [img, setImg] = useState<string>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [getExamTemplateArr, setGetExamTemplateArr] = useState([])
  const [selected, setSelected] = useState<ExamTemplateListItem>();
  const { initialState } = useModel('@@initialState');
  const handleClick = async (template: ExamTemplateListItem) => {
    if (dd.env.platform != 'notInDingTalk') {
      dd.ready(async () => {
        const pickResult = await dd.biz.contact.choose({
          multiple: true, //是否多选：true多选 false单选； 默认true
          corpId,
        });
        if (pickResult.length < 1) {
          return;
        }
        const res = await createExam({
          examTemplateType: template.type,
          examTemplateId: template.id,
          examTitle: template.title,
          examUserList: pickResult?.map((item: any) => ({ userId: item.emplId })),
        });
        if (res.code === 1) {
          setIsModalVisible(true)
          // message.success(res.message);
          // history.push('/exam/index');
        }
      });
    }
  };
  useEffect(() => {
    if (getExamTemplateArr.length > 0) {
      const setsArr: stepsType[] = [{
        element: ".add_people0",
        intro: "点击添加人员，选择员工，创建测评",
        position: "bottom"
      }]
      getIsGuide(setsArr, 1)
    }
  }, [getExamTemplateArr])
  // 是否需要引导
  // const getIsGuide = async () => {
  //   const params = {
  //     corpId,
  //     appId,
  //     userId: initialState?.user?.userId,
  //     type: 1
  //   }
  //   const res = await isGuide(params);
  //   if (res.code == 1) {
  //     if (!res.data) {
  //       const setsArr: stepsType[] = [{
  //         element: ".add_people0",
  //         intro: "点击添加人员，选择员工，创建测评",
  //         position: "bottom"
  //       }]
  //       await handleStep(setsArr,1)
  //     }
  //   }
  // }
  const footerLayout = () => {
    const onLookReport = () => {
      history.push('/exam/index');
    }
    const onNoticeClick = async () => {
      if (dd.env.platform != 'notInDingTalk') {
        dd.ready(async () => {
          const candidates = await dd.biz.chat.pickConversation({
            corpId, //企业id,必须是用户所属的企业的corpid
            isConfirm: false,
            onFail: (err: any) => {
              message.error(err);
            },
          })
          if (candidates.cid) {
            Modal.confirm({
              title: '确认发送',
              content: `消息将发送给${candidates.title}`,
              okText: '确认', onOk: async () => {
                const msg = {
                  msgtype: "link",
                  link: {
                    messageUrl: `${window.location.origin}/?corpId=${corpId}&appId=${appId}&clientId=${clientId}#/user/login`,
                    image: "http://qzz-static.forwe.store/evaluation-mng/imgs/%E8%B6%A3%E6%B5%8B%E8%AF%84logo2.png",
                    title: "趣测评",
                    text: "测试趣测评邀请你来进行PDP和MBTI测试,点击即可进入，快来试试吧!"
                  }
                }
                const res = await shareInfo({ cid: candidates.cid, message: JSON.stringify(msg), userId: initialState?.user?.userId })
                if (res.code == 1) {
                  message.success('发送成功');
                }
              },
              cancelText: '取消',
            });
          }
        })
      }
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <Button size={'large'} type="primary" onClick={onLookReport}>查看报告</Button>
        <Button size={'large'} type="primary" onClick={onNoticeClick}>通知测评</Button>
      </div>
    )
  }
  return (
    <PageContainer header={{ breadcrumb: {} }}>
      <Drawer
        visible={visible}
        onClose={() => setVisible(false)}
        placement="right"
        title="测评介绍"
        closable={false}
        destroyOnClose={true}
      >
        <div className="pageIntroduce">
          <div className={styles.describeBox}>
            <img className={styles.describeImg} src={img} />
          </div>
          <div className={styles.buttonBox}>
            <div className={styles.button} onClick={() => handleClick(selected)}>
              添加人员
            </div>
          </div>
        </div>
      </Drawer>
      <ProList<ExamTemplateListItem>
        pagination={false}
        className="template"
        rowKey="id"
        grid={{ gutter: 16, column: 4 }}
        request={async () => {
          const res = await getExamTemplateList();
          if (res.code === 1) {
            setGetExamTemplateArr(res.data)
            return {
              success: true,
              data: res.data,
            };
          }
          return { success: false };
        }}
        metas={{
          title: {
            dataIndex: 'title',
            render: (title, entity) => {
              return (
                <div
                  className={styles.titleHeader}
                  onClick={() => {
                    setSelected(entity);
                    setImg(JSON.parse(entity.introductionImage).admin);
                    setVisible(true);
                  }}
                >
                  {title}
                </div>
              );
            },
          },
          content: {
            dataIndex: 'introduction',
            render: (introduction, entity, index) => {
              return (
                <div>
                  <div
                    onClick={() => {
                      setSelected(entity);
                      setImg(JSON.parse(entity.introductionImage).admin);
                      setVisible(true);
                    }}
                  >
                    <div
                      style={{
                        color: '#000000',
                        opacity: '45%',
                        fontSize: 16,
                        padding: '20px 20px 0 20px',
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 4,
                        overflow: 'hidden',
                      }}
                    >
                      {introduction}
                    </div>
                    <div style={{ backgroundColor: '#ffffff' }}>
                      <div style={{ margin: '10px 20px' }}>
                        <div>
                          <span style={{ color: '#000000', opacity: '45%', fontSize: 14 }}>
                            作答时间：
                          </span>
                          <span style={{ color: '#000000', opacity: '85%', fontSize: 14 }}>
                            {entity.durationDesc}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: '#000000', opacity: '45%', fontSize: 14 }}>
                            题目数量：
                          </span>
                          <span style={{ color: '#000000', opacity: '85%', fontSize: 14 }}>
                            {entity.examLibrarySum}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleClick(entity)}
                    className={`add_people${index}`}
                    style={{
                      width: '100%',
                      height: 43,
                      backgroundColor: '#E5F2FF',
                      color: '#1890FF',
                      borderRadius: '0px 0px 4px 4px',
                      border: 'none',
                      fontSize: 16,
                    }}
                  >
                    添加人员
                  </Button>
                </div>
              );
            },
          },
        }}
      />
      <Modal width={400} footer={footerLayout()} visible={isModalVisible} onCancel={() => setIsModalVisible(false)}>
        <Result
          status="success"
          title="创建成功"
          style={{ padding: 0 }}
        />
      </Modal>
    </PageContainer>
  );
};

export default ExamTemplate;
