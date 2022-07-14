import React, { Fragment, useState, useContext } from 'react'
import styles from './index.module.less'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AppstoreAddOutlined, DownOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import { MyContext } from '@/utils/context'
type IMenuProps = {
  handelPackUp: () => void
}
const Menu = (props: IMenuProps) => {
  const menuList: IMenuItem[] = [
    {
      id: 0,
      name: '测评管理',
      icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_evaluation.svg',
      path: '/evaluation/management'
    },
    {
      id: 1,
      name: '人才报告',
      icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_people.svg',
      path: '/evaluation/peopleReport'
    },
    {
      id: 2,
      name: '测评库',
      icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_library.svg',
      path: '/evaluation/library'
    },
    {
      id: 3,
      name: '权限管理',
      icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_jurisdiction.svg',
      path: '/evaluation/userAuthority',
      children: [
        {
          id: 4,
          name: '账号管理',
          path: '/evaluation/userAuthority/account',
          icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_setting.svg'
        }
      ]
    }
  ]
  const couponsIcon = '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_icon_coupons.svg'
  const logo = '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_logo.svg'
  const navigate = useNavigate()
  const { state, dispatch } = useContext(MyContext)
  const [isRotate, setIsRotate] = useState<boolean>(false); // 是否旋转
  const locationInfo = useLocation()
  const downStyle = {
    transform: `translateY(-50%) rotate(${isRotate ? '180deg' : '0deg'})`
  }
  // 节点点击
  const oneElementClick = (item: IMenuItem) => {
    navigate(item.path)
  }
  // 是否高亮
  const isHighLight = (item: IMenuItem) => {
    return item.path == locationInfo.pathname
  }
  // 下拉菜单
  const handleClick = (item: IMenuItem) => {
    if (state) {
      const path: string = (item.children as IMenuItem[])[0].path
      navigate(path)
    } else {
      setIsRotate(!isRotate);
    }
  }
  // 去充值
  const goRecharge = () => {
    navigate('/evaluation/recharge')
  }
  // 收起菜单
  const onPackUpClick = () => {
    setIsRotate(false)
    dispatch(!state)
  }
  // 一级节点
  const oneElement = (item: IMenuItem) => {
    return (
      <div onClick={() => oneElementClick(item)} className={`${styles.menu_level}  ${isHighLight(item) && styles.menu_level_active}`} >
        <div className={styles.menu_icon}>
          <img src={item.icon} className={styles.menu_icon_color} />
        </div>
        <span className={styles.menu_title}>{item.name}</span>
      </div>
    )
  }
  // 二级节点
  const twoElement = (item: IMenuItem) => {
    return (
      <div className={styles.menu_twoWrapper} style={{ overflow: isRotate ? 'visible' : 'hidden' }}>
        <div className={`${styles.menu_level}`} onClick={() => handleClick(item)}>
          <div className={styles.menu_icon}>
            <img src={item.icon} className={styles.menu_icon_color} />
          </div>
          <span className={styles.menu_title}>{item.name}</span>
          <DownOutlined className={styles.menu_down} style={downStyle} />
        </div>
        <div className={styles.menu_twoTitle} >
          {item.children!.map((res: IMenuItem) => <Fragment key={res.id}>{oneElement(res)}</Fragment>)}
        </div>
      </div>
    )
  }
  return (
    <div className={!state ? styles.menu_default_layout : styles.menu_packUp_layout}>
      <div>
        <header>
          <img src={logo} alt="" />
          <span>趣测评管理后台</span>
        </header>
        <main>
          {
            menuList.map(res => (
              <Fragment key={res.id}>
                {res.children ?
                  twoElement(res) :
                  oneElement(res)
                }
              </Fragment>
            ))
          }
        </main>
      </div>
      <footer >
        <div className={styles.menu_recharge} onClick={goRecharge}>
          <div className={styles.footer_couponsIcon}>
            <img src={couponsIcon} />
          </div>
          <span>点券充值</span>
        </div>
        <Divider />
        <MenuFoldOutlined onClick={onPackUpClick} className={styles.packUp} />
      </footer>
    </div>
  )
}


export default Menu