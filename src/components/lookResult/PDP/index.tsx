import React, { useEffect, useRef } from 'react'
import styles from './index.module.less'
import { Radar } from '@antv/g2plot';
import { IResult } from '@/page/evaluation/management/type'
import ResultHeader from '@/components/resultHeader';

const PDP = (props: { resultList: IResult }) => {
    const { resultList } = props;
    const containerRef: any = useRef()
    const addImg = '//qzz-static.forwe.store/evaluation-web/imgs/pdp/jiahao%402x.png'
    useEffect(() => {
        if (containerRef.current) {
            radarMap()
        }
    }, [containerRef])
    const radarMap = () => {
        containerRef.current.innerHTML = ''
        const json = JSON.parse(resultList.polygon || '{}')
        const data = Object.keys(json).map((key) => ({
            item: key,
            a: json[key],
        }));
        const radarPlot = new Radar('container', {
            data,
            width: 200,
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
    //生成雷达图
    // const radarMap = (polygon: string) => { 
    //     if (!polygon) return;
    //     const { DataView } = DataSet;
    //     const json = JSON.parse(polygon);
    //     const data = Object.keys(json).map((key) => ({
    //         item: key,
    //         a: json[key],
    //     }));

    //     const dv = new DataView().source(data);
    //     dv.transform({
    //         type: 'fold',
    //         fields: ['a'], // 展开字段集
    //         key: 'user', // key字段
    //         value: 'score', // value字段
    //     });
    //     const chart = new Chart({
    //         container: 'container',
    //         autoFit: true,
    //         height: 200,
    //         padding: 30,
    //     });

    //     chart.data(dv.rows);
    //     chart.scale('score', {
    //         min: 0,
    //         max: 5,
    //         tickCount: 5,
    //     });
    //     chart.coordinate('polar', {
    //         radius: 0.8,
    //     });
    //     chart.axis('item', {
    //         line: null,
    //         tickLine: null,
    //         grid: {
    //             line: {
    //                 style: {
    //                     stroke: 'rgba(207, 207, 207, 1)', // 雷达线的颜色
    //                     lineDash: null,
    //                 },
    //             },
    //         },
    //         label: {
    //             style: {
    //                 fill: '#434343', // label文字颜色
    //             },
    //         },
    //     });
    //     chart.axis('score', {
    //         line: null,
    //         tickLine: null,
    //         label: null, //圆圈数据文字
    //         grid: {
    //             line: {
    //                 type: 'circle',
    //                 style: {
    //                     stroke: 'rgba(210, 210, 210, 1)', // 网格线的颜色
    //                     lineDash: null,
    //                 },
    //             },
    //         },
    //     });

    //     chart.area().position('item*score').style({
    //         fill: '#DFDFDF', //区域填充颜色
    //         fillOpacity: '0.5', //区域填充颜色透明度
    //     });
    //     chart.tooltip(false);
    //     chart.render();
    // };
    // useEffect(() => {
    //     //防止多次渲染雷达图
    //     if (result?.polygon && result?.bankType == 'PDP') {
    //         container.current && (container.current.innerHTML = '');
    //         radarMap(result?.polygon);
    //     }
    // }, [result?.polygon]);
    return (
        <div className={styles.pageResult}>
            {/* 性格结果 */}
            <div id="capture" className={styles.capture}>
                <div className={styles.backImg} />
                <div className={styles.resultBox}>
                    <div className={styles.resultLitterBox}>
                        <div className={styles.contentBox}>
                            <div className={styles.resultRight} >
                                <img src={resultList?.results[0].typeIcon} />
                                {resultList?.results?.length > 1 && <img className={styles.jiahao} src={addImg} />}
                                {resultList?.results?.length > 1 && <img src={resultList?.results[1]?.typeIcon} />}
                            </div>
                            <div className={styles.text}>我是</div>
                            <div className={styles.character}>
                                {resultList?.results[0]?.type}
                                {resultList?.results?.length > 1 && `+${resultList?.results[1]?.type}`}
                            </div>
                            <div className={styles.describe}>{resultList?.textDesc[0]}</div>
                            {/* 雷达图 */}
                            <div className={styles.container}>
                                <div id="container" ref={containerRef} />
                                <div className={styles.userInfo}>
                                    <ResultHeader width={42} height={42} isDescribe={true} name={resultList.user.name} src={resultList.user.avatar} />
                                </div>
                                <div className={styles.userName}>{resultList.user.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 类型描述 */}
                <div className={styles.describeBox}>
                    <img src={resultList?.imageDesc[0]} className={styles.describeImg} />
                    <img src={resultList?.imageDesc[1]} className={styles.describeImg} />
                </div>
            </div>
        </div>
    )
}

export default PDP