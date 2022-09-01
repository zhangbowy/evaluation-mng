import React, { useEffect, useRef } from 'react';
import styles from './index.module.less';
import { Pie } from '@antv/g2plot';
import { Button } from 'antd';

function CaResult({ chartsData = {}, sendNotice }: any) {
  const pieRef: any = useRef();

  useEffect(() => {
    radarMap(chartsData);
  }, [chartsData]);
  const radarMap = (chartsData: any) => {
    const { chartData, resultType } = chartsData || {};
    const dataColumn = chartData ? Object.keys(chartData).map((key) => ({
      type: chartData[key].resultType?.split('：')[1],
      value: chartData[key].score,
    })) : [
      { type: '自主/独立型', value: 0 },
      { type: '挑战型', value: 0 },
      { type: '创造/创业型', value: 0 },
      { type: '管理型', value: 0 },
      { type: '生活型', value: 0 },
      { type: '安全/稳定型', value: 0 },
      { type: '服务型', value: 0 },
      { type: '技术/职能型', value: 0 },
    ];
    pieRef.current.innerHTML = ''
    const radarPlot = new Pie(pieRef.current, {
        data: dataColumn,
        appendPadding: 10,
        height: 200,
        angleField: 'value',
        colorField: 'type',
        radius: 0.65,
        legend: false,
        color: (data) => {
          let value = 0;
          for(let i = 0; i < dataColumn.length; i++) {
            if (dataColumn[i].type?.indexOf(data.type) > -1) {
              value = dataColumn[i].value;
            }
          }
          if (resultType?.indexOf(data.type) > -1) {
            return '#5EA3FF'
          } else if (value === 0) {
            return '#E3EFFF'
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
  const sendInfo = () => {
    sendNotice && sendNotice(chartsData?.examPaperId);
  };
  return (
    <div className={styles.ca_result}>
      <div className={styles.ca_result_header}>
        <div className={styles.ca_result_header_title}>{chartsData?.resultType ? chartsData?.resultType : '-型'}</div>
        <div className={styles.ca_result_header_tips}>{chartsData?.introduction ? chartsData?.introduction : '待测试'}</div>
        {
          (!chartsData?.chartData && chartsData?.examPaperId) && <Button className={styles.ca_result_header_action} type='primary' onClick={sendInfo}>通知测评</Button>
        }
      </div>
      <div className={styles.ca_result_content}>
        <div ref={pieRef}></div>
      </div>
    </div>
  );
}

export default CaResult;