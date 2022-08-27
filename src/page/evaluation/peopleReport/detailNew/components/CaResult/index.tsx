import React, { useEffect, useRef } from 'react';
import styles from './index.module.less';
import { Pie } from '@antv/g2plot';
import { Button } from 'antd';

function CaResult() {
  const pieRef: any = useRef();

  useEffect(() => {
    radarMap();
  }, []);
  const radarMap = () => {
    console.log(pieRef.current);
    pieRef.current.innerHTML = ''
    const radarPlot = new Pie(pieRef.current, {
        data: [
          { type: '分类一', value: 27 },
          { type: '分类二', value: 25 },
          { type: '分类三', value: 18 },
          { type: '分类四', value: 15 },
          { type: '分类五', value: 10 },
          { type: '其他', value: 5 },
        ],
        appendPadding: 10,
        height: 200,
        angleField: 'value',
        colorField: 'type',
        radius: 0.65,
        legend: false,
        color: (data) => {
          console.log(data, 'color');
          if (data.type === '分类一') {
            return '#5EA3FF'
          }
          return '#B1D2FF'
        },
        label: {
          type: 'spider',
          labelHeight: 28,
          content: '{name}',
          style: {
            fill: '#9EA7B4'
          }
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    })
    radarPlot.render();
  }
  return (
    <div className={styles.ca_result}>
      <div className={styles.ca_result_header}>
        <div className={styles.ca_result_header_title}>管理型</div>
        <div className={styles.ca_result_header_tips}>适合掌控整个居民</div>
        <Button className={styles.ca_result_header_action} type='primary'>通知测评</Button>
      </div>
      <div className={styles.ca_result_content}>
        <div ref={pieRef}></div>
      </div>
    </div>
  );
}

export default CaResult;