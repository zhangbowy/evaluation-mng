import { Button, Tabs } from 'antd'
import React, { memo, useContext, useEffect } from 'react'
import styles from './index.module.less'
import TopUpTable from './topupTable';
import ConsumeTable from './consumeTable'
import { TabsArr } from './type';
import { CountContext } from '@/utils/hook';
import { useSearchParams } from 'react-router-dom';
import { getRechargeUrl } from '@/api/api';
import dd from 'dingtalk-jsapi';
import { getAllUrlParam } from '@/utils/utils';

const { TabPane } = Tabs;
const Recharge = memo(() => {
  const coupon01 = '//qzz-static.forwe.store/evaluation-mng/imgs/qcc_mng_coupon01.png'
  const coupon02 = '//qzz-static.forwe.store/evaluation-mng/imgs/qcc_mng_coupon02.png'
  const { corpId, appId } = getAllUrlParam()
  const { state } = useContext(CountContext)
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
      outSkuId: 'DT_GOODS_881656505125058'
    }
    const res = await getRechargeUrl(params)
    if (res.code == 1) {
      const url = JSON.parse(res.data || '{}')?.result
      console.log(url)
      dd.env.platform != 'notInDingTalk' &&
        dd.ready(() => {
          dd.biz.util.openSlidePanel({
            url, //打开侧边栏的url
            title: '支付', //侧边栏顶部标题
            onSuccess: function () {
              /*
                   调用biz.navigation.quit接口进入onSuccess, result为调用biz.navigation.quit传入的数值
               */
            },
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

export default Recharge