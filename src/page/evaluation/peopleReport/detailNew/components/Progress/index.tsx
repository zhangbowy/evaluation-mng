import React, { useMemo } from 'react';
import { propsType } from './type';
import styles from './index.module.less';

const Progress = (props: propsType) => {
  const {
    width,
    height,
    score,
    totalScore,
    color = '#2B85FF',
    bgColor = '#E3E8EE',
    borderRadius = 3,
    fontSize = 12,
    left = 4
  } = props;
  const percent = useMemo(() => {
    return (Number((score / totalScore).toFixed(2)) * 100)
  }, [score, totalScore]);
  return (
    <div className={styles['progress-wrap']}>
      <div
        className={styles['progress-out']}
        style={{ width: `${width}px`, height: `${height}px`, borderRadius: `${borderRadius}px`, backgroundColor: bgColor }}
      >
        <div
          className={styles['progress-inner']}
          style={{ width: `${percent}%`,  height: `${height}px`, backgroundColor: color, borderRadius: `${borderRadius}px` }}
        />
      </div>
      <span
        style={{ fontSize: `${fontSize}px`, marginLeft: `${left}px` }}
        className={styles['progress-percent']}
      >
        {percent}%
      </span>
    </div>
  );
}

export default Progress;
