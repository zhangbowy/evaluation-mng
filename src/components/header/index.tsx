import { Button } from 'antd';
import React, { useState } from 'react'
import styles from './index.module.less';
import {useNavigate} from 'react-router-dom'


const Header = () => {
  const user = JSON.parse(sessionStorage.getItem('QCP_USER') || '{}');
  const history = useNavigate()
  // 去充值
  const goRecharge = () =>{
    history('/evaluation/recharge')
  }
  return (
    <div className={styles.header_layout}>
      <div className={styles.header_left}>
        <label>可用点券</label>
        <label>10000</label>
        <Button type='primary' onClick={goRecharge}>去充值</Button>
      </div>
      <div className={styles.header_right}>
        {
          user.avatar ? <img src={user?.avatar} alt="" /> : <div>{user.name?.slice(0, 1)}</div>
        }
      </div>
    </div>
  )
}

export default Header