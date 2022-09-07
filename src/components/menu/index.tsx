import React, { Fragment, useState, useContext, useEffect, useRef, useMemo } from 'react'
import styles from './index.module.less'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AppstoreAddOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Divider, Popover } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import { MyContext } from '@/utils/context'
import { getMenu } from '@/api/api'
import { getAllUrlParam, getAppIdType } from '@/utils/utils';
import ModalScreen from '@/components/modalScreen';

type IMenuProps = {
    handelPackUp: () => void
}
type IPackUpStyleBack = {
    overflow: string;
    height: string;
}
const Menu = (props: IMenuProps) => {
    const [authMenuKey, setAuthMenuKey] = useState<string[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const { appId } = getAllUrlParam()
    const appType = getAppIdType();
    const menuList: IMenuItem[] = [
        {
            id: 6,
            name: '招聘测评',
            icon: 'icon-zhaopinceping',
            path: '/evaluation/recruitEvaluation',
            authKey: 'EVAL_RECRUITMENT'
        },
        {
            id: 0,
            name: '盘点测评',
            icon: 'icon-cepingguanli',
            path: '/evaluation/management',
            authKey: 'EVAL_EXAM'
        },
        {
            id: 1,
            name: '人才报告',
            icon: 'icon-rencaibaogao',
            path: '/evaluation/peopleReport',
            authKey: 'EVAL_REPORT'
        },
        {
            id: 2,
            name: '测评库',
            icon: 'icon-cepingku',
            path: '/evaluation/library',
            authKey: 'EVAL_TEMPLATE'
        },
        {
            id: 7,
            name: '画像管理',
            icon: 'icon-yonghuhuaxiang',
            path: '/evaluation/portrait',
            authKey: 'EVAL_TALENT_PORTRAIT',
            children: [
                {
                    id: 8,
                    name: '价值观画像',
                    path: '/evaluation/portrait/worth',
                    icon: 'icon-jiazhiguan',
                },
                {
                    id: 9,
                    name: '岗位画像',
                    path: '/evaluation/portrait/post',
                    icon: 'icon-gangweihuaxiang',
                },
            ]
        },
        {
            id: 10,
            name: '员工管理',
            icon: 'icon-quanxianguanli',
            path: '/evaluation/employee',
            authKey: 'EVAL_USER_MANT',
        },
        {
            id: 3,
            name: '权限管理',
            icon: 'icon-quanxianguanli',
            path: '/evaluation/userAuthority',
            authKey: 'EVAL_AUTH',
            children: [
                {
                    id: 4,
                    name: '账号管理',
                    path: '/evaluation/userAuthority/account',
                    icon: 'icon-shezhi',
                    authKey: 'EVAL_AUTH_MNG'
                }
            ]
        }
    ]
    const authMenuList: IMenuItem[] = useMemo(() => {
        if (authMenuKey.length > 0) {
            const list: IMenuItem[] = menuList.filter(v => (authMenuKey.includes(v.authKey || '')));
            return list;
        }
        return [];
    }, [authMenuKey]);
    const couponsIcon = '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_icon_coupons.svg'
    const logo = appType === '2'
        ? '//qzz-static.forwe.store/evaluation-web/imgs/xdjy/xdjy_logo.png'
        : '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_logo.svg'
    const largeImg = 'https://qzz-static.forwe.store/evaluation-mng/imgs/xjdy_img5_largeScreen_large.png';
    const smallImg = 'https://qzz-static.forwe.store/evaluation-mng/imgs/xjdy_img5_largeScreen_small.png';
    const navigate = useNavigate()
    const { state, dispatch } = useContext(MyContext)
    const [isRotate, setIsRotate] = useState<boolean>(false); // 是否旋转
    const [curIsRotate, setCurIsRotate] = useState<any>({});
    const locationInfo = useLocation()
    const packUpStyle = (id: number): IPackUpStyleBack => ({
        overflow: curIsRotate[id] ? 'visible' : 'hidden',
        height: curIsRotate[id] ? '100%' : '40px'
    })
    const imgStyle = {
        backgroundColor: '#2B85FF',
        borderRadius: '5px',
        padding: '3px'
    }
    useEffect(() => {
        getCurMenu()
        window.addEventListener('resize', resizeFn)
        return () => window.removeEventListener('resize', resizeFn)
    }, [])
    // 获取当前侧边栏数据
    const getCurMenu = async () => {
        const res = await getMenu({
            tpf: 1,
            appId: appId
        })
        const { code, data } = res;
        if (code === 1) {
            const keys = data.map((v: any) => v.authKey);
            setAuthMenuKey(keys);
        } else {
            setAuthMenuKey([]);
        }
    }
    const resizeFn = (e: Event) => {
        document.body.clientWidth < 1280 && onPackUpClick()
    }
    // 节点点击
    const oneElementClick = (item: IMenuItem) => {
        navigate(item.path)
    }
    // 是否高亮
    const isHighLight = (item: IMenuItem) => {
        return locationInfo.pathname.indexOf(item.path) > -1
    }
    // 下拉菜单
    const handleClick = (item: IMenuItem) => {
        // if (state) {
        //     const path: string = (item.children as IMenuItem[])[0].path
        //     navigate(path)
        // } else {
        // setIsRotate(!isRotate);
        !state && setCurIsRotate({ ...curIsRotate, [item.id]: !curIsRotate[item.id] })
        // }
    }
    // 去充值
    const goRecharge = () => {
        navigate('/evaluation/recharge')
    }
    // 收起菜单
    const onPackUpClick = async () => {
        // setIsRotate(false)
        await setCurIsRotate({})
        dispatch(!state)
    }
    // 一级节点
    const oneElement = (item: IMenuItem) => {
        return (
            <div onClick={() => oneElementClick(item)} className={`${styles.menu_level}  ${isHighLight(item) && styles.menu_level_active}`}>
                {/* <div className={styles.menu_icon}> */}
                <i className={`iconfont ${item.icon}`} />
                {/* <img src={item.icon} className={styles.menu_icon_color} /> */}
                {/* </div> */}
                <span className={styles.menu_title}>{item.name}</span>
            </div>
        )
    }
    // 二级节点
    const twoElement = (item: IMenuItem) => {
        return (
            // <div className={styles.menu_twoWrapper} style={{ overflow: curIsRotate[item.id] ? 'visible' : 'hidden' }}></div>
            <div className={`${styles.menu_twoWrapper}  ${isHighLight(item) && state && styles.menu_level_active}`} >
                <Popover
                    content={
                        <Fragment>
                            {state && item.children!.map((item: IMenuItem) =>
                                <div className={styles.menu_hoverName} onClick={() => oneElementClick(item)} key={item.id}>
                                    <i className={`iconfont ${item.icon}`} />{item.name}
                                </div>)
                            }
                        </Fragment>
                    }
                    trigger='hover'
                    placement='right'
                >
                    <div className={`${styles.menu_level}`} onClick={() => handleClick(item)}>
                        {/* <div className={styles.menu_icon}> */}
                        {/* <img src={item.icon} className={styles.menu_icon_color} /> */}
                        <i className={`iconfont ${item.icon}`} />
                        {/* </div> */}
                        <span className={styles.menu_title}>{item.name}</span>

                        <i className={`iconfont icon-jiantouxia ${styles.menu_down}`} style={{ transform: `translateY(-50%) rotate(${curIsRotate[item.id] ? '180deg' : '0deg'})` }} />
                    </div>
                </Popover>
                <div className={styles.menu_twoTitle} style={{ height: curIsRotate[item.id] ? '100%' : '0' }}>
                    {item.children!.map((res: IMenuItem) => <Fragment key={res.id}>{oneElement(res)}</Fragment>)}
                </div>
            </div>
        )
    }
    // 打开大屏弹窗
    const openModal = () => {
        setVisible(true);
    }
    // 关闭大屏弹窗
    const closeModal = () => {
        setVisible(false);
    }
    return (
        <div className={!state ? styles.menu_default_layout : styles.menu_packUp_layout}>
            <div>
                <header>

                    <img style={appType === '1' ? imgStyle : {}} src={logo} alt="" />
                    <span>{appType === '1' ? '趣测评管理后台' : '招才选将'}</span>
                </header>
                <main>
                    {
                        authMenuList.map(res => (
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
            <footer>
                {
                    appId.split('_')[0] === '1' ?
                        <div className={styles.menu_recharge} onClick={goRecharge}>
                            <div className={styles.footer_couponsIcon}>
                                <img src={couponsIcon} />
                            </div>
                            <span>点券充值</span>
                        </div>
                        : <div className={styles.bottomImg} onClick={openModal}>
                            <img src={!state ? largeImg : smallImg} alt="" />
                        </div>

                }
                <Divider />
                <MenuFoldOutlined onClick={onPackUpClick} className={styles.packUp} />
            </footer>
            <ModalScreen visible={visible} closeModal={closeModal} />
        </div>
    )
}


export default Menu
