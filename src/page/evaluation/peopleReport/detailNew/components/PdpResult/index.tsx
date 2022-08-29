import React, { useEffect, useRef } from 'react';
import styles from './index.module.less';
import { Radar } from '@antv/g2plot';
import { Button } from 'antd';

function PdpResult({ chartsData = {}, sendNotice }: any) {
  const containerRef: any = useRef();

  useEffect(() => {
    radarMap(chartsData);
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
    console.log(data, 'data111')
    const radarPlot = new Radar(containerRef.current, {
        data,
        width: 250,
        height: 180,
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
  return (
    <div className={styles.pdp_result}>
      <div className={styles.pdp_result_header}>
        <div className={styles.pdp_result_header_title}>{chartsData?.resultType ? chartsData?.resultType : '-型'}</div>
        <div className={styles.pdp_result_header_tips}>{chartsData?.introduction ? chartsData?.introduction : '待测试'}</div>
        {
          (!chartsData?.chartData && chartsData?.examPaperId) && <Button className={styles.pdp_result_header_action} type='primary' onClick={sendInfo}>通知测评</Button>
        }
      </div>
      <div ref={containerRef}></div>
    </div>
  );
}

export default PdpResult;
