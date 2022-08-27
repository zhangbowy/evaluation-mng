import React, { useEffect, useRef, useState } from 'react'
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts/core';
import { BarChart, FunnelChart } from 'echarts/charts';
import { LegendComponent } from 'echarts/components';
import styles from './index.module.less';
import { Column, Pie, Funnel } from '@antv/g2plot';
import cs from 'classnames';
import * as dayjs from 'dayjs'

const groupData = [
  {
    "name": "平均分",
    "type": "管理型",
    "score": 17
  },
  {
    "name": "平均分",
    "type": "技术/职能型",
    "score": 19
  },
  {
    "name": "平均分",
    "type": "安全/稳定型",
    "score": 18
  },
  {
    "name": "平均分",
    "type": "创造/创业型",
    "score": 18
  },
  {
    "name": "平均分",
    "type": "自主/独立型",
    "score": 19
  },
  {
    "name": "平均分",
    "type": "服务型",
    "score": 18
  },
  {
    "name": "平均分",
    "type": "挑战型",
    "score": 19
  },
  {
    "name": "平均分",
    "type": "生活型",
    "score": 18
  }
]
const colorMap: any = {
  LS: '#C16E6E',
  AU: '#D18857',
  EC: '#B7A36C',
  CH: '#A6CA80',
  SE: '#65BBA8',
  SV: '#69B8D7',
  TF: '#6A9EC5',
  GM: '#7666AF'
}
echarts.use([CanvasRenderer, BarChart, FunnelChart, LegendComponent ]);
const CA = ({ resultDetail }: any) => {
  const containerRef: any = useRef();
  const columnsRef: any = useRef();
  const groupRef: any = useRef();
  const [resultList, setResultList] = useState<any>();
  const [otherResult, setOtherResult] = useState<any>([]);
  const [typeStr, setTypeStr] = useState<string>('');

  const getOptions = () => {
    const json = resultDetail?.scoreDetail? resultDetail?.scoreDetail : {};
    let dataFunnel = Object.keys(json).map((key) => ({
        name: json[key].resultType.split('：')[1],
        score: json[key].score,
    }));
    dataFunnel = dataFunnel.sort((a: any, b: any) => a.score - b.score).map((v, index) => ({
      ...v,
      value: index + 1
    }))
    return {
      // tooltip: {
      //   trigger: 'item',
      //   formatter: '{a} <br/>{b} : {c}%'
      // },
      // toolbox: {
      //   feature: {
      //     dataView: { readOnly: false },
      //     restore: {},
      //     saveAsImage: {}
      //   }
      // },
      color: ['#6A9EC5', '#6A9EC5', '#69B8D7', '#65BBA8', '#A6CA80', '#B7A36C', '#D18857', '#C16E6E'],
      legend: {
        data: ['管理型', '技术/职能型', '安全/稳定型', '创造/创业型', '自主/独立型', '服务型', '挑战型', '生活型'],
        show: false
      },
      series: [
        {
          name: 'Funnel',
          type: 'funnel',
          left: '0',
          top: 60,
          bottom: 60,
          width: '80%',
          min: 0,
          max: 8,
          minSize: '0%',
          maxSize: '100%',
          sort: 'ascending',
          gap: 2,
          label: {
            show: true,
            position: 'right',
            formatter: ({ data }: any) => {
              return `${data.name}(${data.score})`;
            },
            padding: [0, 0, 0, 2]
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          emphasis: {
            label: {
              fontSize: 20
            }
          },
          data: dataFunnel
        }
      ]
    }
  };
  useEffect(() => {
    if (resultDetail) {
        radarMap()
        columnMap()
        groupColumnMap();
        // funnelMap();
        const myChart = echarts.init(document.getElementById('pyramid') as HTMLElement);
        const options = getOptions();
        myChart.setOption(options);
    }
  }, [containerRef.current, resultDetail])
  useEffect(() => {
    const { htmlDesc = {}, results = [] } = resultDetail;
    let str = '';
    results.map((v: any) => {
      str += `${v.type.split('：')[1]}+`
    })
    str = str.substring(0, str.length - 1);
    setTypeStr(str);
    const data = Object.keys(htmlDesc).map((key) => {
      return {
        type: key,
        ...htmlDesc[key],
      }
    });
    setOtherResult(data);
  }, [resultDetail]);
  const radarMap = () => {
    containerRef.current.innerHTML = ''
    const json = resultDetail?.scoreDetail? resultDetail?.scoreDetail : {};
    const dataPie = Object.keys(json).map((key) => ({
        item: json[key].resultType,
        a: json[key].fullScore,
    }));
    const radarPlot = new Pie(containerRef.current, {
        data: dataPie,
        appendPadding: 10,
        height: 250,
        angleField: 'a',
        colorField: 'item',
        radius: 0.65,
        legend: false,
        color: ['#65BBA8', '#6A9EC5', '#69B8D7', '#D18857', '#A6CA80', '#C16E6E', '#D18857', '#B7A36C'],
        label: {
          type: 'spider',
          labelHeight: 28,
          content: '{name}\n{percentage}',
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    })
    radarPlot.render();
  }
  const columnMap = () => {
    columnsRef.current.innerHTML = ''
    const json = resultDetail?.scoreDetail? resultDetail?.scoreDetail : {};
    const dataColumn = Object.keys(json).map((key) => ({
      type: json[key].resultType.split('：')[1],
      value: json[key].score,
    }));
    const columnPlot = new Column(columnsRef.current, {
      data: dataColumn,
      xField: 'type',
      yField: 'value',
      seriesField: '',
      maxColumnWidth: 40,
      height: 250,
      columnWidthRatio: 0.3,
      color: ({ type }) => {
          if (type === '管理型') {
              return '#7666AF';
          }
          if (type === '技术/职能型') {
              return '#6A9EC5';
          }
          if (type === '安全/稳定型') {
              return '#69B8D7';
          }
          if (type === '创造/创业型') {
            return '#65BBA8';
          }
          if (type === '自主/独立型') {
            return '#A6CA80';
          }
          if (type === '服务型') {
            return '#B7A36C';
          }
          if (type === '挑战型') {
            return '#D18857';
          }
          if (type === '生活型') {
            return '#C16E6E';
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
                  fontSize: 12,
                  color: '#8F969E'
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
                  lineWidth: 1,
                  color: '#8F969E'
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
    })
    columnPlot.render();
  }
  const groupColumnMap = () => {
    groupRef.current.innerHTML = ''
    const json = resultDetail?.scoreDetail? resultDetail?.scoreDetail : {};
    let data = Object.keys(json).map((key) => ({
        name: "得分",
        type: json[key].resultType.split('：')[1],
        score: json[key].score
    }));
    data = data.concat(groupData);
    const columnPlot = new Column(groupRef.current, {
      data,
      isGroup: true,
      xField: 'type',
      yField: 'score',
      seriesField: 'name',
      height: 250,
      columnWidthRatio: 0.5,
      // 分组柱状图 组内柱子间的间距 (像素级别)
      dodgePadding: 2,
      legend: {
        layout: 'horizontal',
        position: 'bottom'
      },
      color: ['#B7A36C', '#6A9EC5', '#000000'],
      label: {
        // 可手动配置 label 数据标签位置
        position: 'top', // 'top', 'middle', 'bottom'
        // 可配置附加的布局方法
        layout: [
          // 柱形图数据标签位置自动调整
          { type: 'interval-adjust-position' },
          // 数据标签防遮挡
          { type: 'interval-hide-overlap' },
          // 数据标签文颜色自动调整
          { type: 'adjust-color' },
        ],
      },
      yAxis: {
        label: {
            style: {
                fill: 'rgba(155, 161, 168, 1)',
                fontSize: 12,
                color: '#8F969E'
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
    })
    columnPlot.render();
  }

  return (
    <div className={styles.details}>
      <div className={styles.home}>
        <div className={styles.logo}>
          <img src="https://qzz-static.forwe.store/public-assets/qcp-logo.png?x-oss-process=image/resize,m_fill,w_24,h_24" alt="" />
          <span className="name">趣测评</span>
        </div>
        <div className={styles.pdfPro}>
          <div className={styles.image}>
              <img src="https://qzz-static.forwe.store/evaluation-web/imgs/xdjy/xdjy_ca_icon1.png" />
          </div>
          <div className={styles.header}>
              <p>PDP</p>
              <p className={styles.fw_600}>职业性格测试</p>
              <p className={styles.title}>测评报告</p>
              <p className={styles.pro}>Professional personality assessment</p>
          </div>
        </div>
        <div className={styles['user-info']}>
          <p className={styles.title}>{resultDetail?.user?.name}</p>
          <p className={styles['sub-title']}>{resultDetail?.user?.gender === 1 ? '男' : '女'}</p>
          <p className={styles['sub-title']}>{dayjs(resultDetail?.created).format('YYYY-MM-DD')}</p>
        </div>
        <div className={styles.footerImg}>
          <div className={styles.image}>
              <img src="https://qzz-static.forwe.store/evaluation-web/imgs/xdjy/xdjy_ca_icon2.png" />
          </div>
        </div>
        <div className={styles.footer}>鑫蜂维网络科技有限公司 版权所有</div>
      </div>
      <div className={styles.page}>
        <div className={cs(styles.sub_title, styles.m_b_43)}>
          一、报告导语
        </div>
        <div className={cs(styles['page-content'], styles['page-first'])}>
          <div className={styles['page-first-top']}>
            <p className={styles['page-first-top-title']}>测评背景简介</p>
            <p className={styles['page-first-top-par']}>职业锚是个体对自己在成长过程中慢慢形成的态度、价值观与天赋的自我认知，它体现了“真实的自我”。</p>
            <div className={styles['page-first-top-detail']}>
              <p>职业锚决定个体会选择什么样的职业与什么类型的工作单位；</p>
              <p>决定个体是否会喜欢所从事的工作，是否会跳槽。</p>
              <p>决定个体在工作中是否有成就感。</p>
              <p>换言之，一个人不得不作出选择的时候，他无论如何都不会放弃的职业中的那种至关重要的东西和价值观。 换言之，就是核心价值观。</p>
            </div>
          </div>
          <div className={styles['page-first-bottom']}>
            <p className={styles['page-first-bottom-title']}>职业锚的作用</p>
            <p className={styles['page-first-bottom-par']}>施恩1978年开始在“职业动力论”研究中使用“职业锚”的概念，此概念有助于职业工作者进行职业定位，让职业者更有信心对选择的职业成为终身事业。</p>
            <img src="https://qzz-static.forwe.store/evaluation-web/imgs/xdjy/xdjy_ca_img1.png" alt="职业锚" />
          </div>
        </div>
      </div>
      <div>
        <div className={styles.page}>
          <div className={cs(styles.sub_title, styles.m_b_43)}>
            二、测评结果分析
          </div>
          <div className={cs(styles['page-content'], styles['page-two'])}>
            <div className={styles['page-two-top']}>
              <div className={cs(styles['page-two-title'], styles.title)}>职业锚测试饼图</div>
              <div ref={containerRef} />
            </div>
            <div className={styles['page-two-bottom']}>
              <div className={styles.title}>你的职业锚类型是</div>
                <div className={styles['page-two-bottom-type']}>
                  <div className={styles['page-two-bottom-type-detail']}>
                    <p className={styles['page-two-bottom-type-detail-text']}>
                      {typeStr}
                    </p>
                    {/* <p className={styles['page-two-bottom-type-detail-tip']}>General Managerial Competence</p> */}
                  </div>
                  {
                    resultDetail?.results?.map((item: any, index: number) => (
                      <div key={item.simpleType} className={styles['page-two-bottom-type-position']}>
                        <span>{item.type.split('：')[1]}岗位匹配：{resultDetail?.htmlDescList[index].matching}</span>
                      </div>
                    ))
                  }
                </div>
            </div>
          </div>
        </div>
        <div className={styles.page}>
          <div className={cs(styles['page-content'], styles['page-three'])}>
            <div className={styles['page-three-top']}>
              <div className={cs(styles.title, styles['page-three-top-title'])}>得分柱状图</div>
              <div ref={columnsRef}></div>
            </div>
            <div className={styles['page-three-bottom']}>
              <div className={cs(styles.title, styles['page-three-bottom-title'])}>得分与人群平均分比较</div>
              <div ref={groupRef}></div>
            </div>
          </div>
        </div>
        <div className={styles.page}>
          <div className={cs(styles['page-content'], styles['page-four'])}>
            <div className={styles['page-four-top']}>
              <div className={cs(styles.title, styles['page-four-top-title'])}>
                分数分布图
              </div>
              {/* <div id='pyramid' ref={funnelRef}></div> */}
              <div id='pyramid' className={styles.pyramidCharts}></div>
            </div>
            {
              resultDetail?.results?.map((item: any, index: number) => (
                <div key={item.simpleType} className={styles['page-four-bottom']}>
                  <div className={styles['page-four-bottom-progress']}>
                    <div className={cs(styles.title, styles['page-four-bottom-progress-title'])}>
                      {item.type.split('：')[1]}占比
                    </div>
                    <div className={styles['page-four-bottom-progress-out']}>
                      <div
                        style={{ width: `${item.percentageScore}%`, backgroundColor: colorMap[item.simpleType] }}
                        className={styles['page-four-bottom-progress-inner']}
                      >
                        {item.percentageScore}% 
                      </div>
                    </div>
                  </div>
                  <div className={styles['page-four-bottom-item']}>
                    <div className={styles['page-four-bottom-title']}>类型描述</div>
                    <div className={styles['page-four-bottom-content']}>
                      <div className={styles['page-four-bottom-content-item']}>
                        <span className={styles['page-four-bottom-content-item-text']}>
                          {
                            resultDetail?.htmlDescList[index].character
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles['page-four-bottom-item']}>
                    <div className={styles['page-four-bottom-title']}>典型特征</div>
                    <div className={styles['page-four-bottom-content']}>
                      <div className={styles['page-four-bottom-content-item']}>
                        <span className={styles['page-three-adv-content-item-point']}></span>
                        <span className={styles['page-four-bottom-content-item-text']}>
                          {
                            resultDetail?.htmlDescList[index].decision
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles['page-four-bottom-item']}>
                    <div className={styles['page-four-bottom-title']}>人事决策参考</div>
                    <div className={styles['page-four-bottom-content']}>
                      <div className={styles['page-four-bottom-content-item']}>
                        <span className={styles['page-three-adv-content-item-point']}></span>
                        <span className={styles['page-four-bottom-content-item-text']}>
                          {
                            resultDetail?.htmlDescList[index].features
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <div className={styles.page}>
        <div className={cs(styles.sub_title, styles.m_b_43)}>
          三、你的其他职业锚得分及描述
        </div>
        <div className={cs(styles['page-content'], styles['page-five'])}>
          {
            otherResult.map((v: any) => (
              <div key={v.resultType} className={styles['page-five-score']}>
                <p className={styles['page-five-score-title']}>
                  {v.resultTitle?.split('：')[1]}：你的得分（{v.score}）
                </p>
                <p className={styles['page-five-score-detail']}>
                  {
                    v.introduction ? v.introduction : '-'
                  }
                </p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default CA