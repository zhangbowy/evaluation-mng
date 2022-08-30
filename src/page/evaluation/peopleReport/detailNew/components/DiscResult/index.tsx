import React, { useMemo } from 'react';
import styles from './index.module.less';
import { Button } from 'antd';
import cs from 'classnames';

function DiscResult({ chartsData, sendNotice }: any) {
  const isHaveData = useMemo(() => {
    return chartsData?.examPaperId && chartsData?.chartData
  }, [chartsData]);

  const typeStr = useMemo(() => {
    return chartsData?.resultType?.split('（')[0]
  }, [chartsData])

  const sendInfo = () => {
    sendNotice && sendNotice(chartsData?.examPaperId);
  };
  
  return (
    <div className={styles.disc_result}>
      <div className={styles.disc_result_header}>
        <div className={styles.disc_result_header_title}>{chartsData?.resultType ? chartsData?.resultType : '-型'}</div>
        <div className={styles.disc_result_header_tips}>{chartsData?.introduction ? chartsData?.introduction : '待测试'}</div>
        {
          (!chartsData?.chartData && chartsData?.examPaperId) && <Button className={styles.disc_result_header_action} type='primary' onClick={sendInfo}>通知测评</Button>
        }
      </div>
      <div className={styles.disc_result_content}>
        {/* {
          isHaveData ? <img src="https://qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_img1.png" alt="" />
            : <img src="https://qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_img2.png" alt="" />
        }
        <div className={styles.disc_result_content_D}>40%</div>
        <div className={styles.disc_result_content_I}>20%</div>
        <div className={styles.disc_result_content_S}>30%</div>
        <div className={styles.disc_result_content_C}>80%</div> */}
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
  );
}

export default DiscResult;