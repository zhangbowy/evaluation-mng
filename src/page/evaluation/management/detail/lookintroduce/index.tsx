import Loading from '@/components/loading'
import { Drawer } from 'antd'
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import styles from './index.module.less'

const LookIntroduce = forwardRef((props, ref) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [introduceImg, setIntroduceImg] = useState<string>()
    useImperativeHandle(ref, () => ({
        onOpenDrawerClick,
    }))
    // 关闭弹窗
    const onDrawerClose = () => {
        setVisible(false)
    }
    // 打开
    const onOpenDrawerClick = (item: IMeasurement) => {
        setVisible(true)
        setIntroduceImg(item.introductionImage.admin)
    }
    return (
        <Drawer title="详情介绍" placement="right" onClose={onDrawerClose} visible={visible}>
            {introduceImg ? <img className={styles.introduce_img} src={introduceImg} alt="" /> : <Loading />}
        </Drawer>
    )
})
LookIntroduce.displayName = 'LookIntroduce'
export default LookIntroduce
