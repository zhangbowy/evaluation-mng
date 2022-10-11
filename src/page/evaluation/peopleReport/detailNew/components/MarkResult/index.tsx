import React from 'react';
import styles from './index.module.less';
import { propsType } from './type';
import { Button } from 'antd';

const MarkResult = ({ isHaveInvite, sendInfo, launchEvaluation }: propsType) => {
  return (
    <div className={styles.result_content_mark}>
      {
        isHaveInvite ? <>
          <span className={styles.result_content_mark_text}>待员工提交测评后解锁查看</span>
          <Button className={styles.result_header_action} type='primary' onClick={sendInfo}>催办</Button>
        </> : <>
          <span className={styles.result_content_mark_text}>员工暂未开放该量表权限</span>
          <span
            className={styles.result_content_mark_btn_text}
            onClick={launchEvaluation}
          >
            发起测评&gt;
          </span>
        </>
      }
    </div>
  );
}

export default MarkResult;
