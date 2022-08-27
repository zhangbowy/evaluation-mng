import React from 'react';
import styles from './index.module.less';
import { Button } from 'antd';

const MbtiResult = () => {
  return (
    <div className={styles.mbti_result}>
      <div className={styles.mbti_result_header}>
        <div className={styles.mbti_result_header_title}>INSP（哲学家型）</div>
        <div className={styles.mbti_result_header_tips}>适合的岗位有运营岗</div>
        <Button className={styles.mbti_result_header_action} type='primary'>通知测评</Button>
      </div>
      <div className={styles.mbti_result_content}>
        <div className={styles['result-list']}>
          <div className={styles['result-item']}>
            <div className={styles.in}>
              <div className={styles.label}>外向(E):10</div>
              <div className={styles['pillar-box']}>
                <div className={styles.percent_down}
                  style={{ width: `10%` }}
                ></div>
              </div>
            </div>
            <div className={styles.out}>
              <div className={styles.label}>内向(I):11</div>
              <div className={styles['pillar-box']}>
                <div className={styles.percent}
                  style={{ width: `11%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className={styles['result-item']}>
            <div className={styles.in}>
              <div className={styles.label}>感觉(S):9</div>
              <div className={styles['pillar-box']}>
                <div className={styles.percent_down}
                  style={{ width: `9%` }}
                ></div>
              </div>
            </div>
            <div className={styles.out}>
              <div className={styles.label}>直觉(N):17</div>
              <div className={styles['pillar-box']}>
                <div className={styles.percent}
                  style={{ width: `17%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className={styles['result-item']}>
            <div className={styles.in}>
              <div className={styles.label}>思考(T):10</div>
              <div className={styles['pillar-box']}>
                <div className={styles.percent_down}
                  style={{ width: `10%` }}
                ></div>
              </div>
            </div>
            <div className={styles.out}>
              <div className={styles.label}>情感(F):14</div>
              <div className={styles['pillar-box']}>
                <div className={styles.percent}
                  style={{ width: `14%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className={styles['result-item']}>
            <div className={styles.in}>
              <div className={styles.label}>判断(J):6</div>
              <div className={styles['pillar-box']}>
                <div className={styles.percent_down}
                  style={{ width: `6%` }}
                ></div>
              </div>
            </div>
            <div className={styles.out}>
              <div className={styles.label}>知觉(P):16</div>
              <div className={styles['pillar-box']}>
                <div className={styles.percent}
                  style={{ width: `16%` }}
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
