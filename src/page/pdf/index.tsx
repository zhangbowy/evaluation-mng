import { getPDFResult } from '@/api/api'
import { IUserExamResultBack } from '@/api/type'
import Loading from '@/components/loading'
import PdfDetailMBTI from '@/components/report/MBTI'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from './index.module.less';
import { abilityList } from '@/assets/data'
import { TagSort } from '@/components/report/MBTI/type'
import { sortBy } from '@antv/util';

const PDF = () => {
    const [resultDetail, setResultDetail] = useState<IUserExamResultBack>()
    const [search] = useSearchParams()
    const userId = search.get('userId') || ''
    const examPaperId = search.get('examPaperId') || ''
    useEffect(() => {
        getResultDetail()
    }, [])

    // 获取pdf的数据
    const getResultDetail = async () => {
        const res = await getPDFResult({ major: true, userId, examPaperId })
        if (res.code == 1) {
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
            setResultDetail(newData);
        }
    }
    if (!resultDetail) {
        return <Loading />
    }
    return (
        <div className={styles.pdf_main}>
            <PdfDetailMBTI
                resultDetail={resultDetail}
            />
        </div>
    )
}

export default PDF