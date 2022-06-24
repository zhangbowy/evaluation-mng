import { openTryoutSku } from 'dingtalk-design-libs';
import React, { FC, Fragment, useEffect } from 'react';
import queryString from 'query-string';
import styles from "./index.less"

const PreviewPage: FC = () => {
    const { corpId, appId, purchaseToken, clientId } = queryString.parse(location.search) as {
        corpId: string;
        appId: string;
        purchaseToken: string;
        clientId: string;
    };

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
        <Fragment>
            <div className={styles.preview_box}>
                <img className={styles.preview_img} onClick={handleSku} src="//qzz-static.forwe.store/public-assets/eval-preview-pc%20%402x.png" alt="" />
            </div>
        </ Fragment>
    )
}

export default PreviewPage;