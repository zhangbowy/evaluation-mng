import { openTryoutSku } from 'dingtalk-design-libs';
import React, { FC, Fragment, useEffect } from 'react';
import { history } from 'umi';
import queryString from 'query-string';
import styles from "./index.less"

const PreviewPage: FC = () => {
    const { corpId, appId, purchaseToken } = queryString.parse(location.search) as {
        corpId: string;
        appId: string;
        purchaseToken: string;
    };

    const handleSku = () => {
        const app = appId.slice(2);
        openTryoutSku({
            corpId: corpId,
            appId: Number(app),
            token: '',
        }).then((res: any) => {
            const { action } = res;
            if (action === "ok") {
                window.location.replace('/user/login')
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
            <img className={styles.preview_img} onClick={handleSku} src="//qzz-static.forwe.store/evaluation-mng/imgs/%E8%B6%A3%E6%B5%8B%E8%AF%84logo2.png" alt="" />
        </ Fragment>
    )
}

export default PreviewPage;