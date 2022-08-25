import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { formType } from './form/type'
import styles from './index.module.less';
import AdvancedSearchForm from './form';
import Tables from './table';
import UploadModal from './modal';


const staff: FC = () => {
    const [syncLoading, setSyncLoading] = useState<boolean>(false); //control synchronous loading status
    const [searchForm, setSearchForm] = useState<formType>({}); //save search form data
    const [height, setHeight] = useState<number>(0); //save tableRef height
    const [uploadVisible, setUploadVisible] = useState<boolean>(false); //control modal visible
    const tableRef = useRef<HTMLDivElement|null>(null);

    useEffect(() => {
        setHeight(tableRef?.current?.clientHeight as number)
        window.addEventListener('resize', () => {
            setHeight(tableRef?.current?.clientHeight as number)
        })
    },)

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
    };

    /**
     * handle upload batch operation
     */
    const handleUpload = () => {
        setUploadVisible(true);
    };
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
                    <Button type="primary" style={{ marginLeft: 'auto' }} onClick={handleUpload}>
                        批量操作
                    </Button>
                </div>
                <div className={styles.Staff_table} ref={tableRef}>
                    <Tables height={height} />
                </div>
            </div>
            <UploadModal uploadVisible={uploadVisible} setUploadVisible={setUploadVisible} />
        </Fragment>
    )
}

export default staff