import { Button, Modal, Tabs } from 'antd'
import React, { memo, useContext, useEffect } from 'react'
import styles from './index.module.less'
import TopUpTable from './topupTable';
import ConsumeTable from './consumeTable'
import { TabsArr } from './type';
import { CountContext } from '@/utils/context';
import { useSearchParams } from 'react-router-dom';
import { getRechargeUrl } from '@/api/api';
import dd from 'dingtalk-jsapi';
import { getAllUrlParam } from '@/utils/utils';

const { TabPane } = Tabs;
const Recharge = memo(() => {
  const coupon01 = '//qzz-static.forwe.store/evaluation-mng/imgs/qcc_mng_coupon01.png'
  const coupon02 = '//qzz-static.forwe.store/evaluation-mng/imgs/qcc_mng_coupon02.png'
  const { corpId, appId } = getAllUrlParam()
  const { state, dispatch } = useContext(CountContext)
  const tabArr: TabsArr[] = [
    {
      title: '点券消耗记录',
      key: '1',
      content: <ConsumeTable />
    }, {
      title: '点券充值记录',
      key: '2',
      content: <TopUpTable />
    }
  ]
  // 点我充值
  const onRechargeClick = async () => {
    const params = {
      tpf: 1,
      corpId,
      appId,
      outSkuId: import.meta.env.VITE_COMMODITY_CODE || '0'
    }

    const res = await getRechargeUrl(params)
    if (res.code == 1) {
      const url = JSON.parse(res.data || '{}')?.result
      Modal.warning({
        title: '温馨提示',
        content: '请确保充值后，点击确定按钮，刷新点券，完成支付，否则无法充值成功',
        okText: '确认',
        onOk: (cancel) => {
          cancel()
          dispatch()
        }
      })
      dd.env.platform != 'notInDingTalk' &&
        dd.ready(() => {
          dd.biz.util.openSlidePanel({
            url, //打开侧边栏的url
            title: '支付', //侧边栏顶部标题
            onFail: function (err: Error) {
              console.log(err, '关闭弹窗')
            }
          })
        })
    }
  }
  return (
    <div className={styles.recharge_layout}>
      <header>点券充值</header>
      <aside>
        <div className={styles.recharge_bgLeft}>
          <img src={coupon01} alt="" />
          <div>
            <p>{state}</p>
            <small>可用点券</small>
          </div>
          <button onClick={onRechargeClick} className={styles.recharge_btn}>点我充值</button>
        </div>
        <img src={coupon02} alt="" />
      </aside>
      <main>
        <Tabs defaultActiveKey={tabArr[0].key}>
          {
            tabArr.map((item: TabsArr) => (
              <TabPane tab={item.title} key={item.key}>{item.content}</TabPane>
            ))
          }
        </Tabs>
      </main>
    </div>
  )
})
Recharge.displayName = 'Recharge'
export default Recharge