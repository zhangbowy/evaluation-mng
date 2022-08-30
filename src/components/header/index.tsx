import { Button } from 'antd';
import React, { memo, useContext, useEffect, useState } from 'react'
import styles from './index.module.less';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getPointAsset } from '@/api/api'
import { CountContext } from '@/utils/context';
import { getAllUrlParam } from '@/utils/utils';


const Header = memo(() => {
  const user = JSON.parse(sessionStorage.getItem('QCP_B_USER') || '{}');
  const history = useNavigate()
  const { state } = useContext(CountContext)
  const { appId } = getAllUrlParam()

  // 去充值
  const goRecharge = () => {
    history('/evaluation/recharge')
  }
  // 大屏点击
  const largeScreen = () => {
    console.log(111);
  }
  return (
    <div className={styles.header_layout}>
      <div className={styles.header_left}>
        {
          appId.split('_')[0] === '1' ? <>
            <label>可用点券</label>
            <label>{state}</label>
            <Button type='primary' onClick={goRecharge}>去充值</Button>
          </>
            : <Button type='primary' onClick={largeScreen}>团队测评分析</Button>
        }
      </div>
      <div className={styles.header_right}>
        {
          user?.avatar ? <img src={user?.avatar} alt="" /> : <div>{user?.name?.slice(0, 1)}</div>
        }
      </div>
    </div>
  )
})
Header.displayName = 'Header'
export default Header