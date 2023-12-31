import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import { Button, Tooltip } from 'antd';
import cs from 'classnames';
import MarkResult from '../MarkResult';

const MbtiResult = ({ chartsData, sendNotice, openEvaluation }: any) => {
  const [isBlur, setIsBlur] = useState<boolean>(false);
  const [isHaveInvite, setIsHaveInvite] = useState<boolean>(false);
  const sendInfo = () => {
    sendNotice && sendNotice(chartsData?.examPaperId);
  };
  useEffect(() => {
    if (((!chartsData?.chartData && chartsData?.examPaperId) || !chartsData?.examPaperId)) {
      setIsBlur(true)
    } else {
      setIsBlur(false)
    }
    if (!chartsData?.examPaperId) {
      setIsHaveInvite(false)
    } else {
      setIsHaveInvite(true)
    }
  }, [chartsData])
  // 发起测评
  const launchEvaluation = () => {
    openEvaluation && openEvaluation('MBTI')
  }
  return (
    <div className={isHaveInvite ? cs(styles.mbti_result) : cs(styles.mbti_result, styles.invite)}>
      <div className={styles.mbti_result_header}>
        <div className={styles.mbti_result_header_title}>{chartsData?.resultType ? chartsData?.resultType : '-型'}</div>
        <Tooltip title={chartsData?.introduction ? chartsData?.introduction : ''}>
          <div className={styles.mbti_result_header_tips}>{chartsData?.introduction ? chartsData?.introduction : 'MBTI(待测试)'}</div>
        </Tooltip>
        {/* {
          (!chartsData?.chartData && chartsData?.examPaperId) && <Button className={styles.mbti_result_header_action} type='primary' onClick={sendInfo}>通知测评</Button>
        }
        {
          !chartsData?.examPaperId && <Button className={styles.mbti_result_header_action} type='primary' onClick={sendInfo}>邀约</Button>
        } */}
      </div>
      <div className={styles.mbti_result_content}>
        {
          isBlur && <MarkResult isBlur={isBlur} isHaveInvite={isHaveInvite} sendInfo={sendInfo} launchEvaluation={launchEvaluation} />
          // <div className={styles.mbti_result_content_mark}>
          //   {
          //     isHaveInvite ? <>
          //       <span className={styles.mbti_result_content_mark_text}>待员工提交测评后解锁查看</span>
          //       <Button className={styles.mbti_result_header_action} type='primary' onClick={sendInfo}>催办</Button>
          //     </> : <>
          //       <span className={styles.mbti_result_content_mark_text}>员工暂未开放该量表权限</span>
          //       <span className={styles.mbti_result_content_mark_btn_text}>发起测评&gt;</span>
          //     </>
          //   }
          // </div>
        }
        <div className={isBlur ? cs(styles['result-list'], styles['blur']) : styles['result-list']}>
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
