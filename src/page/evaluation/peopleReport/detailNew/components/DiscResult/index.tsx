import React from 'react';
import styles from './index.module.less';
import { Button } from 'antd';
import cs from 'classnames';

function DiscResult(props: any) {
  const isHaveData = true;
  return (
    <div className={styles.disc_result}>
      <div className={styles.disc_result_header}>
        <div className={styles.disc_result_header_title}>D-支配掌控型</div>
        <div className={styles.disc_result_header_tips}>一句话总结语，需产品协助</div>
        <Button className={styles.disc_result_header_action} type='primary'>通知测评</Button>
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
        <div className={styles.disc_result_content_title_top}>外倾</div>
        <div className={styles.disc_result_content_area}>
          <div className={styles.disc_result_content_title_right}>任务导向</div>
          <div className={styles.disc_result_content_type}>
            <div className={styles.disc_result_content_type_line}></div>
            <div className={styles.disc_result_content_type_line_y}></div>
            <div className={cs(styles.disc_result_content_type_item)}>
              <p>D-支配型</p>
              <p>40%</p>
            </div>
            <div className={cs(styles.disc_result_content_type_item)}>
              <p>I-支配型</p>
              <p>40%</p>
            </div>
            <div className={cs(styles.disc_result_content_type_item)}>
              <p>S-支配型</p>
              <p>40%</p>
            </div>
            <div className={cs(styles.disc_result_content_type_item)}>
              <p>C-支配型</p>
              <p>40%</p>
            </div>
          </div>
          <div className={styles.disc_result_content_title_left}>人际导向</div>
        </div>
        <div className={styles.disc_result_content_title_bottom}>内倾</div>
      </div>
    </div>
  );
}

export default DiscResult;