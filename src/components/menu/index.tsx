import React, { Fragment, useState } from 'react'
import styles from './index.module.less'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AppstoreAddOutlined, DownOutlined } from '@ant-design/icons';

const Menu = () => {
  const menuList: IMenuItem[] = [
    {
      id: 0,
      name: '测评管理',
      icon: 'icon-zhuye',
      path: '/evaluation/management'
    },
    {
      id: 1,
      name: '人才报告',
      icon: 'icon-zhuye',
      path: '/evaluation/peopleReport'
    },
    {
      id: 2,
      name: '测评库',
      icon: 'icon-zhuye',
      path: '/evaluation/library'
    },
    {
      id: 3,
      name: '权限管理',
      icon: 'icon-zhuye',
      path: '/evaluation/userAuthority',
      children: [
        {
          id: 4,
          name: '账户管理',
          path: '/evaluation/userAuthority/account',
        }
      ]
    }
  ]
  const history = useNavigate()
  const [isRotate, setIsRotate] = useState<boolean>(false); // 是否旋转
  const locationInfo = useLocation()
  const downStyle = {
    transform: `translateY(-50%) rotate(${isRotate ? '180deg' : '0deg'})`
  }
  // 节点点击
  const oneElementClick = (item: IMenuItem) => {
    history(item.path)
  }
  // 是否高亮
  const isHighLight = (item: IMenuItem) => {
    return item.path == locationInfo.pathname
  }
  // 下拉菜单
  const handleClick = () => {
    setIsRotate(!isRotate);
  }
  // 一级节点
  const oneElement = (item: IMenuItem) => {
    return (
      <div onClick={() => oneElementClick(item)} className={`${styles.menu_level}  ${isHighLight(item) && styles.menu_level_active}`} >
        {/* <i className={`iconfont ${res.icon}`}></i> */}
        <AppstoreAddOutlined className={styles.menu_icon} />
        <span className={styles.menu_title}>{item.name}</span>
      </div>
    )
  }
  // 二级节点
  const twoElement = (item: IMenuItem) => {
    return (
      <div className={styles.menu_twoWrapper} style={{ overflow: isRotate ? 'visible' : 'hidden' }}>
        <div className={`${styles.menu_level}`} onClick={handleClick}>
          <AppstoreAddOutlined className={styles.menu_icon} />
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
    <div className={styles.menu_layout}>
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
    </div>
  )
}

export default Menu