import { Button } from 'antd';
import React, { Fragment, memo, useContext, useEffect, useState } from 'react'
import styles from './index.module.less';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getPointAsset } from '@/api/api'
import { CountContext } from '@/utils/context';
import { getAllUrlParam } from '@/utils/utils';
import ModalScreen from '../modalScreen';


const Header = memo(() => {
  const [visible, setVisible] = useState(false);
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
    setVisible(true);
  }
  const closeModal = () => {
    setVisible(false);
  }
  return (
    // <div className={styles.header_layout}>
    <Fragment>
      <div className={styles.header_left}>
        {
          appId.split('_')[0] === '1' && <>
            <label>可用点券</label>
            <label>{state}</label>
            <Button type='primary' onClick={goRecharge}>去充值</Button>
          </>
          //  <Button type='primary' onClick={largeScreen}>团队数字大屏</Button>
        }
      </div>
      <div className={styles.header_right}>
        {
          user?.avatar ? <img src={user?.avatar} alt="" /> : <div>{user?.name?.slice(0, 1)}</div>
        }
      </div>
      <ModalScreen visible={visible} closeModal={closeModal} />
    </Fragment>

    // </div>
  )
})
Header.displayName = 'Header'
export default Header