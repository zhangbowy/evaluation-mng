

import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import styles from './index.module.less';
import PdfDetailMBTI from '@/components/report/MBTI';
import { useParams } from 'react-router';
import { getExamResult, getUserExamResult } from '@/api/api';
import { TagSort } from '@/components/report/MBTI/type';
import { sortBy } from '@antv/util';
import { abilityList } from '@/assets/data';

/**
 * 查看报告
 */
const ReportDetail = forwardRef((props: any, ref) => {
    const { userId, examPaperId, isRecruit } = props;
    const [resultDetial, setResultDetial] = useState({});
    const pdfDetail: any = useRef();

    // useImperativeHandle(ref, () => {
    //     return {
    //         exportPDF,
    //     };
    // });

    const exportPDF = (callback: () => void) => {
        pdfDetail.current.exportPDF(() => {
            callback && callback();
        });
    }

    useEffect(() => {
        getResult();
    }, []);

    const getResult = async () => {
        const examResultRequest = isRecruit ? getUserExamResult : getExamResult;
        const res = await examResultRequest({ examPaperId, userId, major: true })
        if (res.code === 1) {
            const newData = { ...res.data };
            if (res.data.results) {
                const { htmlDesc } = newData;
                const newDimensional = {};
                htmlDesc?.dimensional.forEach((item: any) => {
                    Object.assign(newDimensional, {
                        [item.tag]: item,
                    });
                });
                const newList = abilityList.map((item: any) => {
                    if (htmlDesc?.ability) {
                        return {
                            ...item,
                            sort: (TagSort as any)[htmlDesc?.ability?.[item.name]]
                        }
                    }
                });
                sortBy(newList, function (item: any) { return item.sort });

                Object.assign(newData, {
                    resultType: res.data.results[0].type,
                    examTemplateArr: res.data.results[0].type.split(''),
                    htmlDesc: {
                        ...htmlDesc,
                        dimensional: newDimensional,
                        abilityList: newList,
                    }
                })
            }
            setResultDetial(newData);
        }
    };

    return (
        <div className={styles.pdfDetail}>
            <PdfDetailMBTI
                // ref={pdfDetail}
                resultDetail={resultDetial}
            />
        </div>
    );
})

// #endregion
ReportDetail.displayName = 'ReportDetail'
export default ReportDetail;