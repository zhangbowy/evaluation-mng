import { Button, Empty } from 'antd'
import React, { Fragment, memo, ReactElement, useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import { abilityText } from '@/config/management.config'
import { Liquid, Pie, Line, Column } from '@antv/g2plot';
import { Average, characterProportions, IChartList, LineChart, TeamAnalysis } from '../../type';
import { tagsColor } from '@/config/management.config';
import LookAllTags from '../lookAllTags';

type IOverviewStatistics = { chartList: IChartList, type: string, onTabChange: (key: string) => void }
const OverviewStatistics = memo(({ type, chartList, onTabChange }: IOverviewStatistics) => {
    // const chartList = toJS(EvalDetail.getEvalDetailInfo())
    const visualRef: any = useRef([])
    const preferenceRef: any = useRef([]) // 倾向偏好占比
    const eachRef: any = useRef([]) // 各项能力折线图
    const averageRef: any = useRef([]) // 团队平均分和人群批评均分     
    const teamRef: any = useRef([]) // 团队偏好
    const lookAllTagsRef: any = useRef()
    const distributionRef: any = useRef();
    const [isHiddenMore, setIsHiddenMore] = useState<boolean>(false);
    useEffect(() => {
        if (visualRef?.current?.length > 0) {
            visualRef.current[0].innerHTML = '';
            visualRef.current[1].innerHTML = '';
            completionList()
            personalityList()
        }
        const currEleType: IObjType = {
            'MBTI': () => {
                // 倾向偏好占比
                if (preferenceRef?.current?.length > 0 && chartList?.otherGraph) {
                    Object.keys(chartList?.otherGraph || {})?.slice(0, 4)?.map((res, index) => {
                        preferenceRef.current[index].innerHTML = '';
                        renderTeamProportion(preferenceRef.current[index], chartList?.otherGraph[res])
                    })
                    const arr: any[] = []
                    Object.keys(chartList?.otherGraph?.abilityPercentageMap)?.forEach(res => {
                        chartList?.otherGraph?.abilityPercentageMap[res].forEach((item: characterProportions) => {
                            arr.push({
                                name: res,
                                value: item.value,
                                type: item.name
                            })
                        })
                    })
                    preferenceRef.current[4].innerHTML = '';
                    renderPotential(arr)
                }
            },
            'MBTI_O': () => {
                // 倾向偏好占比
                if (preferenceRef?.current?.length > 0 && chartList?.otherGraph) {
                    Object.keys(chartList?.otherGraph).slice(0, 4).map((res, index) => {
                        preferenceRef.current[index].innerHTML = '';
                        renderTeamProportion(preferenceRef.current[index], chartList?.otherGraph[res])
                    })
                    const arr: any[] = []
                    Object.keys(chartList?.otherGraph?.abilityPercentageMap).forEach(res => {
                        chartList?.otherGraph?.abilityPercentageMap[res].forEach((item: characterProportions) => {
                            arr.push({
                                name: res,
                                value: item.value,
                                type: item.name
                            })
                        })
                    })
                    preferenceRef.current[4].innerHTML = '';
                    renderPotential(arr)
                }
            },
            'PDP': () => {
                // 各项能力折线图
                if (eachRef?.current?.length > 0 && chartList?.otherGraph) {
                    abilityText.forEach((res, index) => {
                        eachRef.current[index].innerHTML = '';
                        const arr: LineChart[] = []
                        Object.keys(chartList?.otherGraph?.personalityTagChart[res]).forEach(item => {
                            arr.push({ fraction: item, people: chartList?.otherGraph?.personalityTagChart[res][item] })
                        })
                        renderLineChart(index, arr)
                    })
                }
            },
            'CA': () => {
                // 团队平均分和人群批评均分
                if (averageRef?.current?.length > 0 && chartList?.otherGraph) {
                    averageRef.current[0].innerHTML = '';
                    renderAverage(chartList?.otherGraph?.resultScores)
                }
            },
            'DISC': () => {
                // 团队偏好
                if (teamRef?.current?.length > 0 && chartList?.otherGraph) {
                    teamRef.current[0].innerHTML = '';
                    teamRef.current[1].innerHTML = '';
                    teamRef.current[2].innerHTML = '';
                    renderTeamAnalysis(chartList?.otherGraph?.DISCLabels)
                    renderTeamProportion(teamRef.current[1], chartList?.otherGraph?.dcAndIsLabels)
                    renderTeamProportion(teamRef.current[2], chartList?.otherGraph?.diAndScLabels)
                }
            },
        }
        type && currEleType[type]()
    }, [chartList, type])
    useEffect(() => {
        if (distributionRef.current) {
            if (distributionRef?.current?.scrollHeight > distributionRef?.current?.clientHeight) {
                setIsHiddenMore(true);
            } else {
                setIsHiddenMore(false);
            }
        }
    }, [distributionRef, chartList?.characterProportions]);
    // 查看所有tags
    const onMagnifyClick = () => {
        lookAllTagsRef?.current?.openModal(chartList?.characterProportions)
    }
    // 测评完成率
    const completionList = () => {
        const liquidPlot = new Liquid(visualRef.current[0], {
            percent: (Number(chartList?.finishDegree) || 0) / 100,
            height: 120,
            width: 120,
            outline: {
                border: 2,
                style: {
                    stroke: '#2B85FF',
                    // strokeOpacity: 0.9
                },
                distance: 4,
            },
            liquidStyle: {
            },
            statistic: {
                content: {
                    customHtml: (container: any, view: any, { percent }: any) => {
                        const text = `${(percent * 100).toFixed(0)}%`;
                        return `<div style="font-size:14px;color: #464C5B;font-weight: 500;">${text}</div>`
                    }
                }
            },
            wave: {
                length: 192,
            },
        });
        liquidPlot.render()
    }
    // 人格占比图
    const personalityList = () => {
        const data = chartList?.personalityProportions || [];
        const piePlot = new Pie(visualRef.current[1], {
            height: 120,
            // width: 88,
            data: data,
            angleField: 'value',
            colorField: 'name',
            color: ['#5B8FF9', '#5AD8A6', '#F6BD16', '#E8684A', '#6DC8EC', '#9270CA', '#FF9D4D', '#269A99', '#FF99C3', '#5D7092',
                '#BDD2FD', '#BDEFDB', '#FBE5A2', '#F6C3B7', '#B6E3F5', '#D3C6EA', '#FFD8B8', '#AAD8D8', '#FFD6E7', '#C2C8D5'],
            radius: 1,
            innerRadius: 0.6,
            pieStyle: {
                lineWidth: 1,
            },
            label: false,
            meta: {
                value: {
                    formatter: (v: any) => {
                        return `${v || 0}人`
                    },
                },
            },
            legend: {
                hoverable: false,
                flipPage: data.length > 10,
                maxRow: 2,
                offsetX: -120,
                itemWidth: 100,
                itemName: {
                    formatter: (text: string, item: any, index: number) => {
                        return `${text}     ${chartList?.personalityProportions[index]?.value}人`;
                    },
                },
                // itemValue: {
                //   formatter: (text, item) => {
                //     return ``;
                //   },
                //   style: {
                //     fontSize: 12
                //   },
                // },
            },
            tooltip: {
                showTitle: false
            },
            statistic: {
                title: false,
                content: {
                    style: {
                        whiteSpace: 'pre-wrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '14px',
                    },
                },
            },
        })
        piePlot.chart.removeInteraction('legend-filter');
        piePlot.on('legend-item:mouseenter', (ev: any) => {
            console.log('ev', ev)
            // getTableList({ resultType: ev.data.data.name })
        })
        piePlot.off('element:click')
        piePlot.off('legend-item-name:mouseover');
        piePlot.off('legend-item:mouseenter');
        piePlot.render()
    }
    // 各项能力折线图
    const renderLineChart = (index: number, data: LineChart[]) => {
        const maxNum = Math.max(...data.map(res => res.people))
        const line = new Line(eachRef.current[index], {
            data,
            width: 160,
            height: 120,
            xField: 'fraction',
            yField: 'people',
            label: {
                formatter: () => '',
            },
            point: {
                size: 3,
                shape: 'custom-point',
                style: {
                    fill: '#2B85FF',
                },
            },
            yAxis: {
                // min: 0,
                tickCount: maxNum < 5 ? maxNum + 1 : 6,
                grid: {
                    line: {
                        style: {
                            opacity: 0
                        }
                    }
                }
            },
            xAxis: {
                tickLine: null,
            },
            tooltip: {
                showTitle: false,
                formatter: (datum) => {
                    return { name: '人数', value: datum.people };
                },
                showMarkers: false
            },
            state: {
                active: {
                    style: {
                        shadowBlur: 4,
                        stroke: '#000',
                        fill: 'red',
                    },
                },
            },
            interactions: [{ type: 'marker-active' }],
        });

        line.render();
    }
    // 团队平均分和人群批评均分
    const renderAverage = (data: Average[]) => {
        const list: Average[] = [
            {
                "fullScore": null,
                "resultSimpleType": "SE型：安全/稳定型",
                "resultType": "SE1",
                "score": 18,
                'groupName': '人群平均分'
            },
            {
                "fullScore": null,
                "resultSimpleType": "TF型：技术/职能型",
                "resultType": "TF2",
                "score": 19,
                'groupName': '人群平均分'
            },
            {
                "fullScore": null,
                "resultSimpleType": "SV型：服务型",
                "resultType": "SV3",
                "score": 18,
                'groupName': '人群平均分'
            },
            {
                "fullScore": null,
                "resultSimpleType": "AU型：自主/独立型",
                "resultType": "AU4",
                "score": 19,
                'groupName': '人群平均分'
            },
            {
                "fullScore": null,
                "resultSimpleType": "CH型：挑战型",
                "resultType": "CH5",
                "score": 19,
                'groupName': '人群平均分'
            },
            {
                "fullScore": null,
                "resultSimpleType": "GM型：管理型",
                "resultType": "GM6",
                "score": 17,
                'groupName': '人群平均分'
            },
            {
                "fullScore": null,
                "resultSimpleType": "LS型：生活型",
                "resultType": "LS7",
                "score": 18,
                'groupName': '人群平均分'
            },
            {
                "fullScore": null,
                "resultSimpleType": "EC型：创造/创业型",
                "resultType": "EC8",
                "score": 18,
                'groupName': '人群平均分'
            }
        ]
        const plot = new Column(averageRef.current[0], {
            data: data.concat(list),
            isGroup: true,
            height: 258,
            xField: 'resultSimpleType',
            yField: 'score',
            seriesField: 'groupName',
            // 分组柱状图 组内柱子间的间距 (像素级别)
            dodgePadding: 5,
            columnWidthRatio: 0.3,
            tooltip: {
                showTitle: false,
                formatter: (datum) => {
                    return { name: datum.groupName, value: Math.round(datum.score) + '分' };
                },
            },
            meta: {
                score: {
                    formatter: (v: any) => {
                        return `${v || 0}分`
                    },
                },
            },
            legend: {
                position: 'top'
            },
            label: undefined,
        });

        plot.render();
    }
    // 团队偏好分析
    const renderTeamAnalysis = (data: TeamAnalysis[]) => {
        const maxNum = Math.max(...data.map(res => res.value))
        const columnPlot = new Column(teamRef.current[0], {
            data,
            xField: 'name',
            yField: 'value',
            height: 200,
            label: undefined,
            columnWidthRatio: 0.15,
            xAxis: {
                label: {
                    autoHide: true,
                    autoRotate: false,
                },
            },
            yAxis: {
                min: 0,
                tickCount: maxNum < 5 ? maxNum + 1 : 6,
            },
            tooltip: {
                showTitle: false,
                formatter: (datum) => {
                    return { name: datum.name, value: datum.value + '人' };
                },
            },
        });
        columnPlot.render();
    }
    // 团队偏好占比
    const renderTeamProportion = (el: HTMLElement, data: any[]) => {
        const piePlot = new Pie(el, {
            height: 130,
            width: 200,
            data,
            angleField: 'value',
            colorField: 'name',
            color: ['#73A0FA', '#F6BD16'],
            radius: 1,
            innerRadius: 0.6,
            pieStyle: {
                lineWidth: 1,
            },
            label: false,
            meta: {
                value: {
                    formatter: (v: any) => {
                        return `${v || 0}人`
                    },
                },
            },
            tooltip: {


            },
            legend: {
                // itemName: {
                //     formatter: (text: string,  item: any, index: number) => {
                //         console.log(text, item)
                //         return `${text}`;
                //     },
                // },
                position: 'bottom'
                // itemValue: {
                //   formatter: (text, item) => {
                //     return ``;
                //   },
                //   style: {
                //     fontSize: 12
                //   },
                // },
            },
            statistic: {
                // formatter:(text: string, item: any, index: number)=>{
                //     return ''
                // },
                title: false,
                content: {
                    style: {
                        whiteSpace: 'pre-wrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '14px',
                    },
                },
            },
        })
        piePlot.render()
    }
    // 潜在能力分析
    const renderPotential = (data: TeamAnalysis[]) => {
        const maxNum = Math.max(...data.map(res => res.value))
        const stackedColumnPlot = new Column(preferenceRef.current[4], {
            data,
            height: 258,
            isStack: true,
            xField: 'name',
            yField: 'value',
            seriesField: 'type',
            // 分组柱状图 组内柱子间的间距 (像素级别)
            dodgePadding: 5,
            columnWidthRatio: 0.2,
            yAxis: {
                min: 0,
                tickCount: maxNum < 5 ? maxNum + 1 : 6,
            },
            tooltip: {
                showTitle: false,
                formatter: (datum) => {
                    return { name: datum.name, value: datum.value + '人' };
                },
            },
            legend: {
                position: 'top'
            },
            label: undefined,
        });

        stackedColumnPlot.render();
    }
    //  渲染图表
    const renderChart = () => {
        const curType: IObjType = {
            'DISC':
                <ul className={styles.team}>
                    <div className={`${styles.teamAnalysis} ${styles.border}`}>
                        <p>团队偏好分析</p>
                        {chartList?.otherGraph?.DISCLabels?.length > 0 ?
                            <div ref={el => teamRef.current[0] = el} />
                            : <Empty description={'暂无偏好分析'} />}
                    </div>
                    <div className={`${styles.teamProportion} ${styles.border}`}>
                        <p>团队偏好占比</p>
                        {
                            chartList?.otherGraph?.dcAndIsLabels?.length > 0 ?
                                <div className={styles.teamProportionWrapper}>
                                    <span ref={el => teamRef.current[1] = el}></span>
                                    <span ref={el => teamRef.current[2] = el}></span>
                                </div>
                                : <Empty description={'暂无偏好占比'} />
                        }
                    </div>
                </ul>,
            "MBTI_O":
                <Fragment>
                    <div className={`${styles.preference} ${styles.border}`}>
                        <p>倾向偏好占比</p>
                        {
                            Object.keys(chartList?.otherGraph || {}).length > 0 ?
                                <div className={styles.chartList}>
                                    {
                                        [0, 1, 2, 3].map(res => (
                                            <div key={res} ref={el => preferenceRef.current[res] = el} />
                                        ))
                                    }
                                </div>
                                : <Empty description={'暂无偏好占比'} />
                        }
                    </div>
                    <div className={`${styles.potential} ${styles.border}`}>
                        <p>潜在能力分析 </p>
                        <div ref={el => preferenceRef.current[4] = el} className={styles.chartList} />
                    </div>
                </Fragment>,
            "MBTI":
                <Fragment>
                    <div className={`${styles.preference} ${styles.border}`}>
                        <p>倾向偏好占比</p>
                        {
                            Object.keys(chartList?.otherGraph || {}).length > 0 ?
                                <div className={styles.chartList}>
                                    {
                                        [0, 1, 2, 3].map(res => (
                                            <div key={res} ref={el => preferenceRef.current[res] = el} />
                                        ))
                                    }
                                </div>
                                : <Empty description={'暂无偏好占比'} />
                        }
                    </div>
                    <div className={`${styles.potential} ${styles.border}`}>
                        <p>潜在能力分析</p>
                        {
                            Object.keys(chartList?.otherGraph || {}).length > 0 ?
                                <div ref={el => preferenceRef.current[4] = el} className={styles.chartList} />
                                : <Empty description={'暂无潜在能力分析'} />
                        }
                    </div>
                </Fragment>,
            "PDP":
                <div className={`${styles.each} ${styles.border}`}>
                    <p>各项能力折线图</p>
                    <div className={styles.chartList}>
                        {
                            abilityText.map((res, index) => (
                                <div key={index} className={styles.lineChart}>
                                    <div className={styles.tagsName}>{res}</div>
                                    <div ref={el => eachRef.current[index] = el} />
                                </div>
                            ))
                        }
                    </div>
                </div>,
            "CA":
                <div className={`${styles.average} ${styles.border}`}>
                    <p>团队平均分和人群批评均分</p>
                    {
                        chartList?.otherGraph?.resultScores?.length > 0 ?
                            <div className={styles.average_div} ref={el => averageRef.current[0] = el} />
                            : <Empty description={'团队平均分和人群批评均分'} />
                    }

                </div>
        }
        return curType[type]
    }
    // 查看全部
    const onLookAllClick = () => {
        onTabChange('2')
    }
    // 查看全部
    return (
        <Fragment>
            <div className={styles.overviewSta}>
                <h1>测评概览 </h1>
                <div className={styles.overviewEval}>
                    <div className={`${styles.allPeople} ${styles.border}`}>
                        <div className={styles.top}>
                            <div className={styles.left}>
                                <span className='iconfont icon-yonghu' />
                                <div>
                                    <p>{chartList.totalNum}</p>
                                    <p>测评总人数(人)</p>
                                </div>
                            </div>
                            <Button type='link' onClick={onLookAllClick}>查看全部</Button>
                        </div>
                        <div className={styles.bottom}>
                            <div className={styles.card}>
                                <p>{chartList.finishNum || 0}</p>
                                <p>已完成(人)</p>
                            </div>
                            <div className={styles.card}>
                                <p>{(chartList.totalNum - chartList.finishNum) || 0}</p>
                                <p>未完成(人)</p>
                            </div>
                            <div className={styles.card} >
                                <p>{(chartList.totalNum - chartList.finishNum) || 0}</p>
                                <p>测评中(人)</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.completionRate} ${styles.border}`}>
                        <p>测评完成率</p>
                        <div className={styles.detail_percentageComplete_wrapper}>
                            <div ref={(el) => visualRef.current[0] = el} />
                            <div className={styles.detail_percentageComplete_info}>
                                <ul>覆盖人数<li>{chartList?.totalNum || 0}人</li></ul>
                                <ul>完成人数<li>{chartList?.finishNum || 0}人</li></ul>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.proportion} ${styles.border}`}>
                        <p>人格分布占比</p>
                        <div className={styles.detail_proportion_wrapper}>
                            <div className={`${(chartList?.personalityProportions || []).length < 1 ? styles.detail_proportion_empty : styles.detail_proportion_pie}`} ref={(el) => visualRef.current[1] = el} />
                        </div>
                    </div>
                    <div className={`${styles.tags} ${styles.border}`}>
                        <p>性格标签分布</p>
                        {
                            (chartList?.characterProportions || []).length > 0 && isHiddenMore &&
                            <Button type='link' className={styles.more} onClick={onMagnifyClick}>更多</Button>
                        }
                        <div className={styles.detail_distribution_wrapper} ref={distributionRef}>
                            {
                                (chartList?.characterProportions || []).length > 0 ?
                                    chartList?.characterProportions.map((item: characterProportions, index) => {
                                        const str = index + '';
                                        const curIndex = str.length < 2 ? str : str.slice(str.length - 1, str.length);
                                        const color = tagsColor[curIndex].color;
                                        const background = tagsColor[curIndex].bg;
                                        return (
                                            <span key={item.name} className={styles.detail_distribution_tag} style={{ color, background }}>{item.name}</span>
                                            // <Tag className={styles.detail_distribution_tag} onClick={() => onTagClick(item.name)} color={colorText} key={item.name}>{item.name} x{item.value}</Tag>
                                        )
                                    })
                                    : <Empty description={'暂无标签'} />
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.detailed}>
                    <h1>详细分析 </h1>
                    {renderChart()}
                </div>
            </div>
            <LookAllTags ref={lookAllTagsRef} />
        </Fragment>

    )
})
OverviewStatistics.displayName = "OverviewStatistics";
export default OverviewStatistics