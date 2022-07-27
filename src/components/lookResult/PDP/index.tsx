import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react'
import styles from './index.module.less'
import { Radar } from '@antv/g2plot';
import { IResult } from '@/page/evaluation/management/type'
import ResultHeader from '@/components/resultHeader';
import { delPicDomain } from '@/utils/utils';

const PDP = forwardRef((props: { resultList: IResult }, ref) => {
    const { resultList } = props;
    const containerRef: any = useRef() // 保存分享的节点
    const screenshotRef = useRef<HTMLDivElement | null>(null) // 保存截图的节点
    const addImg = '/evaluation-web/imgs/pdp/jiahao%402x.png'
    useImperativeHandle(ref, () => ({
        screenshotRef: screenshotRef.current
    }))
    useEffect(() => {
        if (containerRef.current && resultList) {
            radarMap()
        }
    }, [containerRef.current, resultList])
    const radarMap = () => {
        containerRef.current.innerHTML = ''
        const json = JSON.parse(resultList?.polygon || '{}')
        const data = Object.keys(json).map((key) => ({
            item: key,
            a: json[key],
        }));
        const radarPlot = new Radar(containerRef.current, {
            data,
            width: 250,
            height: 200,
            xField: 'item',
            yField: 'a',
            tooltip: false,
            lineStyle: {
                fill: '#DFDFDF', //区域填充颜色
                fillOpacity: 0.8, //区域填充颜色透明度
                stroke: '#DFDFDF',
                lineOpacity: 0.8,
            },
            xAxis: {
                tickLine: null,
                line: {
                    style: {
                        stroke: '#D2D2D2',
                        lineDash: null,
                    }
                },
            },
            yAxis: {
                tickLine: null,
                label: false,
                min: 0,
                max: 5,
                line: {
                    type: 'circle',
                    style: {
                        stroke: '#D2D2D2',
                    }
                },
            },
        })
        radarPlot.render();
    }
    return (
        <div className={styles.pageResult}>
            {/* 性格结果 */}
            <div ref={screenshotRef} className={styles.capture}>
                <div className={styles.backImg} />
                <div className={styles.resultBox}>
                    <div className={styles.resultLitterBox}>
                        <div className={styles.contentBox}>
                            <div className={styles.resultRight} >
                                <img src={delPicDomain(resultList?.results[0].typeIcon)} />
                                {resultList?.results?.length > 1 && <img className={styles.jiahao} src={addImg} />}
                                {resultList?.results?.length > 1 && <img src={delPicDomain(resultList?.results[1]?.typeIcon)} />}
                            </div>
                            <div className={styles.text}>我是</div>
                            <div className={styles.character}>
                                {resultList?.results[0]?.type}
                                {resultList?.results?.length > 1 && `+${resultList?.results[1]?.type}`}
                            </div>
                            <div className={styles.describe}>{resultList?.textDesc[0]}</div>
                            {/* 雷达图 */}
                            <div className={styles.container}>
                                <div ref={containerRef} />
                                <div className={styles.userInfo}>
                                    <ResultHeader width={42} height={42} isDescribe={true} name={resultList?.user.name} src={resultList?.user.avatar} />
                                </div>
                                <div className={styles.userName}>{resultList?.user.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 类型描述 */}
                <div className={styles.describeBox}>
                    <img src={delPicDomain(resultList?.imageDesc[0])} className={styles.describeImg} />
                    <img src={delPicDomain(resultList?.imageDesc[1])} className={styles.describeImg} />
                </div>
            </div>
        </div>
    )
})

export default PDP