import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.less';
import { Radar } from '@antv/g2plot';
import cs from 'classnames';
// import { ReportStore } from '@/store'
// import { toJS } from "mobx"
import * as dayjs from 'dayjs'

// const resultList: any = {
//   polygon: {
//     '决策能力': 2,
//     '分析能力': 3,
//     '创新能力': 4,
//     '协作能力': 5,
//     '应变能力': 5,
//     '沟通能力': 5,
//   }
// }
const CA = ({ resultDetail = {} }: any) => {
  const containerRef: any = useRef();
  const [resultList, setResultList] = useState<any>();
  const [resultType, setResultType] = useState<string>('');
  const [tags, setTags] = useState<any>([]);
  const [descList, setDescList] = useState<any>([]);

  useEffect(() => {
    const result: any = resultDetail;
    console.log(result, 'result');
    setResultList(result);
    const { tags = [], results = [], htmlDescList = [] } = result;
    let str = '';
    results?.map((v: any) => {
      str += `${v.type},`;
    })
    str = str.substring(0, str.length - 1);
    setResultType(str);
    setTags(tags);
    const htmlDescListData: any = htmlDescList?.map((v: any) => ({
      ...v,
      styleList: v.style
    }))
    setDescList(htmlDescListData);
  }, [resultDetail]);
  useEffect(() => {
    if (containerRef.current && resultList?.status) {
        radarMap(resultList)
    }
  }, [containerRef.current, resultList])
  const radarMap = (dataRadar: any) => {
    containerRef.current.innerHTML = ''
    const json = JSON.parse(dataRadar?.polygon);
    const data = Object.keys(json).map((key) => ({
        item: key,
        a: json[key],
        value: json[key],
    }));
    const radarPlot = new Radar(containerRef.current, {
        data,
        // width: 250,
        // height: 200,
        xField: 'item',
        yField: 'a',
        tooltip: false,
        lineStyle: {
            fill: '#5691B1', //区域填充颜色
            fillOpacity: 0.8, //区域填充颜色透明度
            stroke: '#DFDFDF',
            lineOpacity: 0.8,
        },
        xAxis: {
            tickLine: null,
            line: null,
            radar: {
              splitLine: {
                lineStyle: {
                  color: 'red'
                }
              }
            },
            label: {
              formatter: (text: string, item: any, index: number) => {
                return `${text}(${data[index].value})`;
              },
            },
            grid: {
              line: {
                type: 'line',
                style: {
                  lineDash: null,
                  stroke: "#f2f7fa",
                },
              },
              // alternateColor: 'rgba(86, 145, 177, 0.2)',
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
            grid: {
              line: {
                type: 'line',
                style: {
                  lineDash: null,
                  stroke: "#f2f7fa",
                  fill: 'rgba(43, 133, 255, 0.1000)'
                },
              },
            },
        },
    })
    radarPlot.render();
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
                  <img src="https://qzz-static.forwe.store/evaluation-mng/imgs/qcp_disc_bg1.png" />
              </div>
              <div className={styles.header}>
                  <p>PDP</p>
                  <p className={styles.fw_600}>职业性格测试</p>
                  <p className={styles.title}>测评报告</p>
                  <p className={styles.pro}>Professional personality assessment</p>
              </div>
        </div>
        <div className={styles['user-info']}>
            <p className={styles.title}>{resultList?.user?.name}</p>
            <p className={styles['sub-title']}>{resultList?.user?.gender === 1 ? '男' : '女'}</p>
            <p className={styles['sub-title']}>{dayjs(resultList?.created).format('YYYY-MM-DD')}</p>
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
        <div className={styles['page-wrap']}>
          <div className={styles['page-first-title']}>
            <p className={styles['page-first-title-text']}>测评背景简介</p>
            <p className={styles['page-first-title-content']}>【导语】PDP是行为风格测试的一项工具，英文简称Professional Dynamitic Program。行为风格是指一个人天赋中最擅长的做事风格，并且区分了天生本我、工作中的我及他人眼中的我。</p>
            <p className={styles['page-first-title-content-two']}>PDP由美国南加州大学统计科学研究所、英国PDP-II行为科学研究所共同发明：它可以测量出个人的「基本行为」、「对环境的反应」、和「可预测的行为模式」。</p>
            <p className={styles['page-first-title-content-three']}>25年来全球已累积有1,600万人次有效计算机案例，5,000余家企业、研究机构与政府组织持续追踪其有效性。其有效性已经透过4种研究方法被证实：结构、促成因素、预测能力及内容有效性，所有形容词的分辨可靠性超过86%。</p>
          </div>
          <div className={styles['page-first-type']}>
            <div className={styles['page-first-type-left']}>
              <div className={styles['page-first-type-left-text']}>
                <span>PDP简易版则通过较直观的形式把人的性格大致分成了5种。</span>
              </div>
              <div>
                <img src="https://qzz-static.forwe.store/evaluation-web/imgs/xdjy/xdjy_pdp_type.png" alt="" />
              </div>
            </div>
            <div className={styles['page-first-type-right']}>
              <div className={styles['page-first-type-right-item']}>老虎型</div>
              <div className={styles['page-first-type-right-item']}>孔雀型</div>
              <div className={styles['page-first-type-right-item']}>熊猫型</div>
              <div className={styles['page-first-type-right-item']}>猫头鹰型</div>
              <div className={styles['page-first-type-right-item']}>变色龙型</div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className={styles.page}>
        <div className={cs(styles.sub_title, styles.m_b_43)}>
          二、测评结果分析
        </div>
        <div className={styles['page-two-top']}>
          <div className={styles['page-two-top-type']}>
            <div className={styles['page-two-top-type-title']}>
              <span>你的类型是:</span>
            </div>
            <div className={styles['page-two-top-type-content']}>
              <span className={styles['page-two-top-type-content-title']}>
                {resultType}
              </span>
            </div>
            <div className={styles['page-two-top-type-title']}>
              <span>你的标签是:</span>
            </div>
            <div className={styles['page-two-top-type-tag']}>
              {
                tags?.map((v: any) => (
                  <div key={v.id} className={styles['page-two-top-type-tag-item']}>{v.name}</div>
                ))
              }
            </div>
          </div>
          <div className={styles['page-two-top-type-charts']}>
            <div className={styles['page-two-top-type-charts-title']}>
              <p className={styles['page-two-top-type-charts-title-line']}></p>
              <p className={styles['page-two-top-type-charts-title-text']}>
                能力六芒星
              </p>
              <p className={styles['page-two-top-type-charts-title-line']}></p>
            </div>
            <div ref={containerRef} />
          </div>
        </div>
      </div>
      {
        descList?.map((v: any) => (
          <div key={v.type} className={styles.page}>
            <div className={cs(styles.sub_title, styles.m_b_43)}>
              {
                descList.length > 1 ? `三、能力分析解读(${v.type})` : '三、能力分析解读'
              }
            </div>
            <div className={styles['page-three']}>
              <div className={styles['page-three-trait']}>
                <div className={styles['page-three-trait-title']}>个性特点</div>
                <div className={styles['page-three-trait-content']}>
                  {
                    v.personality.map((item: any) => (
                      <div key={item} className={styles['page-three-trait-content-item']}>{item}</div>
                    ))
                  }
                </div>
              </div>
              <div className={styles['page-three-adv']}>
                <div className={styles['page-three-adv-title']}>
                  <img src="https://qzz-static.forwe.store/evaluation-web/imgs/xdjy/xdjy_pdp_up.png" alt="" />
                  <span>优点</span>
                </div>
                <div className={styles['page-three-adv-content']}>
                  {
                    v.advantage.map((adv: any) => (
                      <div key={adv} className={styles['page-three-adv-content-item']}>
                        <span className={styles['page-three-adv-content-item-point']}></span>
                        <span className={styles['page-three-adv-content-item-text']}>{adv}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className={styles['page-three-adv']}>
                <div className={styles['page-three-adv-title']}>
                  <img src="https://qzz-static.forwe.store/evaluation-web/imgs/xdjy/xdjy_pdp_down.png" alt="" />
                  <span>缺点</span>
                </div>
                <div className={styles['page-three-adv-content']}>
                  {
                    v.shortcoming.map((s: any) => (
                      <div key={s} className={styles['page-three-adv-content-item']}>
                        <span className={styles['page-three-adv-content-item-point']}></span>
                        <span className={styles['page-three-adv-content-item-text']}>{s}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className={cs(styles['page-three-adv'], styles['page-three-adv-title-split'])}>
                <div className={cs(styles['page-three-adv-title'])}>工作风格</div>
                <div className={styles['page-three-adv-content']}>
                  {
                    v.styleList.map((item: any) => (
                      <div key={item} className={styles['page-three-adv-content-item']}>
                        <span className={styles['page-three-adv-content-item-point']}></span>
                        <span className={styles['page-three-adv-content-item-text']}>{item}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className={styles['page-three-adv']}>
                <div className={styles['page-three-adv-title']}>关键特质</div>
                <div className={styles['page-three-adv-content']}>
                  {
                    v.keyFeatures.map((item: string) => (
                      <div key={item} className={styles['page-three-adv-content-item']}>
                        <span className={styles['page-three-adv-content-item-point']}></span>
                        <span className={styles['page-three-adv-content-item-text']}>{item}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className={styles['page-three-adv']}>
                <div className={styles['page-three-adv-title']}>作为领导</div>
                <div className={styles['page-three-adv-content']}>
                  {
                    v.leader.map((item: string) => (
                      <div key={item} className={styles['page-three-adv-content-item']}>
                        <span className={styles['page-three-adv-content-item-point']}></span>
                        <span className={styles['page-three-adv-content-item-text']}>{item}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className={styles['page-three-adv']}>
                <div className={styles['page-three-adv-title']}>适合工作</div>
                <div className={styles['page-three-adv-content']}>
                  {
                    v.work.map((item: string) => (
                      <div key={item} className={styles['page-three-adv-content-item']}>
                        <span className={styles['page-three-adv-content-item-point']}></span>
                        <span className={styles['page-three-adv-content-item-text']}>{item}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        ))
      } */}
      <div className={styles['end-wrap']}>
        <div className={styles['end-line']}></div>
        <div className={styles['end-text']}>END</div>
        <div className={styles['end-line']}></div>
      </div>
    </div>
  )
}

export default CA