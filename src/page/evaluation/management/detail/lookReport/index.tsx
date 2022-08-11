

import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { Breadcrumb, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { useParams } from 'react-router';
import ReportDetail from '@/components/report';

/**
 * 查看报告
 */
const LookReport = () => {
    const params = useParams() as { id: string, people: string }
    const pdfDetail: any = useRef();
    const [loading, setLoading] = useState<boolean>(false);
    const arr = params.people.split('~');
    const examPaperId = arr[0];
    const userId = arr[1];
    const templateType = arr[2];

    return (
        <div className={styles.detail_layout}>
            <header>
                <Breadcrumb separator=">" className={styles.detail_nav}>
                    <Breadcrumb.Item href="#/evaluation/management">盘点测评</Breadcrumb.Item>
                    <Breadcrumb.Item href={`#/evaluation/management/detail/${params.id}`}>测评详情</Breadcrumb.Item>
                    <Breadcrumb.Item>查看报告</Breadcrumb.Item>
                </Breadcrumb>
                {/* <Button 
                    type="primary" 
                    icon={<DownloadOutlined />} 
                    onClick={() => { 
                        setLoading(true);
                        pdfDetail.current.exportPDF(() => {
                            setLoading(false);
                        }); 
                    }}
                    loading={loading}
                >下载报告</Button> */}
            </header>
            <ReportDetail
                ref={pdfDetail}
                userId={userId}
                examPaperId={examPaperId}
                templateType={templateType}
            />
        </div>
    );
}

// #endregion

export default LookReport;