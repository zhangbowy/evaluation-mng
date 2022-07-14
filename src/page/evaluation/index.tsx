import React, { createContext, FC, Fragment, Suspense, useCallback, useEffect, useState } from 'react'
import { Layout, message } from 'antd';
import styles from './index.module.less'
import Menu from '../../components/menu'
import { Outlet, useLocation, useNavigate } from 'react-router';
import Header from '../../components/header'
import Loading from '@/components/loading';
import { useSearchParams } from 'react-router-dom';
import { getPointAsset, getSign } from '@/api/api';
import dd from 'dingtalk-jsapi';
import { MyContext, CountContext } from '@/utils/context'
import { getAllUrlParam } from '@/utils/utils';


const { Sider, Content } = Layout;
const EvaluationLayout: FC = () => {
  const [ddConfig, setDdConfig] = useState<boolean>(false)
  const [isPackUp, setIsPackUp] = useState<boolean>(false)
  const [couponsNum, setCouponsNum] = useState<number>(0)
  const { corpId, appId } = getAllUrlParam()
  useEffect(() => {
    getAllCoupons()
  }, [])
  useEffect(() => {
    !ddConfig && (async () => {
      const res = await getSign(window.location.href.split('#')[0]);
      if (res.code === 1 && dd.env.platform != 'notInDingTalk') {
        dd.config({
          agentId: res.data.agentId, // 必填，微应用ID
          corpId: res.data.corpId, //必填，企业ID
          timeStamp: res.data.timeStamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，自定义固定字符串。
          signature: res.data.signature, // 必填，签名
          type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
          jsApiList: [
            'biz.contact.complexPicker',
            'biz.contact.choose',
            'biz.chat.pickConversation',
            'biz.util.openSlidePanel',
            'biz.customContact.multipleChoose'
          ], // 必填，需要使用的jsapi列表，注意：不要带dd。
          onSuccess: () => {
            setDdConfig(true)
          },
          onFail: (err: Error) => {
            console.log(err, '注册失败')
          }
        });
      }
    })()
  }, [])
  // 获取所有点券
  const getAllCoupons = async () => {
    const params = {
      tpf: 1,
      appId,
      corpId
    }
    const res = await getPointAsset(params)
    if (res.code == 1) {
      setCouponsNum(res.data.amount)
    }
  }
  return (
    <div className={styles.evaluation_layout}>
      <Layout style={{ height: '100%' }}>
        <Sider width={`${!isPackUp ? 240 : 80}px`} className={styles.evaluation_sider}>
          <MyContext.Provider value={{ state: isPackUp, dispatch: setIsPackUp }}>
            <Menu handelPackUp={() => setIsPackUp(!isPackUp)} />
          </MyContext.Provider>
        </Sider>
        <Layout>
          <CountContext.Provider value={{ state: couponsNum, dispatch: getAllCoupons }}>
            <Header />
            <Content className={styles.evaluation_content}>
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
            </Content>
          </CountContext.Provider>
        </Layout>
      </Layout>
    </div>
  )
}

export default EvaluationLayout