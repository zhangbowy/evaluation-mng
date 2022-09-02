import React from 'react';
import styles from './index.module.less';
import { Button, Tooltip } from 'antd';

const MbtiResult = ({ chartsData, sendNotice }: any) => {
  const sendInfo = () => {
    sendNotice && sendNotice(chartsData?.examPaperId);
  };
  return (
    <div className={styles.mbti_result}>
      <div className={styles.mbti_result_header}>
        <div className={styles.mbti_result_header_title}>{chartsData?.resultType ? chartsData?.resultType : '-型'}</div>
        <Tooltip title={chartsData?.introduction ? chartsData?.introduction : ''}>
          <div className={styles.mbti_result_header_tips}>{chartsData?.introduction ? chartsData?.introduction : '待测试'}</div>
        </Tooltip>
        {
          (!chartsData?.chartData && chartsData?.examPaperId) && <Button className={styles.mbti_result_header_action} type='primary' onClick={sendInfo}>通知测评</Button>
        }
      </div>
      <div className={styles.mbti_result_content}>
        <div className={styles['result-list']}>
          <div className={styles['result-item']}>
            <div className={styles.in}>
              <div className={styles.label}>外向(E):{chartsData?.chartData?.E?.score || '-'}</div>
              <div className={styles['pillar-box']}>
                <div className={chartsData?.resultType?.indexOf('E') > -1 ? styles.percent : styles.percent_down}
                  style={{ width: `${chartsData?.chartData?.E?.fullScore ? chartsData?.chartData?.E?.fullScore : 0}%` }}
                ></div>
              </div>
            </div>
            <div className={styles.out}>
              <div className={styles.label}>内向(I):{chartsData?.chartData?.I?.score || '-'}</div>
              <div className={styles['pillar-box']}>
                <div className={chartsData?.resultType?.indexOf('I') > -1 ? styles.percent : styles.percent_down}
                  style={{ width: `${chartsData?.chartData?.I?.fullScore ? chartsData?.chartData?.I?.fullScore : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className={styles['result-item']}>
            <div className={styles.in}>
              <div className={styles.label}>感觉(S):{chartsData?.chartData?.S?.score || '-'}</div>
              <div className={styles['pillar-box']}>
                <div className={chartsData?.resultType?.indexOf('S') > -1 ? styles.percent : styles.percent_down}
                  style={{ width: `${chartsData?.chartData?.S?.fullScore ? chartsData?.chartData?.S?.fullScore : 0}%` }}
                ></div>
              </div>
            </div>
            <div className={styles.out}>
              <div className={styles.label}>直觉(N):{chartsData?.chartData?.N?.score || '-'}</div>
              <div className={styles['pillar-box']}>
                <div className={chartsData?.resultType?.indexOf('N') > -1 ? styles.percent : styles.percent_down}
                  style={{ width: `${chartsData?.chartData?.N?.fullScore ? chartsData?.chartData?.N?.fullScore : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className={styles['result-item']}>
            <div className={styles.in}>
              <div className={styles.label}>思考(T):{chartsData?.chartData?.T?.score || '-'}</div>
              <div className={styles['pillar-box']}>
                <div className={chartsData?.resultType?.indexOf('T') > -1 ? styles.percent : styles.percent_down}
                  style={{ width: `${chartsData?.chartData?.T?.fullScore ? chartsData?.chartData?.T?.fullScore : 0}%` }}
                ></div>
              </div>
            </div>
            <div className={styles.out}>
              <div className={styles.label}>情感(F):{chartsData?.chartData?.F?.score || '-'}</div>
              <div className={styles['pillar-box']}>
                <div className={chartsData?.resultType?.indexOf('F') > -1 ? styles.percent : styles.percent_down}
                  style={{ width: `${chartsData?.chartData?.F?.fullScore ? chartsData?.chartData?.F?.fullScore : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className={styles['result-item']}>
            <div className={styles.in}>
              <div className={styles.label}>判断(J):{chartsData?.chartData?.J?.score || '-'}</div>
              <div className={styles['pillar-box']}>
                <div className={chartsData?.resultType?.indexOf('J') > -1 ? styles.percent : styles.percent_down}
                  style={{ width: `${chartsData?.chartData?.J?.fullScore ? chartsData?.chartData?.J?.fullScore : 0}%` }}
                ></div>
              </div>
            </div>
            <div className={styles.out}>
              <div className={styles.label}>知觉(P):{chartsData?.chartData?.P?.score || '-'}</div>
              <div className={styles['pillar-box']}>
                <div className={chartsData?.resultType?.indexOf('P') > -1 ? styles.percent : styles.percent_down}
                  style={{ width: `${chartsData?.chartData?.P?.fullScore ? chartsData?.chartData?.P?.fullScore : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MbtiResult;
