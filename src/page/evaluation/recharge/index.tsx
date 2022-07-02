import { Button, Tabs } from 'antd'
import React, { useEffect } from 'react'
import styles from './index.module.less'
import TopUpTable from './topupTable';
import ConsumeTable from './consumeTable'
import { TabsArr } from './type';

const { TabPane } = Tabs;
const Recharge = () => {
  const coupon01 = '//qzz-static.forwe.store/evaluation-mng/imgs/qcc_mng_coupon01.png'
  const coupon02 = '//qzz-static.forwe.store/evaluation-mng/imgs/qcc_mng_coupon02.png'
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
  // tab切换
  const onTabChange = (key: string) => {
    console.log(key);
  }
  return (
    <div className={styles.recharge_layout}>
      <header>点券充值</header>
      <aside>
        <div className={styles.recharge_bgLeft}>
          <img src={coupon01} alt="" />
          <div>
            <p>10000</p>
            <small>可用点券</small>
          </div>
          <button className={styles.recharge_btn}>点我充值</button>
        </div>
        <img src={coupon02} alt="" />
      </aside>
      <main>
        <Tabs defaultActiveKey={tabArr[0].key} onChange={onTabChange}>
          {
            tabArr.map((item: TabsArr) => (
              <TabPane tab={item.title} key={item.key}>{item.content}</TabPane>
            ))
          }
        </Tabs>
      </main>
    </div>
  )
}

export default Recharge