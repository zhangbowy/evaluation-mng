import { getExamResult } from '@/services/api';
import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';
import { PageLoading } from '@ant-design/pro-layout';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';

const ReportResult: React.FC<{ userId: string; examId: number }> = ({ userId, examId }) => {
  const [result, setResult] = useState<ExamResult>();
  const container = useRef<any>();

  //生成雷达图
  const radarMap = (polygon: string) => {
    if (!polygon) return;
    const { DataView } = DataSet;
    const json = JSON.parse(polygon);
    const data = Object.keys(json).map((key) => ({
      item: key,
      a: json[key],
    }));

    const dv = new DataView().source(data);
    dv.transform({
      type: 'fold',
      fields: ['a'], // 展开字段集
      key: 'user', // key字段
      value: 'score', // value字段
    });
    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 200,
      padding: 30,
    });

    chart.data(dv.rows);
    chart.scale('score', {
      min: 0,
      max: 5,
      tickCount: 5,
    });
    chart.coordinate('polar', {
      radius: 0.8,
    });
    chart.axis('item', {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            stroke: 'rgba(207, 207, 207, 1)', // 雷达线的颜色
            lineDash: null,
          },
        },
      },
      label: {
        style: {
          fill: '#434343', // label文字颜色
        },
      },
    });
    chart.axis('score', {
      line: null,
      tickLine: null,
      label: null, //圆圈数据文字
      grid: {
        line: {
          type: 'circle',
          style: {
            stroke: 'rgba(210, 210, 210, 1)', // 网格线的颜色
            lineDash: null,
          },
        },
      },
    });

    chart.area().position('item*score').style({
      fill: '#DFDFDF', //区域填充颜色
      fillOpacity: '0.5', //区域填充颜色透明度
    });
    chart.tooltip(false);
    chart.render();
  };
  useEffect(() => {
    getExamResult({ userId, examId }).then((res) => {
      if (res.code === 1) {
        setResult(res.data);
        //防止多次渲染雷达图
        container.current.innerHTML = '';
        radarMap(res.data.polygon);
      }
    });
  }, [userId, examId]);
  if (!result) {
    return <PageLoading />;
  }
  return (
    <div className="pageResult">
      <div>
        {/* 性格结果 */}
        <div id="capture" className={styles.capture}>
          <div className={styles.backImg} />
          <div className={styles.resultBox}>
            <div className={styles.resultLitterBox}>
              <div className={styles.contentBox}>
                <div className={styles.resultLeft}>
                  <div className={styles.text}>我是</div>
                  <div className={styles.character}>
                    {result.results?.[0]?.type}
                    {result.results?.length > 1 && `+${result.results?.[1]?.type}`}
                  </div>
                  <div className={styles.describe}>{result.textDesc}</div>
                </div>
                <div className={styles.resultRight}>
                  <img src={result.results?.[0]?.typeIcon} />
                  {result.results?.length > 1 && (
                    <img
                      className={styles.jiahao}
                      src="https://qzz-static.forwe.store/evaluation-web/imgs/pdp/jiahao%402x.png"
                    />
                  )}
                  {result.results?.length > 1 && <img src={result.results?.[1]?.typeIcon} />}
                </div>
              </div>
              {/* 雷达图 */}
              <div className={styles.container}>
                <div id="container" ref={container} />
                <div className={styles.userInfo}>
                  {result.user.avatar ? (
                    <img className={styles.userImg} src={result.user.avatar} />
                  ) : (
                    <span className={styles.span}>{result.user.name}</span>
                  )}
                </div>
                <div className={styles.userName}>{result.user.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 类型描述 */}
        <div className={styles.describeBox}>
          <img src={result.imageDesc} className={styles.describeImg} />
        </div>
      </div>
    </div>
  );
};

export default ReportResult;
