import { getAllUrlParam } from '@/utils/utils';
import { openTryoutSku } from 'dingtalk-design-libs';
import React, { FC, Fragment, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from "./index.module.less"

const PreviewPage: FC = () => {
    const { corpId, appId } = getAllUrlParam()
    const [search] = useSearchParams();
    const purchaseToken = search.get('purchaseToken') || '0';

    const handleSku = () => {
        const app = appId.slice(2);
        openTryoutSku({
            corpId: corpId,
            appId: Number(app),
            token: purchaseToken,
        }).then((res: any) => {
            const { action } = res;
            if (action === "ok") {
                window.location.replace(`https://qzz-eval.forwe.store/admin/?corpId=${corpId}&appId=${appId}&clientId=suitec4v2ev3hjqdg3hy5#/user/login`)
            }
        }).catch((err: any) => {
            // 钉钉侧出现了技术异常，比如打开弹窗失败等，出现概率非常低
            console.log(err);
        });
    };

    useEffect(() => {
        handleSku();
    }, []);

    return (
        <div className={styles.preview_box}>
            <img className={styles.preview_img} onClick={handleSku} src="//qzz-static.forwe.store/public-assets/eval-preview-pc%20%402x.png" alt="" />
        </div>
    )
}

export default PreviewPage;