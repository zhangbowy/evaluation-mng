import React, { Fragment, LegacyRef, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { Rate } from 'antd';
import ProgressCircle from './progressCircle';
import ReportHeader from '@/components/resultHeader';
import { IResult } from '@/page/evaluation/management/type';


const Charm = (props: { charmList: IResult }) => {
    const quotationMarksImg1 =
        'https://qzz-static.forwe.store/evaluation-web/imgs/qcp_web_image/qcp_c_quotationMarks_left.png';
    const { charmList } = props
    return (
        <div className={styles.charm_layout}>
            <ReportHeader name={charmList!.user.name} src={charmList?.user.avatar} />
            <div className={styles.charm_wrapper} >
                <main>
                    <img src={quotationMarksImg1} alt="" />
                    <div className={styles.charm_main_content}>
                        <h2>我的魅力指数</h2>
                        <Rate
                            className={styles.charm_main_rate}
                            disabled
                            value={
                                parseInt(charmList?.results[0].type.split('：')[1] || '0') /
                                2 /
                                10
                            }
                        />
                        <ProgressCircle
                            percent={parseInt(charmList?.results[0].type.split('：')[1] || '0')}
                        />
                    </div>
                    <div className={styles.charm_main_JH}>#</div>
                </main>
                <p>{charmList?.textDesc}</p>
            </div>
        </div>
    );
};

export default Charm;
