import { getExamResult, getPDFResult, getUserExamResult } from '@/api/api'
import { IUserExamResultBack } from '@/api/type'
import Loading from '@/components/loading'
import PdfDetailMBTI from '@/components/report/MBTI'
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import styles from './index.module.less';
import { abilityList, discData } from '@/assets/data'
import { TagSort } from '@/components/report/MBTI/type'
import { sortBy } from '@antv/util';
import DISCDetail from '@/components/report/DISC'
import PDPDetail from '@/components/report/PDP'
import CADetail from '@/components/report/CA'

type templateType = 'MBTI' | 'DISC' | 'PDP' | 'CA'
const typeFlag: any = {
    'MBTI': true,
    'DISC': false,
    'PDP': false,
    'CA': false,
}
const PDF = () => {
    const [resultDetail, setResultDetail] = useState<IUserExamResultBack>()
    const query = useParams();
    const { type, userId, examPaperId } = query as { type: templateType, userId: string, examPaperId: string };
    const [search] = useSearchParams();
    const isRecruit = search.get('isRecruit');
    useEffect(() => {
        getResultDetail()
    }, [])
    const TypeReport = {
        "MBTI": <PdfDetailMBTI resultDetail={resultDetail} />,
        "DISC": <DISCDetail resultDetail={resultDetail} />,
        "PDP": <PDPDetail resultDetail={resultDetail} />,
        "CA": <CADetail resultDetail={resultDetail} />,
    }
    // 获取pdf的数据
    const getResultDetail = async () => {
        const examResultRequest = isRecruit ? getUserExamResult : getExamResult;
        const res = await examResultRequest({ examPaperId, userId, major: typeFlag[type] })
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
                        return;
                    }

                    Object.assign(newData, {
                        resultType: res.data.results[0].type,
                        examTemplateArr: res.data.results[0].type.split(''),
                        htmlDesc: {
                            ...htmlDesc,
                        }
                    })
                    // htmlDesc?.dimensional.forEach((item: any) => {
                    //     Object.assign(newDimensional, {
                    //         [item.tag]: item,
                    //     });
                    // });
                    // const newList = abilityList.map((item: any) => {
                    //     if (htmlDesc?.ability) {
                    //         return {
                    //             ...item,
                    //             sort: (TagSort as any)[htmlDesc?.ability?.[item.name]]
                    //         }
                    //     }
                    // });
                    // sortBy(newList, function (item: any) { return item.sort });

                    // Object.assign(newData, {
                    //     resultType: res.data.results[0].type,
                    //     examTemplateArr: res.data.results[0].type.split(''),
                    //     htmlDesc: {
                    //         ...htmlDesc,
                    //         dimensional: newDimensional,
                    //         abilityList: newList,
                    //     }
                    // })
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
            setResultDetail(newData);
        }
    }
    if (!resultDetail) {
        return <Loading />
    }
    return (
        <div className={styles.pdf_main}>
            {TypeReport[type]}
        </div>
    )
}

export default PDF