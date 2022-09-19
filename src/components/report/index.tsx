

import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import styles from './index.module.less';
import { getExamResult, getUserExamResult, getPDFResult, getAllExam } from '@/api/api';
import { TagSort } from '@/components/report/MBTI/type';
import { sortBy } from '@antv/util';
import DISCDetail from './DISC';
import PDPDetail from './PDP';
import CADetail from './CA';
import MBTIDetail from './MBTI'
import { abilityList, discData } from '@/assets/data';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
import cs from 'classnames';
import { Tooltip } from 'antd';

/**
 * 查看报告
 */
const typeMap: any = {
    'MBTI': MBTIDetail,
    'DISC': DISCDetail,
    'PDP': PDPDetail,
    'CA': CADetail
}
const typeFlag: any = {
    'MBTI': true,
    'DISC': false,
    'PDP': false,
    'CA': false,
}
const ReportDetail = (props: any) => {
    const { userId, examPaperId, isRecruit, templateType, isPeople, isHaveSwitch = false } = props;
    const [resultDetial, setResultDetial] = useState({ examTemplateType: '' });
    const [evaluationList, setEvaluationList] = useState<any[]>([]);
    const [currentExamPaperId, setCurrentExamPaperId] = useState<string>(examPaperId);
    const [currentTemplateType, setCurrentTemplateType] = useState<string>(templateType);
    const [positionY, setPositionY] = useState<number>(0);
    const reportRef: any = useRef();
    const actionRef: any = useRef();
    // const pdfDetail: any = useRef();

    const getAllExamResult = () => {
        getAllExam({
            userId: userId
        }).then(res => {
            const { code, data } = res;
            if (code === 1) {
                setEvaluationList(data.evaluationVoList)
            } else {
                setEvaluationList([]);
            }
        })
    };

    const { isFirst, isLast } = useMemo(() => {
        const resultFlag = {
            isFirst: false,
            isLast: false
        }
        const reportList = evaluationList.filter(v => v.answerStatus === 10).map(v => v.examPaperId);
        const indexExam = reportList.indexOf(Number(currentExamPaperId));
        if (indexExam === 0) {
            resultFlag.isFirst = true
        }
        if (indexExam === reportList.length - 1) {
            resultFlag.isLast = true
        }
        return resultFlag;
    }, [evaluationList, currentExamPaperId, currentTemplateType])

    useEffect(() => {
        getResult(currentExamPaperId, currentTemplateType);
    }, []);

    useEffect(() => {
        getAllExamResult();
    }, []);

    const handleScroll = () => {
        const reportParentNode = reportRef.current.parentNode.scrollTop;
        // setPositionY(reportParentNode);
        actionRef.current.style.top = `${reportParentNode + 100}px`
    }

    useEffect(() => {
        const reportParentNode = reportRef.current.parentNode;
        if (reportParentNode) {
            reportParentNode.addEventListener('scroll', handleScroll)
        }
    }, [])

    const getResult = async (id: string, type: string) => {
        const examResultRequest = isRecruit ? getUserExamResult : isPeople ? getPDFResult : getExamResult;
        const res = await examResultRequest({ examPaperId: id, userId, major: typeFlag[type] })
        if (res.code === 1) {
            const newData = { ...res.data };
            if (type !== 'DISC') {
                if (res.data.results) {
                    const { htmlDesc } = newData;
                    const newDimensional = {};
                    if (type === 'MBTI') {
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
                        setResultDetial(newData);
                        return;
                    }

                    Object.assign(newData, {
                        resultType: res.data.results[0].type,
                        examTemplateArr: res.data.results[0].type.split(''),
                        htmlDesc: {
                            ...htmlDesc,
                        }
                    })
                }
            } else {
                if (res?.data?.scoreDetail) {
                    Object.assign(newData, {
                        discData: discData.map(it => {
                            return {
                                ...it,
                                value: res?.data?.scoreDetail?.[it.tag]?.score,
                                percent: res?.data?.scoreDetail?.[it.tag]?.fullScore,
                            };
                        })
                    })
                }
            }
            setResultDetial(newData);
        }
    };

    const Com = useMemo(() => {
        return typeMap[currentTemplateType]
    }, [currentTemplateType]);

    const lastReport = () => {
        if (isFirst) return;
        const reportList = evaluationList.filter(v => v.answerStatus === 10);
        const reportListKeys = reportList.map(v => v.examPaperId);
        const indexExam = reportListKeys.indexOf(Number(currentExamPaperId));
        const id = reportList[indexExam - 1]?.examPaperId;
        const type = reportList[indexExam - 1]?.examTemplateType;
        setCurrentExamPaperId(id);
        setCurrentTemplateType(type);
        setResultDetial({ examTemplateType: '' });
        getResult(id, type);
        const wrap = reportRef.current.parentNode || null;
        if (wrap) {
            wrap.scrollTop = 0
        }

    }

    const nextReport = () => {
        if (isLast) return;
        const reportList = evaluationList.filter(v => v.answerStatus === 10);
        const reportListKeys = reportList.map(v => v.examPaperId);
        const indexExam = reportListKeys.indexOf(Number(currentExamPaperId));
        const id = reportList[indexExam + 1]?.examPaperId;
        const type = reportList[indexExam + 1]?.examTemplateType;
        setCurrentExamPaperId(id);
        setCurrentTemplateType(type);
        setResultDetial({ examTemplateType: '' });
        getResult(id, type);
        const wrap = reportRef.current.parentNode || null;
        if (wrap) {
            wrap.scrollTop = 0
        }
    }

    return (
        <div className={styles.detailWrap} ref={reportRef}>
            <div className={styles.pdfDetail}>
                {/* {
                    templateType === 'DISC' ?
                        <DISCDetail resultDetail={resultDetial} />
                        :
                        <PdfDetailMBTI
                            // ref={pdfDetail}
                            resultDetail={resultDetial}
                        />
                } */}
                <ErrorBoundary>
                    <Com resultDetail={resultDetial} />
                </ErrorBoundary>
            </div>
            {
                isHaveSwitch && <div className={styles.pdfActions} ref={actionRef}>
                    <div className={isFirst ? cs(styles.actions_item, styles.first) : styles.actions_item}>
                        <Tooltip title={isFirst ? '当前是第一份报告' : ''}>
                            <span onClick={lastReport}>
                                <i className='iconfont icon-jiantoushang' style={{ color: '#fff' }} />
                            </span>
                        </Tooltip>
                        <p className={styles.actions_item_text}>上一份报告</p>
                    </div>
                    <div className={isLast ? cs(styles.actions_item, styles.last) : styles.actions_item}>
                        <Tooltip title={isLast ? '当前是最后一份报告' : ''}>
                            <span onClick={nextReport}>
                                <i className='iconfont icon-jiantouxia'  style={{ color: '#fff' }} />
                            </span>
                        </Tooltip>
                        <p className={styles.actions_item_text}>下一份报告</p>
                    </div>
                </div>
            }
        </div>
    );
}

// #endregion
ReportDetail.displayName = 'ReportDetail'
export default ReportDetail;