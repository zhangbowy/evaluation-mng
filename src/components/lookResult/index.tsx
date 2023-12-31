import { getExamResult, getUserExamResult } from '@/api/api';
import { Drawer } from 'antd'
import React, { useState, forwardRef, useImperativeHandle, useRef, Fragment } from 'react'
import PDP from './PDP';
import MBTI_O from './MBTI_O';
import CA from './CA';
import CPI from './CPI'
import { IResultList, IResult } from '../../page/evaluation/management/type';
import Loading from '@/components/loading';
import { propsType } from './type';
import html2Canvas from 'html2canvas';

const LookResult = forwardRef((props: propsType, ref) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [resultList, setResultList] = useState<IResult>()
    const [loading, setLoading] = useState<boolean>(true)
    const curRef: any = useRef([])
    const resultComponent: { [key: string]: JSX.Element } = {
        "PDP": <PDP resultList={resultList as IResult} />,
        "MBTI_O": <MBTI_O resulyData={resultList} />,
        "CA": <CA resultList={resultList as IResult} />,
        "CPI": <CPI charmList={resultList as IResult} />,
    }
    const reportType: { [key: string]: number } = {
        'PDP': 0,
        'CA': 1,
        'CPI': 2,
        'MBTI_O': 3,
    }
    useImperativeHandle(ref, () => ({
        onOpenDrawer,
        onDownLoadReport
    }))
    // 抽屉关闭
    const onDrawerClose = () => {
        setVisible(false)
    }
    // 同步执行
    const awaitFn = async (data: IResult) => {
        setResultList(data);
        setLoading(false)
    }
    // 获取当前报告的节点
    const onDownLoadReport = async (record: { templateTitle: string; examPaperId: string, userId: string }) => {
        const { isRecruit } = props;  // 是否是招聘测评
        const resultRequest = isRecruit ? getUserExamResult : getExamResult;
        const res = await resultRequest({ examPaperId: record.examPaperId, userId: record.userId })
        if (res.code === 1) {
            await awaitFn(res.data)
            await new Promise(r => setTimeout(r, 500))
            html2Canvas(curRef.current[reportType[res.data.examTemplateType]].screenshotRef, {
                backgroundColor: null, //画出来的图片有白色的边框,不要可设置背景为透明色（null）
                useCORS: true, //支持图片跨域
                scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2, //设置放大的倍数
                width: 400,
                height: curRef.current[reportType[res.data.examTemplateType]].screenshotRef.scrollHeight,
                allowTaint: true,
            }).then(canvas => {
                const url = canvas.toDataURL('image/png', 1);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${record.templateTitle}.png`
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a)
            })
        }
    }
    // 打开
    const onOpenDrawer = async (record: { examPaperId: string, userId: string }) => {
        setVisible(true)
        const { isRecruit } = props;  // 是否是招聘测评
        const resultRequest = isRecruit ? getUserExamResult : getExamResult;
        const res = await resultRequest({ examPaperId: record.examPaperId, userId: record.userId })
        if (res.code === 1) {
            awaitFn(res.data)
        }
    }
    return (
        <Fragment>
            <Drawer
                title="测评报告"
                width={400}
                placement="right"
                onClose={onDrawerClose}
                visible={visible}
            >
                {
                    loading ? <Loading /> : (resultComponent[resultList?.examTemplateType as string])
                }
            </Drawer >
            <div style={{ height: 0, overflow: 'hidden' }}>
                <PDP ref={(ref) => curRef.current[0] = ref} resultList={resultList as IResult} />
                <CA ref={(ref) => curRef.current[1] = ref} resultList={resultList as IResult} />
                <CPI ref={(ref) => curRef.current[2] = ref} charmList={resultList as IResult} />
                <MBTI_O ref={(ref) => curRef.current[3] = ref} resulyData={resultList} />
            </div>
        </Fragment>
    )
})

LookResult.displayName = "LookResult";

export default LookResult