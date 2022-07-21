import React from 'react';
import styles from './index.module.less';

interface IReportHeaderpProps {
  name: string;
  src?: string;
  isShowText?: boolean;
  width?: number;
  height?: number;
  color?: string;
}
const ReportHeader = (props: IReportHeaderpProps) => {
  const avatarStyle = {
    width: props.width || 48,
    height: props.height || 48,
  };
  return (
    <div className={styles.reportHeader_wrapper}>
      {props.src ? (
        <img src={props.src} style={avatarStyle} alt="" />
      ) : (
        <div style={avatarStyle} className={styles.reportHeader_avatar}>
          {props.name?.slice(0, 1)}
        </div>
      )}
      <div className={styles.header_info}>
        <h2 style={{ color: props.color || '#fff' }}>{props.name}</h2>
        {!props.isShowText && <small>你的测评结果是</small>}
      </div>
    </div>
  );
};

export default ReportHeader;
