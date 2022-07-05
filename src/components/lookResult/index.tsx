import { getExamResult } from '@/api/api';
import { Drawer, Spin } from 'antd'
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import PDP from './PDP';
import MBTI from './MBTI';
import { IResultList, IResult } from '../../page/evaluation/management/type';
import Loading from '@/components/loading';


const LookResult = forwardRef((props, ref) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [resultList, setResultList] = useState<IResult>()
    const [loading, setLoading] = useState<boolean>(true)
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
        const res = await getExamResult({ examPaperId: record.examPaperId, userId: record.userId })
        if (res.code === 1) {
            setResultList(res.data);
            setLoading(false)
        }
    }
    return (
        <Drawer title="测评报告" placement="right" onClose={onDrawerClose} visible={visible}>
            {
                loading ? <Loading /> : (resultList?.examTemplateType == 'PDP' ? <PDP resultList={resultList} /> : <MBTI resulyData={resultList} />)
            }
        </Drawer>
    )
})

export default LookResult