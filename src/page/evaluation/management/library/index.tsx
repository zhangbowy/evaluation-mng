import { Breadcrumb } from 'antd'
import React from 'react'
import styles from './index.module.less'
import Library from '@/page/evaluation/library'

const index = () => {
    return (
        <div className={styles.management_library_layout}>
            <Breadcrumb separator=">" className={styles.management_library_nav}>
                <Breadcrumb.Item href="#/evaluation/management">测评管理</Breadcrumb.Item>
                <Breadcrumb.Item>测评库</Breadcrumb.Item>
            </Breadcrumb>
            <Library />
        </div>
    )
}

export default index