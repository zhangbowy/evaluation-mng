import { Breadcrumb } from 'antd'
import React from 'react'
import styles from './index.module.less'
import Library from '@/page/evaluation/library'

const index = () => {
    return (
        <div className={styles.management_library_layout}>
            <Breadcrumb separator=">" className={styles.management_library_nav}>
                <Breadcrumb.Item href="#/evaluation/management">盘点测评</Breadcrumb.Item>
                <Breadcrumb.Item>测评库</Breadcrumb.Item>
            </Breadcrumb>
            <Library type={1} />
        </div>
    )
}

export default index