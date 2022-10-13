import { Column, Pie } from '@antv/g2plot';
import React, { useEffect, useRef } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import { Gender } from '../MBTI/type';
import { getAppIdType } from '@/utils/utils'

const numToStr: any = {
    0: '一',
    1: '二',
    2: '三',
    3: '四',
};
const DISCDetail = (props: any) => {
    const { resultDetail } = props;
    const appType = getAppIdType()
    useEffect(() => {
        if (resultDetail?.discData) {
            columnChart(resultDetail?.discData || []);
            rateChart(resultDetail?.discData || []);
        }
        return () => { };
    }, [resultDetail?.discData]);

    const column: any = useRef();
    const pie: any = useRef();

    const columnChart = (data: any) => {
        column.current.innerHTML = ''
        const columnPlot = new Column(column.current, {
            data,
            xField: 'type',
            yField: 'value',
            seriesField: '',
            maxColumnWidth: 40,
            color: ({ type }) => {
                if (type === '支配性\nD') {
                    return '#52BEEA';
                }
                if (type === '影响性\nI') {
                    return '#5DD89E';
                }
                if (type === '稳健性\nS') {
                    return '#908AEA';
                }
                return '#F77E70';
            },
            label: {
                position: 'top',
                // 可配置附加的布局方法
                layout: [
                    // 柱形图数据标签位置自动调整
                    // { type: 'interval-adjust-position' },
                    // 数据标签防遮挡
                    { type: 'interval-hide-overlap' },
                    // 数据标签文颜色自动调整
                    // { type: 'adjust-color' },
                ],
                style: {
                    fill: 'rgba(155, 161, 168, 1)',
                    fontSize: 12
                },
            },
            yAxis: {
                label: {
                    style: {
                        fill: 'rgba(155, 161, 168, 1)',
                        fontSize: 12
                    },
                },
                line: {
                    style: {
                        stroke: 'rgba(209, 216, 231, 1)',
                        lineWidth: 1
                    }
                },
                grid: {
                    alternateColor: 'rgba(247, 247, 247, 1)',
                    line: {
                        style: {
                            stroke: 'rgba(209, 216, 231, 1)',
                            lineWidth: 0
                        }
                    },
                },
            },
            legend: false,
            tooltip: false,
            padding: [30, 25, 30, 25],
            xAxis: {
                line: {
                    style: {
                        stroke: 'rgba(209, 216, 231, 1)',
                        lineWidth: 1
                    }
                },
                label: {
                    style: {
                        fill: 'rgba(155, 161, 168, 1)',
                        fontSize: 12
                    },
                    autoHide: true,
                    autoRotate: false,
                },
            },
        });

        columnPlot.render();
    }

    const rateChart = (data: any) => {
        pie.current.innerHTML = ''
        const piePlot = new Pie(pie.current, {
            // appendPadding: 10,
            data,
            angleField: 'percent',
            colorField: 'name',
            radius: 0.8,
            legend: false,
            color: ({ name }) => {
                if (name === '支配性') {
                    return '#52BEEA';
                }
                if (name === '影响性') {
                    return '#5DD89E';
                }
                if (name === '稳健性') {
                    return '#908AEA';
                }
                return '#F77E70';
            },
            label: {
                type: 'outer',
                content: '{name}（{value}%）',
                style: {
                    fill: 'rgba(155, 161, 168, 1)',
                    fontSize: '12px'
                },
            },
            interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
        });

        piePlot.render();
    }

    return (
        <div className={styles.details}>
            <div className={styles.home}>
                <div className={styles.logo}>
                <img
                    src={appType === '1' ? "https://qzz-static.forwe.store/public-assets/qcp-logo.png?x-oss-process=image/resize,m_fill,w_24,h_24" : '//qzz-static.forwe.store/evaluation-web/imgs/xdjy/xdjy_logo.png'}
                    alt=""
                    />
                <span className="name">
                    {
                    appType === '1' ? '趣测评' : '招才选将'
                    }
                </span>
                </div>
                <div className={styles.pdfPro}>
                    <div className={styles.image}>
                        <img src="https://qzz-static.forwe.store/evaluation-mng/imgs/qcp_disc_bg1.png" />
                    </div>
                    <div className={styles.header}>
                        <p>[DISC]</p>
                        <p className={styles.fw_600}>人才甄选测验</p>
                        <p className={styles.title}>测评报告</p>
                        <p className={styles.pro}>Talent selection and evaluation</p>
                    </div>
                </div>
                <div className={styles['user-info']}>
                    <p className={styles.title}>{resultDetail?.user?.name}</p>
                    <p className={styles['sub-title']}>{resultDetail?.user && Gender[resultDetail?.user?.gender]}</p>
                    <p className={styles['sub-title']}>{resultDetail?.created}</p>
                </div>
                <div className={styles.footerImg}>
                    <div className={styles.image}>
                        <img src="https://qzz-static.forwe.store/evaluation-mng/imgs/qcp_disc_bg2.png" />
                    </div>
                </div>
                <div className={styles.footer}>鑫蜂维网络科技有限公司 版权所有</div>
            </div>
            <div className={styles.page}>
                <div className={cs(styles.sub_title, styles.m_b_43)}>
                    一、报告导语
                </div>
                <div className={styles.account}>
                    <p className={styles.title}>测评背景简介</p>
                    <p>DISC个性测验是国外企业广泛应用的一种人格测验，用于测查、评估和帮助人们改善其行为方式、人际关系、工作绩效、团队合作、领导风格等。 </p>
                    <p>DISC个性测验由24组描述个性特质的形容词构成，每组包含四个形容词，这些形容词是根据支配性（D）、影响性（I）、谨慎性（C）、 稳健性（S）和四个测量维度以及一些干扰维度来选择的。</p>
                </div>
                <div className={styles.production}>
                    <img src="https://qzz-static.forwe.store/evaluation-mng/imgs/qcp_disc_pro.png" alt="说明" />
                </div>
                <article className={cs(styles.account, styles.m_b_36)}>
                    <p className={styles.fw_600}>DISC作用</p>
                    <p>人格与管理活动的关系十分密切，它在一定程度上决定了个体适合什么样的工作及可能取得的绩效，可以通过诊断一个人的人格特征，来确定其管理的成功与否。</p>
                    <p>
                        研究证明：人格会影响到职业选择、工作满意
                        <span>职业选择、工作满意度、压力感、领导行为和工作绩效</span>
                        的某些方面。DISC个性测验就是一种人格测验，为企业的人事甄选、录用、岗位安置提供了良好的测评手段。
                    </p>
                </article>
            </div>
            <div className={styles.page}>
                <div className={cs(styles.sub_title, styles.m_b_43)}>二、测评结果得分</div>
                <div className={styles.chart}>
                    <p>得分柱状图</p>
                    <div className={styles.columnChart}>
                        <div ref={column} style={{ width: '100%', height: '100%' }}></div>
                    </div>
                </div>
                <div className={styles.chart}>
                    <p>得分饼图</p>
                    <div className={styles.pieChart}>
                        <div ref={pie} style={{ width: '100%', height: '100%' }}></div>
                    </div>
                </div>
            </div>
            <div className={styles.page}>
                <div className={cs(styles.sub_title, styles.m_b_32)}>三、测评得分分析</div>
                <p className={styles.subTitle}>您的测评结果是：<span>{resultDetail?.results?.[0]?.type}</span></p>
                <div className={styles.line}>
                    <div className={styles.topBorder}></div>
                    <div className={styles.bottomBorder}></div>
                </div>
                <div className={styles.describe}>
                    <p className={styles.title}>一、典型描述</p>
                    <p>{resultDetail?.htmlDesc?.describe}</p>
                </div>
                <div className={styles.describe}>
                    <p className={styles.title}>二、行为特征</p>
                    <p>{resultDetail?.htmlDesc?.behavior}</p>
                </div>
                <div className={styles.describe}>
                    <p className={styles.title}>三、交流沟通</p>
                    <p>{resultDetail?.htmlDesc?.communication}</p>
                </div>
                <div className={styles.describe}>
                    <p className={styles.title}>四、能力特征</p>
                    <p>{resultDetail?.htmlDesc?.ability}</p>
                </div>
                <div className={styles.describe}>
                    <p className={styles.title}>五、行为优势</p>
                    <p>{resultDetail?.htmlDesc?.advantage}</p>
                </div>
                <div className={styles.describe}>
                    <p className={styles.title}>六、行为弱势</p>
                    <p>{resultDetail?.htmlDesc?.inferiority}</p>
                </div>
            </div>
            {
                resultDetail?.htmlDesc?.features?.map((it: any, index: number) => (
                    <div className={styles.page} key={it.type}>
                        <div className={cs(styles.sub_title, styles.m_b_24)}>四、特征分析（{numToStr[index]}）</div>
                        <div className={styles.four_title}>
                            <p>{it.name}</p>
                            <div className={styles.progress}>
                                <div className={cs(styles.jd, styles[`jd_${it.type}`])} style={{ width: `${resultDetail?.scoreDetail?.[it.type]?.fullScore}%` }}>{resultDetail?.scoreDetail?.[it.type]?.fullScore}%</div>
                            </div>
                        </div>
                        <div className={styles.tag}>
                            <div className={cs(styles.title, styles[`${it.type}-content`])}>
                                <div className={styles.content}>
                                    <i className="iconfont icon-biaoqian" />
                                    <span>标签</span>
                                </div>
                            </div>
                            <div className={styles.list}>
                                {
                                    it?.tag.map((item: string) => (
                                        <p key={item}>{item}</p>
                                    ))
                                }
                            </div>
                        </div>
                        <div className={styles.tag}>
                            <div className={cs(styles.title, styles[`${it.type}-content`])}>
                                <div className={styles.content}>
                                    <i className="iconfont icon-youshi" />
                                    <span>优势</span>
                                </div>
                            </div>
                            <div className={styles.detailList}>
                                {
                                    it?.advantage.map((item: string) => (
                                        <p className={styles.advantage} key={item}>
                                            <span className={styles.icon}><i className="iconfont dagousvg" /></span>
                                            <span>{item}</span>
                                        </p>
                                    ))
                                }
                            </div>
                        </div>
                        <div className={styles.tag}>
                            <div className={cs(styles.title, styles[`${it.type}-content`])}>
                                <div className={styles.content}>
                                    <i className="iconfont icon-lieshi" />
                                    <span>劣势</span>
                                </div>
                            </div>
                            <div className={styles.detailList}>
                                {
                                    it?.inferiority.map((item: string) => (
                                        <p key={item}>{item}</p>
                                    ))
                                }
                            </div>
                        </div>
                        <div className={styles.line}>
                            <div className={styles.topBorder}></div>
                            <div className={styles.bottomBorder}></div>
                        </div>
                        <div className={styles.describe}>
                            <p className={styles.title}>- 在情感方面</p>
                            <p>{it.emotion}</p>
                        </div>
                        <div className={styles.describe}>
                            <p className={styles.title}>- 在工作方面</p>
                            <p>{it.work}</p>
                        </div>
                        <div className={styles.describe}>
                            <p className={styles.title}>- 在人际关系方面</p>
                            <p>{it.interpersonal}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default DISCDetail;