import React from 'react';
import styles from './index.module.less';
import cs from 'classnames';

const MatchingArea = () => {
  return (
    <div className={styles.matching_area}>
      <div className={cs(styles.matching_area_text_top, styles.text)}>价值观匹配参考（高100%）</div>
      <div className={styles.matching_area_content}>
        <div className={cs(styles.matching_area_text_left, styles.text)}>岗位潜力匹配参考（低0%）</div>
        <table className={styles.matching_area_table}>
          <tfoot>
            <div className={styles.matching_area_table_single_right}></div>
            <div className={styles.matching_area_table_single_top}></div>
            <div className={styles.matching_area_table_point}></div>
          </tfoot>
          <tr className={styles.matching_area_table_tr}>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr className={styles.matching_area_table_tr}>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr className={styles.matching_area_table_tr}>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr className={styles.matching_area_table_tr}>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
        <div className={cs(styles.matching_area_text_right, styles.text)}>岗位潜力匹配参考（高100%）</div>
      </div>
      <div className={cs(styles.matching_area_text_bottom, styles.text)}>价值观匹配参考（低0%）</div>
    </div>
  );
}

export default MatchingArea;
