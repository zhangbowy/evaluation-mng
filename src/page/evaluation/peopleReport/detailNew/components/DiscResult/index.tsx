import React, { useMemo, useEffect, useState } from 'react';
import styles from './index.module.less';
import { Button } from 'antd';
import cs from 'classnames';
import { Tooltip } from 'antd';
import MarkResult from '../MarkResult';

function DiscResult({ chartsData, sendNotice, openEvaluation }: any) {
  const [isBlur, setIsBlur] = useState<boolean>(false);
  const [isHaveInvite, setIsHaveInvite] = useState<boolean>(false);
  const isHaveData = useMemo(() => {
    return chartsData?.examPaperId && chartsData?.chartData
  }, [chartsData]);

  const typeStr = useMemo(() => {
    return chartsData?.resultType?.split('（')[0]
  }, [chartsData])

  const sendInfo = () => {
    sendNotice && sendNotice(chartsData?.examPaperId);
  };
  // 发起测评
  const launchEvaluation = () => {
    openEvaluation && openEvaluation('DISC')
  }

  useEffect(() => {
    if (((!chartsData?.chartData && chartsData?.examPaperId) || !chartsData?.examPaperId)) {
      setIsBlur(true);
    } else {
      setIsBlur(false);
    }
    if (!chartsData?.examPaperId) {
      setIsHaveInvite(false);
    } else {
      setIsHaveInvite(true);
    }
  }, [chartsData])
  
  return (
    <div className={isHaveInvite ? styles.disc_result : cs(styles.disc_result, styles.invite)}>
      <div className={styles.disc_result_header}>
        <div className={styles.disc_result_header_title}>{chartsData?.resultType ? chartsData?.resultType : '-型'}</div>
        <Tooltip title={chartsData?.introduction ? chartsData?.introduction : ''}>
          <div className={styles.disc_result_header_tips}>{chartsData?.introduction ? chartsData?.introduction : '待测试'}</div>
        </Tooltip>
        {/* {
          (!chartsData?.chartData && chartsData?.examPaperId) && <Button className={styles.disc_result_header_action} type='primary' onClick={sendInfo}>通知测评</Button>
        }
        {
          !chartsData?.examPaperId && <Button className={styles.disc_result_header_action} type='primary' onClick={sendInfo}>邀约</Button>
        } */}
      </div>
      <div className={styles.disc_result_content}>
        {
          isBlur && <MarkResult isBlur={isBlur} isHaveInvite={isHaveInvite} sendInfo={sendInfo} launchEvaluation={launchEvaluation} />
          // <div className={styles.disc_result_content_mark}>
          //   {
          //     isHaveInvite ? <>
          //       <span className={styles.disc_result_content_mark_text}>待员工提交测评后解锁查看</span>
          //       <Button className={styles.disc_result_header_action} type='primary' onClick={sendInfo}>催办</Button>
          //     </> : <>
          //       <span className={styles.disc_result_content_mark_text}>员工暂未开放该量表权限</span>
          //       <span className={styles.disc_result_content_mark_btn_text}>发起测评&gt;</span>
          //     </>
          //   }
          // </div>
        }
        <div className={isBlur ? styles.disc_result_content_blur : styles.disc_result_content_no_blur}>
          {
            isHaveData ? <>
              <div className={styles.disc_result_content_title_top}>外倾</div>
              <div className={styles.disc_result_content_area}>
                <div className={styles.disc_result_content_title_right}>任务导向</div>
                <div className={styles.disc_result_content_type}>
                  <div className={styles.disc_result_content_type_line}></div>
                  <div className={styles.disc_result_content_type_line_y}></div>
                  <div className={typeStr.indexOf('D') > -1 ? cs(styles.disc_result_content_type_item, styles.select) : cs(styles.disc_result_content_type_item)}>
                    <p>D-支配掌控型</p>
                    <p>{chartsData?.chartData?.D.fullScore}%</p>
                  </div>
                  <div className={typeStr.indexOf('I') > -1 ? cs(styles.disc_result_content_type_item, styles.select) : cs(styles.disc_result_content_type_item)}>
                    <p>I-社交影响型</p>
                    <p>{chartsData?.chartData?.I.fullScore}%</p>
                  </div>
                  <div className={typeStr.indexOf('C') > -1 ? cs(styles.disc_result_content_type_item, styles.select) : cs(styles.disc_result_content_type_item)}>
                    <p>C-谨慎分析型</p>
                    <p>{chartsData?.chartData?.C.fullScore}%</p>
                  </div>
                  <div className={typeStr.indexOf('S') > -1 ? cs(styles.disc_result_content_type_item, styles.select) : cs(styles.disc_result_content_type_item)}>
                    <p>S-稳健支持型</p>
                    <p>{chartsData?.chartData?.S.fullScore}%</p>
                  </div>
                </div>
                <div className={styles.disc_result_content_title_left}>人际导向</div>
              </div>
              <div className={styles.disc_result_content_title_bottom}>内倾</div>
            </> : <img src="https://qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_img2.png" alt="" />
          }
        </div>
      </div>
    </div>
  );
}

export default DiscResult;