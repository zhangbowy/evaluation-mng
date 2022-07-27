import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styles from './index.module.less';
import { Rate } from 'antd';
import ProgressCircle from './progressCircle';
import ReportHeader from '@/components/resultHeader';
import { IResult } from '@/page/evaluation/management/type';


const Charm = forwardRef((props: { charmList: IResult }, ref) => {
    const quotationMarksImg1 =
        '/evaluation-web/imgs/qcp_web_image/qcp_c_quotationMarks_left.png';
    const { charmList } = props
    const screenshotRef = useRef<HTMLDivElement | null>(null) // 保存截图的节点
    useImperativeHandle(ref, () => ({
        screenshotRef: screenshotRef.current
    }))
    return (
        <div className={styles.charm_layout}>
            <div ref={screenshotRef} className={styles.charm_bg} >
                <ReportHeader name={charmList?.user.name} src={charmList?.user.avatar} />
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
        </div>
    );
});

export default Charm;
