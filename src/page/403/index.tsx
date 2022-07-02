import dd from 'dingtalk-jsapi';
import React, { FC, Fragment } from 'react';
import { useParams } from 'react-router';
import styles from './index.module.less';

const NoAuthPage: FC = () => {
    const statusText: { [key: number]: string } = {
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
    const pushUrl: string = 'http://h5.dingtalk.com/open-purchase/mobileUrl.html?redirectUrl=https%3A%2F%2Fh5.dingtalk.com%2Fopen-market%2Fshare.html%3FshareGoodsCode%3DD34E5A30A9AC7FC63FE9AA1FB5D7DFC882653BC130D98DC599D1E334FC2D720DBBD3FB0872C1D1E6%26token%3D6283956d3721d4ba717dd18e362e5a70%26shareUid%3D383B86070279D64685AA4989BCA9F331&dtaction=os'
    const { code } = useParams();
    const noPermissionsImg = '//daily-static-file.oss-cn-shanghai.aliyuncs.com/evaluation-web/imgs/nopermissions_img.png';
    const onContactClick = () => {
        if (dd.env.platform != 'notInDingTalk') {
            dd && dd.ready(function () {
                dd.biz.util.openSlidePanel({
                    url: pushUrl,
                    title: '',
                    onSuccess: function (result: any) {
                        console.log(result, 'result')
                    },
                    onFail: function (err: any) {
                        console.log(err, 'err')
                    }
                })
            });
        }
    }
    return (
        <Fragment>
            <div className={styles.permissions_layout}>
                <img src={noPermissionsImg} alt="" />
                <p>{statusText[code as unknown as number]}</p>
                <div onClick={onContactClick} className={styles.permissions_btn}>立即联系</div>
            </div>
        </Fragment>
    )
}

export default NoAuthPage;