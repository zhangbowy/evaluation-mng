import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { Radar } from '@antv/g2plot';
import { Button, Tooltip } from 'antd';
import cs from 'classnames';
import MarkResult from '../MarkResult';

function PdpResult({ chartsData = {}, sendNotice, openEvaluation }: any) {
  const containerRef: any = useRef();
  const [isBlur, setIsBlur] = useState<boolean>(false);
  const [isHaveInvite, setIsHaveInvite] = useState<boolean>(false);

  useEffect(() => {
    radarMap(chartsData);
    if (((!chartsData?.chartData && chartsData?.examPaperId) || !chartsData?.examPaperId)) {
      setIsBlur(true)
    } else {
      setIsBlur(false)
    }
    if (!chartsData?.examPaperId) {
      setIsHaveInvite(false);
    } else {
      setIsHaveInvite(true);
    }
  }, [chartsData]);
  const radarMap = (chartsData: any) => {
    containerRef.current.innerHTML = ''
    let data: any = [];
    if (chartsData?.chartData) {
      const json = chartsData?.chartData ? chartsData?.chartData : {};
      data = Object.keys(json).map((key) => ({
          item: key,
          a: json[key],
          value: json[key],
      }));
    } else {
      data = [
        { item: '应变能力', a: 0 },
        { item: '决策能力', a: 0 },
        { item: '协作能力', a: 0 },
        { item: '创新能力', a: 0 },
        { item: '分析能力', a: 0 },
        { item: '沟通能力', a: 0 },
      ]
    }
    const radarPlot = new Radar(containerRef.current, {
        data,
        // width: 250,
        height: 170,
        xField: 'item',
        yField: 'a',
        tooltip: false,
        lineStyle: {
            fill: 'rgba(43,133,255,0.5)', //区域填充颜色
            fillOpacity: 0.5, //区域填充颜色透明度
            stroke: 'rgba(43,133,255,0.2)',
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
                if (data[index].value > 0) {
                  return `${text}(${data[index].value})`;
                }
                return `${text}`;
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
        point: {
          size: 2,
          style: {
            fill: '#2B85FF'
          }
        }
    })
    radarPlot.render();
  }
  const sendInfo = () => {
    sendNotice && sendNotice(chartsData?.examPaperId);
  };
  // 发起测评
  const launchEvaluation = () => {
    openEvaluation && openEvaluation('PDP')
  }
  return (
    <div className={isHaveInvite ? cs(styles.pdp_result) : cs(styles.pdp_result, styles.invite)}>
      <div className={styles.pdp_result_header}>
        <div className={styles.pdp_result_header_title}>{chartsData?.resultType ? chartsData?.resultType : '-型'}</div>
        <Tooltip title={chartsData?.introduction ? chartsData?.introduction : ''}>
          <div className={styles.pdp_result_header_tips}>{chartsData?.introduction ? chartsData?.introduction : '待测试'}</div>
        </Tooltip>
        {/* {
          (!chartsData?.chartData && chartsData?.examPaperId) && <Button className={styles.pdp_result_header_action} type='primary' onClick={sendInfo}>通知测评</Button>
        }
        {
          !chartsData?.examPaperId && <Button className={styles.pdp_result_header_action} type='primary' onClick={sendInfo}>邀约</Button>
        } */}
      </div>
      <div className={styles.pdp_result_content}>
        {
          isBlur && <MarkResult isBlur={isBlur} isHaveInvite={isHaveInvite} sendInfo={sendInfo} launchEvaluation={launchEvaluation} />
          // <div className={styles.pdp_result_content_mark}>
          //   {
          //     isHaveInvite ? <>
          //       <span className={styles.pdp_result_content_mark_text}>待员工提交测评后解锁查看</span>
          //       <Button className={styles.pdp_result_header_action} type='primary' onClick={sendInfo}>催办</Button>
          //     </> : <>
          //       <span className={styles.pdp_result_content_mark_text}>员工暂未开放该量表权限</span>
          //       <span className={styles.pdp_result_content_mark_btn_text}>发起测评&gt;</span>
          //     </>
          //   }
          // </div>
        }
        <div className={isBlur ? styles.pdp_result_content_chart_blur : styles.pdp_result_content_chart}>
          <div ref={containerRef}></div>
        </div>
      </div>
    </div>
  );
}

export default PdpResult;
