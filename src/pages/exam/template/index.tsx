import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button, Drawer, message, Modal, Result, Image } from 'antd';
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
  const [getExamTemplateArr, setGetExamTemplateArr] = useState<ExamTemplateListItem[]>([])
  const [selected, setSelected] = useState<ExamTemplateListItem>();
  const { initialState } = useModel('@@initialState');
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  useEffect(() => {
    getExamTemplate()
  }, [])
  const handleClick = async (template: ExamTemplateListItem) => {
    if (!template.isBuy) {
      setIsBuyModalVisible(true)
      return
    }
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
        intro: "第一次创建测评，需要先在此添加人员哦～",
        position: "bottom",
      }]
      getIsGuide(setsArr, 1)
    }
  }, [getExamTemplateArr])
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
            const qcp_user = JSON.parse(window.sessionStorage.getItem('QCP_User') || '{}');
            Modal.confirm({
              title: '确认发送',
              content: `消息将发送给${candidates.title}`,
              okText: '确认', onOk: async () => {
                const msg = {
                  msgtype: "link",
                  link: {
                    messageUrl: `${window.location.origin}/?corpId=${corpId}&appId=${appId}&clientId=${clientId}#/user/login`,
                    image: "http://qzz-static.forwe.store/evaluation-mng/imgs/%E8%B6%A3%E6%B5%8B%E8%AF%84logo2.png",
                    title: "您有一份测评待完成",
                    text: "全抖音1亿用户都在玩的性格测评，赶紧测一测吧！"
                  }
                }
                const res = await shareInfo({ cid: candidates.cid, message: JSON.stringify(msg), userId: initialState?.user?.userId || qcp_user?.userId });
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
  // 没有购买弹窗提示
  const handleOk = () => {
    // setIsBuyModalVisible(false)
    dd.env.platform != 'notInDingTalk' && dd.biz.util.invokeWorkbench({
      app_url: 'https://h5.dingtalk.com/open-market/share.html?shareGoodsCode=D34E5A30A9AC7FC63FE9AA1FB5D7DFC882653BC130D98DC599D1E334FC2D720DBBD3FB0872C1D1E6&token=6283956d3721d4ba717dd18e362e5a70&shareUid=383B86070279D64685AA4989BCA9F331&dtaction=os',
      app_info: {
        app_refresh_if_exist: true,
        app_active_if_exist: true
      },
      onSuccess: function (res) {
        // 调用成功时回调
        console.log(res)
      },
      onFail: function (err) {
        // 调用失败时回调
        console.log(err)
      }
    });
  }
  // 获取测评模板
  const getExamTemplate = async () => {
    const res = await getExamTemplateList();
    if (res.code == 1) {
      setGetExamTemplateArr(res.data)
    }
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
      <div className={styles.card_layout}>
        {
          getExamTemplateArr?.map((item: ExamTemplateListItem, index: number) => (
            <div key={item.id} className={styles.card_wrapper} >
              {!item.isBuy && <div onClick={() => setIsBuyModalVisible(true)} className={styles.obscuration}>点我进行解锁</div>}
              <div className={styles.card_content} >
                <div className={styles.card_top} onClick={() => {
                  setSelected(item);
                  setImg(JSON.parse(item.introductionImage).admin);
                  setVisible(true);
                }}>
                  <header>{item.title}</header>
                  <main>
                    <div>{item.introduction}</div>
                    <p>作答时间：<span>{item.durationDesc}</span></p>
                    <p>题目数量：<span>{item.examLibrarySum}</span></p>
                  </main>
                </div>
                <footer onClick={() => handleClick(item)} className={`add_people${index}`}>添加人员</footer>
              </div>
            </div>
          ))
        }
      </div>

      {/* <ProList<ExamTemplateListItem>
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
      /> */}
      <Modal width={400} footer={footerLayout()} visible={isModalVisible} onCancel={() => setIsModalVisible(false)}>
        <Result
          status="success"
          title="创建成功"
          style={{ padding: 0 }}
        />
      </Modal>
      <Modal title="温馨提示" okText="点我跳应用市场" visible={isBuyModalVisible} onOk={handleOk} onCancel={() => setIsBuyModalVisible(false)}>
        <div className={styles.no_buy}>
          <Image
            width={200}
            src="//qzz-static.forwe.store/evaluation-mng/imgs/nanshan_.jpg"
          />
          <p>请到应用市场升级版本，或联系客服咨询。</p>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default ExamTemplate;
