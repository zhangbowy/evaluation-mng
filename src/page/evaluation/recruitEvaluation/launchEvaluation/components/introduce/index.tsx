import React from 'react';
import { Drawer } from 'antd';
import styles from './index.module.less';
import { propsType } from './type';

const Introduce = ({ visible, closeDrawer }: propsType) => {
  return (
    <Drawer
      visible={visible}
      title='人才甄选测验（DISC）'
      onClose={closeDrawer}
    >
      <div className={styles.introduce}>
        <div className={styles.introduce_content}>
          <div className={styles.base_info}>
            <div className={styles.title}>
              <span className={styles.title_line} />
              <span className={styles.title_text}>基本信息</span>
            </div>
            <div className={styles.item}>
              <div className={styles.item_title}>量表介绍</div>
              <div className={styles.item_content}>测评结果包含20种人格行为特质分析和近200中岗位匹配分析，完成测评可获得《DISC：人才甄选测评》报告</div>
            </div>
            <div className={styles.item}>
              <div className={styles.item_title}>报告包含</div>
              <div className={styles.item_content}>报告包含：岗位匹配、职业性格、典型特征分析、专业选择</div>
            </div>
            <div className={styles.item}>
              <div className={styles.item_title}>作答时间（题目数量）</div>
              <div className={styles.item_content}>10分钟 （40题）</div>
            </div>
          </div>
          <div className={styles.intro}>
            <div className={styles.title}>
              <span className={styles.title_line} />
              <span className={styles.title_text}>介绍图文</span>
            </div>
          </div>
        </div>
        <div className={styles.introduce_footer}>footer</div>
      </div>
    </Drawer>
  );
}

export default Introduce;
