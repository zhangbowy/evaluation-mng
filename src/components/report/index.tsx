

import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import styles from './index.module.less';
import PdfDetailMBTI from '@/components/report/MBTI';
import { useParams } from 'react-router';
import { getExamResult, getUserExamResult } from '@/api/api';
import { TagSort } from '@/components/report/MBTI/type';
import { sortBy } from '@antv/util';

/**
 * 查看报告
 */
const ReportDetail = forwardRef((props: any, ref) => {
    const { userId, examPaperId, isRecruit } = props;
    const [resultDetial, setResultDetial] = useState({});
    const pdfDetail: any = useRef();

    useImperativeHandle(ref, () => {
        return {
            exportPDF,
        };
    });

    const exportPDF = (callback: Function) => {
        pdfDetail.current.exportPDF(() => {
            callback && callback();
        });
    }

    useEffect(() => {
        getResult();
        return () => {};
    }, []);

    const abilityList = [{
        id: 1,
        name: '分析能力'
    }, {
        id: 2,
        name: '创新力'
    }, {
        id: 3,
        name: '判断能力'
    }, {
        id: 4,
        name: '洞察力'
    }, {
        id: 5,
        name: '忠诚度'
    }, {
        id: 6,
        name: '抗压能力'
    }, {
        id: 7,
        name: '沟通能力'
    }, {
        id: 8,
        name: '耐心程度'
    }, {
        id: 9,
        name: '责任心'
    }, {
        id: 10,
        name: '适应能力'
    }];


    const getResult = async() => {
        const examResultRequest = isRecruit ? getUserExamResult : getExamResult;
        const res = await examResultRequest({ examPaperId, userId, major: true })
        if (res.code === 1) {
            const newData = {...res.data};
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
                sortBy(newList, function (item:any) { return item.sort });

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
                ref={pdfDetail}
                resultDetail={resultDetial}
            />
        </div>
    );
})

// #endregion

export default ReportDetail;