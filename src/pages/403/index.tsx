import dd from 'dingtalk-jsapi';
import React, { Fragment } from 'react';
import { useModel, useParams } from 'umi'
import styles from './index.less';
type params = {
    code: string
}
const NoAuthPage: React.FC = () => {
    const statusText: any = {
        2007001: "已超过试用时间，如需继续使用，请购买正式版",
        2007002: "已超过使用时间，如需继续使用，请续费",
        2007003: "应用已禁用，请联系管理员",
        2007004: "所购买版本使用人数已达上线， 请联系管理员进行服务升级",
        2003001: "企业正在初始化",
        2003002: "未找到企业或组织",
        2000004: "企业没有授权开通应用",
        2000005: "系统繁忙，请稍后再试",
        2000006: '钉钉api服务接口错误',
        99999: '您当前没有权限,请联系管理员'
    }
    const pushUrl: string = '//h5.dingtalk.com/org-center/index.html?showmenu=false&dd_share=false&goodsCode=DT_GOODS_881651914535236&fromQrCode=1&channelCode=?fb&sig=b2db31e9cc9b9f090688e2125d16bf898adacade&funnelsource=goodsOfflineQrcode&leadsFrom=401'
    const params: params = useParams();
    const { code } = params;
    const noPermissionsImg = '//daily-static-file.oss-cn-shanghai.aliyuncs.com/evaluation-web/imgs/nopermissions_img.png';
    const ceIcon = '//qzz-static.forwe.store/evaluation-mng/imgs/%E8%B6%A3%E6%B5%8B%E8%AF%84logo2.png'
    const onContactClick = () => {
        if (dd.env.platform != 'notInDingTalk') {
            dd && dd.ready(function () {
                dd.biz.util.openSlidePanel({
                    url: pushUrl,
                    title: '',
                    onSuccess: function (result:any) {
                        console.log(result,'result')
                    },
                    onFail: function (err:any) {
                        console.log(err,'err')
                    }
                })
            });
        }
    }
    return (
        <Fragment>
            <header className={styles.nopermissions_header} >
                <div className={styles.nopermissions_header_left}>
                    <img src={ceIcon} alt="" />
                    <div>趣测评管理后台</div>
                </div>
                <div className={styles.nopermissions_header_right} >
                    {/* <img src={ceIcon} alt="" />
                    <div>刘恒</div> */}
                </div>
            </header>
            <div className={styles.permissions_layout}>
                <img src={noPermissionsImg} alt="" />
                <p>{statusText[code]}</p>
                <div onClick={onContactClick} className={styles.permissions_btn}>立即联系</div>
            </div>
        </Fragment>
    )
}

export default NoAuthPage;