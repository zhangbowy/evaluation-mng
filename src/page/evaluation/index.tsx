import React, { FC, Fragment, Suspense, useEffect, useState } from 'react'
import { Layout, message } from 'antd';
import styles from './index.module.less'
import Menu from '../../components/menu'
import { Outlet, useLocation, useNavigate } from 'react-router';
import Header from '../../components/header'
import Loading from '@/components/loading';
import { useSearchParams } from 'react-router-dom';
import { getSign } from '@/api/api';
import dd from 'dingtalk-jsapi';

const { Sider, Content } = Layout;
const EvaluationLayout: FC = () => {
  const navigate = useNavigate()
  const logo = '//qzz-static.forwe.store/evaluation-mng/imgs/%E8%B6%A3%E6%B5%8B%E8%AF%84logo2.png'
  const [ddConfig, setDdConfig] = useState<boolean>(false)
  useEffect(() => {
    ddConfig && (async () => {
      const res = await getSign(window.location.href.split('#')[0]);
      if (res.code === 1 && dd.env.platform != 'notInDingTalk') {
        dd.config({
          agentId: res.data.agentId, // 必填，微应用ID
          corpId: res.data.corpId, //必填，企业ID
          timeStamp: res.data.timeStamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，自定义固定字符串。
          signature: res.data.signature, // 必填，签名
          type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
          jsApiList: ['biz.contact.complexPicker', 'biz.contact.choose', 'biz.chat.pickConversation', 'biz.util.openSlidePanel'], // 必填，需要使用的jsapi列表，注意：不要带dd。
          onSuccess: () => {
            setDdConfig(true)
          },
        });
      }
    })()
  }, [location.pathname])
  // 去充值
  const goRecharge = () => {
    navigate('/evaluation/recharge')
  }
  return (
    <div className={styles.evaluation_layout}>
      <Layout style={{ height: '100%' }}>
        {/* <Sider collapsible width="240" className={styles.evaluation_sider}> */}
        <Sider width="240" className={styles.evaluation_sider}>
          <div>
            <div className={styles.evaluation_sider_title}>
              <img src={logo} alt="" />
              <span>趣测评管理后台</span>
            </div>
            <Menu />
          </div>
          <div className={styles.evaluation_sider_footer} onClick={goRecharge}>
            <img src={logo} alt="" />
            <span>点券充值</span>
          </div>
        </Sider>
        <Layout>
          <Header />
          <Content className={styles.evaluation_content}>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default EvaluationLayout