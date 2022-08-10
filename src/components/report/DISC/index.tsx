import { Column, Pie } from '@antv/g2plot';
import React, { useEffect, useRef } from 'react';
import cs from 'classnames';
import styles from './index.module.less';


const DISCDetail = (props: any) => {
    const { resultDetail } = props; 
    useEffect(() => {
        columnChart();
        rateChart();
        return () => {};
    }, []);

    const column: any = useRef();
    const pie: any = useRef();

    const columnChart = () => {
        const data = [
            { type: '支配性\nD', value: 1 },
            { type: '影响性\nI', value: 2 },
            { type: '稳健性\nS', value: 3 },
            { type: '谨慎性\nC', value: 4 },
        ];
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
            content: (originData: any) => {
            const val = parseFloat(originData.value);
            if (val < 0.05) {
                return (val * 100).toFixed(1) + '%';
            }
            },
            offset: 10,
        },
        legend: false,
        xAxis: {
            label: {
            autoHide: true,
            autoRotate: false,
            },
        },
        });

        columnPlot.render();
    }

    const rateChart = () => {
        const data = [
            { type: '支配性', value: 27 },
            { type: '影响性', value: 25 },
            { type: '稳健性', value: 18 },
            { type: '分类四', value: 15 },
          ];
          
          const piePlot = new Pie(pie.current, {
            appendPadding: 10,
            data,
            angleField: 'value',
            colorField: 'type',
            radius: 0.8,
            legend: false,
            color: ({ type }) => {
                if (type === '支配性') {
                    return '#52BEEA';
                }
                if (type === '影响性') {
                    return '#5DD89E';
                }
                if (type === '稳健性') {
                    return '#908AEA';
                }
                return '#F77E70';
            },
            label: {
              type: 'outer',
              content: '{name} {percentage}',
            },
            interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
          });
          
          piePlot.render();
    }

    return (
        <div className={styles.details}>
            <div className={styles.home}>
                <div className={styles.logo}>
                    <img src="https://qzz-static.forwe.store/public-assets/qcp-logo.png?x-oss-process=image/resize,m_fill,w_24,h_24" alt=""/>
                    <span className="name">趣测评</span>
                </div>
                <div className={styles.pdfPro}>
                    <div className={styles.image}>

                    </div>
                    <div className={styles.header}>
                        <p>[DISC]</p>
                        <p className={styles.fw_600}>人才甄选测验</p>
                        <p className={styles.title}>测评报告</p>
                        <p className={styles.pro}>careeranchor</p>
                    </div>
                </div>
                <div className={styles['user-info']}>
                    <p className={styles.title}>{resultDetail?.user?.name}</p>
                    <p className={styles['sub-title']}>{resultDetail?.user && Gender[resultDetail?.user?.gender]}</p>
                    <p className={styles['sub-title']}>{resultDetail?.created}</p>
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
                    <p>DISC作用</p>
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
                        <div ref={column} style={{width: '100%', height: '100%'}}></div>
                    </div>
                </div>
                <div className={styles.chart}>
                    <p>得分饼图</p>
                    <div className={styles.pieChart}>
                        <div ref={pie} style={{width: '100%', height: '100%'}}></div>
                    </div>
                </div>
            </div>
            <div className={styles.page}>
                <div className={cs(styles.sub_title, styles.m_b_32)}>三、测评得分分析</div>
                <p className={styles.subTitle}>您的测评结果是：DI主导（75%）DIS</p>
                <div className={styles.line}>
                    <div className={styles.topBorder}></div>
                    <div className={styles.bottomBorder}></div>
                </div>
                <div className={styles.describe}>
                    <p className={styles.title}>一、典型描述</p>
                    <p>这种典型行为风格,可被大致描述为是"总结者"的类型。这种类型的人通常是非常强烈的个人主义者。
                        他们富于梦想,不断进取而且为达目的不懈努力。他们能量充沛又直接主动。总结者对自己和周围的
                        人都有较高的标准,对他人很有影响力,能激励他人去实现目标。总结者会看上去冷酷或迟钝，因为他
                        们是典型的任务取向者。他们很容易发脾气, 尤其是感受到被超越时，因此他们总是不断向前。</p>
                </div>
                <div className={styles.describe}>
                    <p className={styles.title}>二、典型描述</p>
                    <p>这种典型行为风格,可被大致描述为是"总结者"的类型。这种类型的人通常是非常强烈的个人主义者。
                        他们富于梦想,不断进取而且为达目的不懈努力。他们能量充沛又直接主动。总结者对自己和周围的
                        人都有较高的标准,对他人很有影响力,能激励他人去实现目标。总结者会看上去冷酷或迟钝，因为他
                        们是典型的任务取向者。他们很容易发脾气, 尤其是感受到被超越时，因此他们总是不断向前。</p>
                </div>
            </div>
            <div className={styles.page}>
                <div className={cs(styles.sub_title, styles.m_b_24)}>四、特征分析（一）</div>
                <div className={styles.four_title}>
                    <p>D（Dominance）-支配掌控型</p>
                    <div className={styles.progress}>
                        <div className={styles.jd}>20%</div>
                    </div>
                </div>
                <div className={styles.tag}>
                    <div className={styles.title}>
                        <div className={styles.content}>
                            <i className="iconfont" />
                            <span>标签</span>
                        </div>
                    </div>
                    <div className={styles.list}>
                        <p>主动得开拓者</p>
                        <p>主动得开拓者</p>
                        <p>主动得开拓者</p>
                        <p>主动得开拓者</p>
                        <p>主动得开拓者</p>
                    </div>
                </div>
                <div className={styles.tag}>
                    <div className={styles.title}>
                        <div className={styles.content}>
                            <i className="iconfont" />
                            <span>优势</span>
                        </div>
                    </div>
                    <div className={styles.detailList}>
                        <p>主动得开拓者</p>
                        <p>主动得开拓者</p>
                        <p>主动得开拓者</p>
                        <p>主动得开拓者</p>
                        <p>主动得开拓者</p>
                    </div>
                </div>
                <div className={styles.tag}>
                    <div className={styles.title}>
                        <div className={styles.content}>
                            <i className="iconfont" />
                            <span>劣势</span>
                        </div>
                    </div>
                    <div className={styles.detailList}>
                        <p>主动得开拓者</p>
                        <p>主动得开拓者</p>
                        <p>主动得开拓者</p>
                        <p>主动得开拓者</p>
                        <p>主动得开拓者</p>
                    </div>
                </div>
                <div className={styles.line}>
                    <div className={styles.topBorder}></div>
                    <div className={styles.bottomBorder}></div>
                </div>
                <div className={styles.describe}>
                    <p className={styles.title}>- 在情感方面</p>
                    <p>D型人一个坚定果敢的人，酷好变化，喜欢控制，干劲十足，独立自主，
                        超级自信。可是，由于比较不会顾及别人的感受，所以显得粗鲁、霸道、没有耐心、
                        穷追不舍、不会放松。D型人不习惯与别人进行感情上的交流，不会恭维人，不喜欢眼泪，匮乏同情心。 </p>
                </div>
            </div>
        </div>
    )
}

export default DISCDetail;