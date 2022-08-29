import { Button, Empty } from 'antd'
import React, { Fragment, memo, ReactElement, useEffect, useRef } from 'react'
import styles from './index.module.less'
import { abilityText } from '@/config/management.config'
import { Liquid, Pie, Line, Column } from '@antv/g2plot';
import { Average, characterProportions, LineChart, TeamAnalysis } from '../../type';
import { tagsColor } from '@/config/management.config';
import LookAllTags from '../lookAllTags';
import { EvalDetail } from '@/store'
import { toJS } from 'mobx';


type IOverviewStatistics = { type: string, onTabChange: (key: string) => void }
const OverviewStatistics = memo((props: IOverviewStatistics) => {
    const chartList = toJS(EvalDetail.getEvalDetailInfo())
    const visualRef: any = useRef([])
    const preferenceRef: any = useRef([]) // 倾向偏好占比
    const eachRef: any = useRef([]) // 各项能力折线图
    const averageRef: any = useRef([]) // 团队平均分和人群批评均分     
    const teamRef: any = useRef([]) // 团队偏好
    const lookAllTagsRef: any = useRef()

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
                if (preferenceRef?.current?.length > 0) {
                    const data: any = {
                        'EILabels': [
                            {
                                "name": "外向",
                                "percentage": null,
                                "type": "E",
                                "value": 3
                            },
                            {
                                "name": "内向",
                                "percentage": null,
                                "type": "I",
                                "value": 8
                            }
                        ],
                        'JPLabels': [
                            {
                                "name": "随性",
                                "percentage": null,
                                "type": "P",
                                "value": 4
                            },
                            {
                                "name": "判断",
                                "percentage": null,
                                "type": "J",
                                "value": 7
                            }
                        ],
                        'SNLabels': [
                            {
                                "name": "实感",
                                "percentage": null,
                                "type": "S",
                                "value": 7
                            },
                            {
                                "name": "直觉",
                                "percentage": null,
                                "type": "N",
                                "value": 4
                            }
                        ],
                        'TFLabels': [
                            {
                                "name": "理智",
                                "percentage": null,
                                "type": "T",
                                "value": 7
                            },
                            {
                                "name": "情感",
                                "percentage": null,
                                "type": "F",
                                "value": 4
                            }
                        ]
                    }
                    Object.keys(data).map((res, index) => {
                        preferenceRef.current[index].innerHTML = '';
                        renderTeamProportion(preferenceRef.current[index], data[res])
                    })
                    const abilityPercentageMap: { [key: string]: any[] } = {
                        "责任心": [
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 9
                            },
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 0
                            }
                        ],
                        "耐心程度": [
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 2
                            },
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 0
                            },
                        ],
                        "判断能力": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 2
                            },
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 5
                            }
                        ],
                        "沟通能力": [
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 8
                            }
                        ],
                        "忠诚度": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 3
                            },
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 3
                            }
                        ],
                        "分析能力": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 1
                            }
                        ],
                        "创新力": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 10
                            }
                        ],
                        "抗压能力": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 2
                            },
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 3
                            }
                        ],
                        "适应能力": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 1
                            },
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 4
                            }
                        ],
                        "洞察力": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 2
                            },
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 5
                            }
                        ]
                    }
                    const arr: any[] = []
                    Object.keys(abilityPercentageMap).forEach(res => {
                        abilityPercentageMap[res].forEach(item => {
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
                if (preferenceRef?.current?.length > 0) {
                    const data: any = {
                        'EILabels': [
                            {
                                "name": "外向",
                                "percentage": null,
                                "type": "E",
                                "value": 3
                            },
                            {
                                "name": "内向",
                                "percentage": null,
                                "type": "I",
                                "value": 8
                            }
                        ],
                        'JPLabels': [
                            {
                                "name": "随性",
                                "percentage": null,
                                "type": "P",
                                "value": 4
                            },
                            {
                                "name": "判断",
                                "percentage": null,
                                "type": "J",
                                "value": 7
                            }
                        ],
                        'SNLabels': [
                            {
                                "name": "实感",
                                "percentage": null,
                                "type": "S",
                                "value": 7
                            },
                            {
                                "name": "直觉",
                                "percentage": null,
                                "type": "N",
                                "value": 4
                            }
                        ],
                        'TFLabels': [
                            {
                                "name": "理智",
                                "percentage": null,
                                "type": "T",
                                "value": 7
                            },
                            {
                                "name": "情感",
                                "percentage": null,
                                "type": "F",
                                "value": 4
                            }
                        ]
                    }
                    Object.keys(data).map((res, index) => {
                        preferenceRef.current[index].innerHTML = '';
                        renderTeamProportion(preferenceRef.current[index], data[res])
                    })
                    const abilityPercentageMap: { [key: string]: any[] } = {
                        "责任心": [
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 9
                            },
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 0
                            }
                        ],
                        "耐心程度": [
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 2
                            },
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 0
                            },
                        ],
                        "判断能力": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 2
                            },
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 5
                            }
                        ],
                        "沟通能力": [
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 8
                            }
                        ],
                        "忠诚度": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 3
                            },
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 3
                            }
                        ],
                        "分析能力": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 1
                            }
                        ],
                        "创新力": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 10
                            }
                        ],
                        "抗压能力": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 2
                            },
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 3
                            }
                        ],
                        "适应能力": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 1
                            },
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 4
                            }
                        ],
                        "洞察力": [
                            {
                                "name": "潜力低",
                                "percentage": null,
                                "type": null,
                                "value": 2
                            },
                            {
                                "name": "潜力高",
                                "percentage": null,
                                "type": null,
                                "value": 5
                            }
                        ]
                    }
                    const arr: any[] = []
                    Object.keys(abilityPercentageMap).forEach(res => {
                        abilityPercentageMap[res].forEach(item => {
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
                if (eachRef?.current?.length > 0) {
                    const data1: any = {
                        "决策能力": {
                            "1": 0,
                            "2": 3,
                            "3": 2,
                            "4": 1,
                            "5": 1,
                        },
                        "创新能力": {
                            "1": 0,
                            "2": 1,
                            "3": 5,
                            "4": 1,
                            "5": 0,
                        },
                        "协作能力": {
                            "1": 0,
                            "2": 4,
                            "3": 2,
                            "4": 1,
                            "5": 0,
                        },
                        "沟通能力": {
                            "1": 1,
                            "2": 1,
                            "3": 4,
                            "4": 1,
                            "5": 0,
                        },
                        "分析能力": {
                            "1": 0,
                            "2": 1,
                            "3": 1,
                            "4": 1,
                            "5": 4,
                        },
                        "应变能力": {
                            "1": 0,
                            "2": 6,
                            "3": 0,
                            "4": 1,
                            "5": 0,
                        }
                    }
                    abilityText.forEach((res, index) => {
                        eachRef.current[index].innerHTML = '';
                        const arr: LineChart[] = []
                        Object.keys(data1[res]).forEach(item => {
                            arr.push({ fraction: item, people: data1[res][item] })
                        })
                        renderLineChart(index, arr)
                    })
                }
            },
            'CA': () => {
                // 团队平均分和人群批评均分
                if (averageRef?.current?.length > 0) {
                    const data: Average[] = [
                        {
                            "fullScore": null,
                            "resultSimpleType": "SE型：安全/稳定型",
                            "resultType": "SE",
                            "score": 17.5,
                            'name': '团队平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "TF型：技术/职能型",
                            "resultType": "TF",
                            "score": 16.75,
                            'name': '团队平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "SV型：服务型",
                            "resultType": "SV",
                            "score": 17.8125,
                            'name': '团队平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "AU型：自主/独立型",
                            "resultType": "AU",
                            "score": 16.25,
                            'name': '团队平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "CH型：挑战型",
                            "resultType": "CH",
                            "score": 19.5625,
                            'name': '团队平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "GM型：管理型",
                            "resultType": "GM",
                            "score": 16.3125,
                            'name': '团队平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "LS型：生活型",
                            "resultType": "LS",
                            "score": 19.1875,
                            'name': '团队平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "EC型：创造/创业型",
                            "resultType": "EC",
                            "score": 16.625,
                            'name': '团队平均分'
                        },

                        {
                            "fullScore": null,
                            "resultSimpleType": "SE型：安全/稳定型",
                            "resultType": "SE1",
                            "score": 17.5,
                            'name': '人群平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "TF型：技术/职能型",
                            "resultType": "TF2",
                            "score": 13.75,
                            'name': '人群平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "SV型：服务型",
                            "resultType": "SV3",
                            "score": 20,
                            'name': '人群平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "AU型：自主/独立型",
                            "resultType": "AU4",
                            "score": 16.25,
                            'name': '人群平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "CH型：挑战型",
                            "resultType": "CH5",
                            "score": 90.5625,
                            'name': '人群平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "GM型：管理型",
                            "resultType": "GM6",
                            "score": 26.3125,
                            'name': '人群平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "LS型：生活型",
                            "resultType": "LS7",
                            "score": 39.1875,
                            'name': '人群平均分'
                        },
                        {
                            "fullScore": null,
                            "resultSimpleType": "EC型：创造/创业型",
                            "resultType": "EC8",
                            "score": 48.625,
                            'name': '人群平均分'
                        }
                    ]
                    averageRef.current[0].innerHTML = '';
                    renderAverage(data)
                }
            },
            'DISC': () => {
                // 团队偏好
                if (teamRef?.current?.length > 0) {
                    teamRef.current[0].innerHTML = '';
                    teamRef.current[1].innerHTML = '';
                    teamRef.current[2].innerHTML = '';
                    const data: TeamAnalysis[] = [
                        {
                            "name": "稳健支持型",
                            "type": "S",
                            "value": 2
                        },
                        {
                            "name": "支配掌握性",
                            "type": "D",
                            "value": 1
                        },
                        {
                            "name": "支配掌握性",
                            "type": "D",
                            "value": 1
                        },
                        {
                            "name": "社交影响型",
                            "type": "I",
                            "value": 2
                        }
                    ]
                    const dcAndIsLabels: TeamAnalysis[] = [
                        {
                            "name": "任务导向",
                            "type": "DC",
                            "value": 345
                        },
                        {
                            "name": "人际导向",
                            "type": "IS",
                            "value": 0
                        }
                    ]
                    const diAndScLabels: TeamAnalysis[] = [
                        {
                            "name": "外倾",
                            "type": "DI",
                            "value": 0
                        },
                        {
                            "name": "内倾",
                            "type": "SC",
                            "value": 188
                        }
                    ]
                    renderTeamAnalysis(data)
                    renderTeamProportion(teamRef.current[1], dcAndIsLabels)
                    renderTeamProportion(teamRef.current[2], diAndScLabels)
                }
            },
        }
        props.type && currEleType[props.type]()
    }, [chartList])
    // 查看所有tags
    const onMagnifyClick = () => {
        lookAllTagsRef?.current?.openModal(chartList?.characterProportions)
    }
    // 测评完成率
    const completionList = () => {
        const liquidPlot = new Liquid(visualRef.current[0], {
            percent: (Number(chartList?.finishDegree) || 0) / 100,
            height: 88,
            width: 88,
            outline: {
                border: 2,
                style: {
                    stroke: '#F1F7FF',
                    // strokeOpacity: 0.9
                },
                distance: 4,
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
        const piePlot = new Pie(visualRef.current[1], {
            height: 88,
            // width: 88,
            data: chartList?.personalityProportions || [],
            angleField: 'value',
            colorField: 'name',
            color: ['#5B8FF9', '#5AD8A6', '#F6BD16', '#E8684A', '#6DC8EC', '#9270CA', '#FF9D4D', '#269A99', '#FF99C3', '#5D7092',
                '#BDD2FD', '#BDEFDB', '#FBE5A2', '#F6C3B7', '#B6E3F5', '#D3C6EA', '#FFD8B8', '#AAD8D8', '#FFD6E7', '#C2C8D5'],
            radius: 1,
            innerRadius: 0.6,
            pieStyle: {
                lineWidth: 7,
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
                offsetX: -80,
                // itemWidth: 300,
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
        piePlot.on('element:click', (ev: any) => {
            // getTableList({ resultType: ev.data.data.name })
        })
        piePlot.render()
    }
    // 各项能力折线图
    const renderLineChart = (index: number, data: LineChart[]) => {
        const line = new Line(eachRef.current[index], {
            data,
            width: 160,
            height: 120,
            xField: 'fraction',
            yField: 'people',
            label: {
                formatter: '',
            },
            point: {
                size: 3,
                shape: 'custom-point',
                style: {
                    fill: '#2B85FF',
                },
            },
            yAxis: {
                grid: {
                    line: undefined
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
        const plot = new Column(averageRef.current[0], {
            data,
            isGroup: true,
            xField: 'resultSimpleType',
            yField: 'score',
            seriesField: 'name',
            // 分组柱状图 组内柱子间的间距 (像素级别)
            dodgePadding: 5,
            columnWidthRatio: 0.3,
            tooltip: {
                showTitle: false,
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
            columnWidthRatio: 0.2,
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
                lineWidth: 7,
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
                // itemName: {
                //     formatter: (text: string, item: any, index: number) => {
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
        const stackedColumnPlot = new Column(preferenceRef.current[4], {
            data,
            isStack: true,
            xField: 'name',
            yField: 'value',
            seriesField: 'type',
            // 分组柱状图 组内柱子间的间距 (像素级别)
            dodgePadding: 5,
            columnWidthRatio: 0.3,
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
                        <div ref={el => teamRef.current[0] = el}></div>
                    </div>
                    <div className={`${styles.teamProportion} ${styles.border}`}>
                        <p>团队偏好占比</p>
                        <div className={styles.teamProportionWrapper}>
                            <span ref={el => teamRef.current[1] = el}></span>
                            <span ref={el => teamRef.current[2] = el}></span>
                        </div>
                    </div>
                </ul>,
            "MBTI_O":
                <Fragment>
                    <div className={`${styles.preference} ${styles.border}`}>
                        <p>倾向偏好占比</p>
                        <div className={styles.chartList}>
                            {
                                [0, 1, 2, 3].map(res => (
                                    <div key={res} ref={el => preferenceRef.current[res] = el} />
                                ))
                            }
                        </div>
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
                        <div className={styles.chartList}>
                            {
                                [0, 1, 2, 3].map(res => (
                                    <div key={res} ref={el => preferenceRef.current[res] = el} />
                                ))
                            }
                        </div>
                    </div>
                    <div className={`${styles.potential} ${styles.border}`}>
                        <p>潜在能力分析 </p>
                        <div ref={el => preferenceRef.current[4] = el} className={styles.chartList} />
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
                    <p>团队平均分和人群批评均分 </p>
                    <div className={styles.average_div} ref={el => averageRef.current[0] = el}></div>
                </div>
        }
        return curType[props.type]
    }
    // 查看全部
    const onLookAllClick = () => {
        props.onTabChange('2')
    }
    // 查看全部
    return (
        <Fragment>
            <div className={styles.overviewSta}>
                <div className={styles.overviewEval}>
                    <h1>测评概览 </h1>
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
                                <p>{chartList.totalNum || 0}</p>
                                <p>已完成</p>
                            </div>
                            <div className={styles.card}>
                                <p>{(chartList.totalNum - chartList.finishNum) || 0}</p>
                                <p>未完成</p>
                            </div>
                            <div className={styles.card} >
                                <p>{(chartList.totalNum - chartList.finishNum) || 0}</p>
                                <p>测评中</p>
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
                            <div ref={(el) => visualRef.current[1] = el} />
                        </div>
                    </div>
                    <div className={`${styles.tags} ${styles.border}`}>
                        <p>性格标签分布</p>
                        {
                            (chartList?.characterProportions || []).length > 0 &&
                            <Button type='link' className={styles.more} onClick={onMagnifyClick}>更多</Button>
                        }
                        <div className={styles.detail_distribution_wrapper}>
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