import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { Pie } from '@antv/g2plot';
import { Button, Tooltip } from 'antd';
import cs from 'classnames';
import MarkResult from '../MarkResult';

function CaResult({ chartsData = {}, sendNotice, openEvaluation }: any) {
  const pieRef: any = useRef();
  const [isBlur, setIsBlur] = useState<boolean>(false);
  const [isHaveInvite, setIsHaveInvite] = useState<boolean>(false);

  useEffect(() => {
    radarMap(chartsData);
    if (((!chartsData?.chartData && chartsData?.examPaperId) || !chartsData?.examPaperId)) {
      setIsBlur(true);
    } else {
      setIsBlur(false);
    }
    if (!chartsData?.examPaperId) {
      setIsHaveInvite(false)
    } else {
      setIsHaveInvite(true)
    }
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
  // 发起测评
  const launchEvaluation = () => {
    openEvaluation && openEvaluation('CA')
  }
  return (
    <div className={isHaveInvite ? styles.ca_result : cs(styles.ca_result, styles.invite)}>
      <div className={styles.ca_result_header}>
        <div className={styles.ca_result_header_title}>{chartsData?.resultType ? chartsData?.resultType : '-型'}</div>
        <Tooltip title={chartsData?.introduction ? chartsData?.introduction : ''}>
          <div className={styles.ca_result_header_tips}>{chartsData?.introduction ? chartsData?.introduction : '职业锚(待测试)'}</div>
        </Tooltip>
        {/* {
          (!chartsData?.chartData && chartsData?.examPaperId) && <Button className={styles.ca_result_header_action} type='primary' onClick={sendInfo}>通知测评</Button>
        }
        {
          !chartsData?.examPaperId && <Button className={styles.ca_result_header_action} type='primary' onClick={sendInfo}>邀约</Button>
        } */}
      </div>
      <div className={styles.ca_result_content}>
        {
          isBlur && <MarkResult isBlur={isBlur} isHaveInvite={isHaveInvite} sendInfo={sendInfo} launchEvaluation={launchEvaluation} />
          // <div className={styles.ca_result_content_mark}>
          //   {
          //     isHaveInvite ? <>
          //       <span className={styles.ca_result_content_mark_text}>待员工提交测评后解锁查看</span>
          //       <Button className={styles.ca_result_header_action} type='primary' onClick={sendInfo}>催办</Button>
          //     </> : <>
          //       <span className={styles.ca_result_content_mark_text}>员工暂未开放该量表权限</span>
          //       <span className={styles.ca_result_content_mark_btn_text}>发起测评&gt;</span>
          //     </>
          //   }
          // </div>
        }
        <div className={isBlur ? styles.ca_result_content_chart_blur : styles.ca_result_content_chart}>
          <div ref={pieRef}></div>
        </div>
      </div>
    </div>
  );
}

export default CaResult;