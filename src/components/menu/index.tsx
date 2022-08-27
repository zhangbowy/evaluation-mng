import React, { Fragment, useState, useContext, useEffect, useRef, useMemo } from 'react'
import styles from './index.module.less'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AppstoreAddOutlined, DownOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import { MyContext } from '@/utils/context'
import { getMenu } from '@/api/api'
import { getAllUrlParam } from '@/utils/utils';

type IMenuProps = {
    handelPackUp: () => void
}
type IPackUpStyleBack = {
    overflow: string;
    height: string;
}
const Menu = (props: IMenuProps) => {
    const [authMenuKey, setAuthMenuKey] = useState<string[]>([]);
    const { appId } = getAllUrlParam()
    const menuList: IMenuItem[] = [
        {
            id: 6,
            name: '招聘测评',
            icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_icon_people.svg',
            path: '/evaluation/recruitEvaluation',
            authKey: 'EVAL_RECRUITMENT'
        },
        {
            id: 0,
            name: '盘点测评',
            icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_evaluation.svg',
            path: '/evaluation/management',
            authKey: 'EVAL_EXAM'
        },
        {
            id: 1,
            name: '人才报告',
            icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_people.svg',
            path: '/evaluation/peopleReport',
            authKey: 'EVAL_REPORT'
        },
        {
            id: 2,
            name: '测评库',
            icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_library.svg',
            path: '/evaluation/library',
            authKey: 'EVAL_TEMPLATE'
        },
        {
            id: 7,
            name: '人才画像',
            icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_jurisdiction.svg',
            path: '/evaluation/portrait',
            children: [
                {
                    id: 8,
                    name: '价值观画像',
                    path: '/evaluation/portrait/worth',
                    icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_setting.svg'
                },
                {
                    id: 9,
                    name: '岗位画像',
                    path: '/evaluation/portrait/post',
                    icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_setting.svg'
                },
            ]
        },
        {
            id: 10,
            name: '员工管理',
            icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_library.svg',
            path: '/evaluation/employee'
        },
        {
            id: 3,
            name: '权限管理',
            icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_jurisdiction.svg',
            path: '/evaluation/userAuthority',
            authKey: 'EVAL_AUTH',
            children: [
                {
                    id: 4,
                    name: '账号管理',
                    path: '/evaluation/userAuthority/account',
                    icon: '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_menu_setting.svg',
                    authKey: 'EVAL_AUTH_MNG'
                }
            ]
        }
    ]
    const authMenuList: IMenuItem[] = useMemo(() => {
        if (authMenuKey.length > 0) {
            const list: IMenuItem[] = menuList.filter(v => (authMenuKey.includes(v.authKey)));
            return list;
        }
        return [];
    }, [authMenuKey]);
    const couponsIcon = '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_icon_coupons.svg'
    const logo = '//qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_logo.svg'
    const navigate = useNavigate()
    const { state, dispatch } = useContext(MyContext)
    const [isRotate, setIsRotate] = useState<boolean>(false); // 是否旋转
    const [curIsRotate, setCurIsRotate] = useState<any>({});
    const locationInfo = useLocation()
    const packUpStyle = (id: number): IPackUpStyleBack => ({
        overflow: curIsRotate[id] ? 'visible' : 'hidden',
        height: curIsRotate[id] ? '100%' : '40px'
    })
    useEffect(() => {
        window.addEventListener('resize', resizeFn)
        return () => window.removeEventListener('resize', resizeFn)
    }, [])
    useEffect(() => {
        getMenu({
            tpf: 1,
            appId: appId
        }).then(res => {
            const { code, data } = res;
            if (code === 1) {
                const keys = data.map((v: any) => v.authKey);
                setAuthMenuKey(keys);
            } else {
                setAuthMenuKey([]);
            }
        })
    }, []);
    const resizeFn = (e: Event) => {
        document.body.clientWidth < 1025 && onPackUpClick()
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
            // setIsRotate(!isRotate);
            setCurIsRotate({ ...curIsRotate, [item.id]: !curIsRotate[item.id] })
        }
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
            // <div className={styles.menu_twoWrapper} style={{ overflow: curIsRotate[item.id] ? 'visible' : 'hidden' }}></div>
            <div className={styles.menu_twoWrapper} >
                <div className={`${styles.menu_level}`} onClick={() => handleClick(item)}>
                    <div className={styles.menu_icon}>
                        <img src={item.icon} className={styles.menu_icon_color} />
                    </div>
                    <span className={styles.menu_title}>{item.name}</span>
                    <DownOutlined className={styles.menu_down} style={{ transform: `translateY(-50%) rotate(${curIsRotate[item.id] ? '180deg' : '0deg'})` }} />
                </div>
                <div className={styles.menu_twoTitle} style={{ height: curIsRotate[item.id] ? '100%' : '0' }}>
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
