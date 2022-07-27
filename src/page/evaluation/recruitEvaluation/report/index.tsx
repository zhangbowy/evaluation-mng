import React, { useEffect, useState, useRef } from 'react';
import { Breadcrumb, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { useParams } from 'react-router';
import ReportDetail from '@/components/report';

/**
 * 查看报告
 */
const LookReport = () => {
    const params = useParams() as { people: string }
    const pdfDetail: any = useRef();
    const [loading, setLoading] = useState<boolean>(false);
    const arr = params.people.split('~');
    const examPaperId = arr[0];
    const userId = arr[1];

    useEffect(() => {
        return () => {};
    }, [])

    return (
        <div className={styles.detail_layout}>
            <header>
                <Breadcrumb separator=">" className={styles.detail_nav}>
                    <Breadcrumb.Item href="#/evaluation/recruitEvaluation">招聘测评</Breadcrumb.Item>
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
                isRecruit={true}
            />
        </div>
    );
}

// #endregion

export default LookReport;