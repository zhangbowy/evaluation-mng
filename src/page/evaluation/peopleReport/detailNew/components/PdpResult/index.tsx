import React, { useEffect, useRef } from 'react';
import styles from './index.module.less';
import { Radar } from '@antv/g2plot';
import { Button } from 'antd';

function PdpResult() {
  const containerRef: any = useRef();

  useEffect(() => {
    radarMap();
  }, []);
  const radarMap = () => {
    containerRef.current.innerHTML = ''
    // const json = JSON.parse(resultList?.polygon);
    // const data = Object.keys(json).map((key) => ({
    //     item: key,
    //     a: json[key],
    //     value: json[key],
    // }));
    const radarPlot = new Radar(containerRef.current, {
        data: [
          { name: '应变能力', star: 1 },
          { name: '决策能力', star: 2 },
          { name: '协作能力', star: 3 },
          { name: '创新能力', star: 4 },
          { name: '分析能力', star: 5 },
          { name: '沟通能力', star: 3 },
        ],
        width: 250,
        height: 180,
        xField: 'name',
        yField: 'star',
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
                return `${text}`;
                // (${data[index].value})
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
  return (
    <div className={styles.pdp_result}>
      <div className={styles.pdp_result_header}>
        <div className={styles.pdp_result_header_title}>老虎型</div>
        <div className={styles.pdp_result_header_tips}>适合掌握整个局面</div>
        <Button className={styles.pdp_result_header_action} type='primary'>通知测评</Button>
      </div>
      <div ref={containerRef}></div>
    </div>
  );
}

export default PdpResult;
