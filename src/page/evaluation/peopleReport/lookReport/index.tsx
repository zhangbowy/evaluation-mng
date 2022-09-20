

import React, { useEffect, useState, useRef } from 'react';
import { Breadcrumb, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { useParams } from 'react-router-dom';
import ReportDetail from '@/components/report';
import { IReportDetail } from '../type';
import { getAllExam } from '@/api/api';

/**
 * 查看报告
 */
const LookReport = () => {
    const params = useParams() as { people: string }
    const [reportDetailList, setReportDetailList] = useState<IReportDetail>()
    const pdfDetail: any = useRef();
    const [loading, setLoading] = useState<boolean>(false);
    const [reportName, setReportName] = useState<string>('');
    const arr = params.people.split('~');
    const examPaperId = arr[0];
    const userId = arr[1];
    const templateType = arr[2];

    useEffect(() => {
        getUserReport();
    }, [])

    // 获取列表
    const getUserReport = async () => {
        const res = await getAllExam({ userId })
        if (res.code === 1) {
            setReportDetailList(res.data)
        }
    }

    useEffect(() => {
        console.log(pdfDetail, 'pdfDetail')
    }, [pdfDetail])

    const sendTypeName = (name: string) => {
        setReportName(name);
    }


    return (
        <div className={styles.detail_layout}>
            <header>
                <Breadcrumb separator=">" className={styles.detail_nav}>
                    <Breadcrumb.Item href="#/evaluation/peopleReport">人才报告</Breadcrumb.Item>
                    <Breadcrumb.Item href={`#/evaluation/peopleReport/detail/${userId}`}>{reportDetailList?.name}</Breadcrumb.Item>
                    <Breadcrumb.Item>{reportName}</Breadcrumb.Item>
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
                isPeople={true}
                isHaveSwitch={true}
                sendTypeName={sendTypeName}
            />
        </div>
    );
}

// #endregion

export default LookReport;