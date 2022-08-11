import dd from "dingtalk-jsapi"

// 文件下载
export const downloadFile = (url: string, name: string) => {
    dd.env.platform != 'notInDingTalk' && dd.biz.util.downloadFile({
        url,
        name
    })
}