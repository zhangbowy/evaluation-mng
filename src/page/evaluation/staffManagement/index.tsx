import React, { FC, Fragment, useEffect, useState } from 'react';
import { Button } from 'antd';
import styles from './index.module.less';
import AdvancedSearchForm from './form';
import Tables from './table';
import { formType } from './form/type'

const staff: FC = () => {
    const [syncLoading, setSyncLoading] = useState<boolean>(false); //control synchronous loading status
    const [searchForm, setSearchForm] = useState<formType>({});

    useEffect(() => {
        console.log(searchForm);
        
    },[searchForm])

    /**
     * return synchronous time dom
     * @returns dom
     */
    const Synchronous = () => {
        return (
            <span className={styles.Staff_time}>上次同步时间：{'2020-10-09'}</span>
        )
    };

    /**
     * return synchronous button dom
     */
    const SyncBtn = () => {
        if (syncLoading) {
            return (
                <span className={styles.Staff_syncing_btn}>同步中...</span>
            )
        }
        return (
            <span className={styles.Staff_sync_btn} onClick={handleSync}>同步钉钉通讯录</span>
        )
    };
    /**
     * handle synchronous dd framework event
     */
    const handleSync = () => {
        setSyncLoading(true);
        setTimeout(() => {
            setSyncLoading(false);
        }, 1000);
    }
    return (
        <Fragment>
            <div className={styles.Staff_layout}>
                <div className={styles.Staff_title}>
                    <header className={styles.Staff_header}>人员管理</header>
                    <Synchronous />
                    <SyncBtn />
                </div>
                <div className={styles.Staff_form}>
                    <AdvancedSearchForm setSearchForm={setSearchForm} />
                </div>
                <div className={styles.Staff_operation}>
                    <Button type="primary" style={{ marginLeft: 'auto' }}>
                        批量操作
                    </Button>
                </div>
                <div className={styles.Staff_table}>
                    <Tables />
                </div>
            </div>
        </Fragment>
    )
}

export default staff