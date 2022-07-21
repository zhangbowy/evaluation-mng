import React, {Fragment, useState} from 'react';
import styles from './index.module.less';
import ReportHeader from '@/components/resultHeader';
import { IResult } from '@/page/evaluation/management/type';

interface IntroduceData {
    title: string;
    key: string;
}
const CareerAnchor = (props: { resultList: IResult }) => {
    const qcp_c_labelBg1 =
        '//qzz-static.forwe.store/evaluation-web/imgs/qcp_web_image/qcp_c_labelbg1.png';
    const qcp_c_labelBg2 =
        '//qzz-static.forwe.store/evaluation-web/imgs/qcp_web_image/qcp_c_labelbg2.png';
    const introduce: IntroduceData[] = [
        {
            title: '岗位匹配',
            key: 'matching',
        },
        {
            title: '职业性格',
            key: 'character',
        },
        {
            title: '典型特征',
            key: 'features',
        },
        {
            title: '专业选择',
            key: 'decision',
        },
    ];
    const { resultList } = props;
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    // tab切换
    const onTabClick = (index: number) => {
        setCurrentIndex(index);
    };
    return (
        <div className={styles.careerAnchor_layout}>
            <div className={styles.careerAnchor_wrapper}>
                <ReportHeader
                    src={resultList?.user.avatar}
                    name={resultList!.user.name}
                />
                <main>
                    <div className={styles.careerAnchor_main_title}>
                        <img
                            className={styles.careerAnchor_labelBg}
                            src={
                                Number(resultList?.results.length) > 1
                                    ? qcp_c_labelBg1
                                    : qcp_c_labelBg2
                            }
                            alt=""
                        />
                        <div className={styles.careerAnchor_labelBg_text}>
                            {resultList!.results.length > 1 ? (
                                <div className={styles.careerAnchor_labelBg_type}>
                                    <h2>{resultList?.results[0].type?.split('：')[0]}</h2>
                                    <h2>+</h2>
                                    <h2>{resultList?.results[1].type?.split('：')[0]}</h2>
                                </div>
                            ) : (
                                <Fragment>
                                    <h2>{resultList?.results[0]?.type?.split('：')[0]}</h2>
                                    <p>{resultList?.results[0]?.type?.split('：')[1]} </p>
                                </Fragment>
                            )}
                        </div>
                    </div>
                    <div className={styles.careerAnchor_main_content}>
                        {resultList!.results.length > 1 && (
                            <ul>
                                {resultList?.results.map(
                                    (
                                        item: {
                                            type: string;
                                            typeIcon: string;
                                        },
                                        index: number,
                                    ) => (
                                        <li
                                            key={index}
                                            className={
                                                (index == currentIndex &&
                                                    styles.careerAnchor_main_selectTab) ||
                                                ''
                                            }
                                            onClick={() => onTabClick(index)}
                                        >
                                            {item.type}
                                        </li>
                                    ),
                                )}
                            </ul>
                        )}
                        <div className={styles.careerAnchor_main_wrapper}>
                            {introduce.map((item: IntroduceData) => (
                                <div key={item.key} className={styles.careerAnchor_main_item}>
                                    <h2>{item.title}</h2>
                                    <p>{resultList?.htmlDescList[currentIndex][item.key]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CareerAnchor;
