import { getExamResult, getUserExamResult } from '@/api/api';
import { Drawer, Spin } from 'antd'
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import PDP from './PDP';
import MBTI from './MBTI';
import CA from './CA';
import CPI from './CPI'
import { IResultList, IResult } from '@/page/evaluation/management/type';
import Loading from '@/components/loading';


const LookResult = forwardRef((props, ref) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [resultList, setResultList] = useState<IResult>()
    const [loading, setLoading] = useState<boolean>(true)
    const resultComponent: { [key: string]: JSX.Element } = {
        "PDP": <PDP resultList={resultList as IResult} />,
        "MBTI": <MBTI resulyData={resultList} />,
        "CA": <CA resultList={resultList as IResult} />,
        "CPI": <CPI charmList={resultList as IResult} />,
    }
    useImperativeHandle(ref, () => ({
        onOpenDrawer
    }))
    // 抽屉关闭
    const onDrawerClose = () => {
        setVisible(false)
    }
    // 打开
    const onOpenDrawer = async (record: { examPaperId: string, userId: string }) => {
        setVisible(true)
        const res = await getUserExamResult({ examPaperId: record.examPaperId, userId: record.userId })
        if (res.code === 1) {
            setResultList(res.data);
            setLoading(false)
        }
    }
    return (
        <Drawer title="测评报告" width="400" placement="right" onClose={onDrawerClose} visible={visible}>
            {
                loading ? <Loading /> : (resultComponent[resultList?.examTemplateType as string])
            }
        </Drawer>
    )
})

export default LookResult