import { Button, Modal, Spin, Upload } from 'antd';
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import type { UploadProps } from 'antd';
import { POSITION_UPLOAD, EXCEL_EXPORT } from '@/api/api';
import { formType } from '../form/type';
import styles from './index.module.less';
import dd from "dingtalk-jsapi";
import axios from 'axios';

const controller = new AbortController();

interface Props {
    uploadVisible: boolean,
    setUploadVisible: (uploadVisible:boolean) => void,
    searchForm: formType,
    setIsReload: (isReload: boolean) => void
};

const UploadModal: React.FC<Props> = ({ uploadVisible, setUploadVisible, searchForm, setIsReload }: Props) => {
    const [downloadBtn, setDownloadBtn] = useState<boolean>(false); //download btn loading status
    const [downloadDis, setDownloadDis] = useState<boolean>(false); //download btn disable status
    const [step, setStep] = useState<number>(1); //modal step
    const [loadStep, setLoadStep] = useState<number>(1); //save download excel step
    const [url, setUrl] = useState<string>(''); //save current excel url
    const [fileName, setFileName] = useState<string>(''); //save file name
    const [progress, setProgress] = useState<number>(0); //save upload progress
    const [iconSrc, setIconSrc] = useState<string>(''); //save current status icon
    const [promptText, setPromptText] = useState<string>(''); //save current prompt
    const [opacity, setOpacity] = useState<number>(1);

    const customUpload = async (option: any) => {
        console.log(option);
        const { onSuccess, onError, file, onProgress } = option;
        setFileName(file.name);
        const fmData = new FormData();
        const config = {
            headers: {
                "content-type": "multipart/form-data",
                "QZZ_ACCESS_TOKEN": sessionStorage.getItem('QCP_B_TOKEN') as string,
            },
            signal: controller.signal,
            onUploadProgress: (event: any) => {
                const percent = Math.floor((event.loaded / event.total) * 100);
                setProgress(percent);
            }
        };
        fmData.append("file", file);
        try {
            const res = await axios.post(
                "/api/member/user/position/upload",
                fmData,
                config
            );
            onSuccess(res)
        } catch (err) {
            onError(err)
        }
    }

    const props: UploadProps = {
        customRequest: customUpload,
        onChange(info) {
            if (info.file.status === 'uploading') {
                setFileName(info.file.name);
                setOpacity(0);
            }
            if (info.file.status === 'done') {
                setIconSrc("https://daily-static-file.oss-cn-shanghai.aliyuncs.com/evaluation-web/imgs/xdjy/success-icon.png");
                setPromptText("导入成功");
                setLoadStep(5);
                setIsReload(true)
            } else if (info.file.status === 'error') {
                setIconSrc("https://daily-static-file.oss-cn-shanghai.aliyuncs.com/evaluation-web/imgs/xdjy/error-icon.png");
                setPromptText("导入失败");
                setLoadStep(5);
            }
        },
    };

    useEffect(() => {
        if (loadStep === 4) {
            setDownloadDis(true);
        } else {
            setDownloadDis(false);
        }
    }, [loadStep]);

    useEffect(() => {
        if (uploadVisible) {
            queryExcel()
        }
    }, [uploadVisible])

    /**
     * handle ok btn event
     */
    const handleOk = () => {
        setStep(step => step += 1);
        setLoadStep(4);
        if (step === 1) return
        setUploadVisible(false);
    };

    /**
     * handle cancel btn event
     */
    const handleCancel = () => {
        setUploadVisible(false);
    };

    /**
     * handle btn cancel event
     */
    const handleCancelBtn = () => {
        if (step === 1) {
            setUploadVisible(false);
        } else {
            if (loadStep === 4 && opacity != 0) {
                setStep(1);
                setLoadStep(3);
            } else {
                if (loadStep === 5) {
                    setLoadStep(4);
                    setOpacity(1);
                } else {
                    controller.abort();
                    setOpacity(1);
                }
            }
        }
    };

    /**
     * handle return prompt dom
     */
    const Prompt = () => {
        if (step === 1) {
            return (
                <p className={styles.Prompt_p}>*请先下载最新备份员工数据再进入下一步</p>
            )
        } else {
            return (
                <p></p>
            )
        }
    };

    /**
     * Modal after close callback
     */
    const afterClose = () => {
        setStep(1);
        setLoadStep(1);
        setOpacity(1);
    };

    /**
     * handle cancel upload
     */
    const handleCancelUpload = () => {
        controller.abort()
        setOpacity(1);
    };

    /**
     * query excel event
     */
    const queryExcel = async () => {
        setDownloadBtn(true);
        const { code, data } = await EXCEL_EXPORT({
            ...searchForm
        });
        if (code === 1) {
            setDownloadBtn(false);
            setUrl(data.domain + '/' + data.path);
        }
    }

    /**
     * return download excel
     * @returns dom
     */
    const DownloadExcel = () => {
        switch (loadStep) {
            case 1:
                return (
                    <div className={styles.Upload_download_box}>
                        <img className={styles.Upload_excel_img} src="https://daily-static-file.oss-cn-shanghai.aliyuncs.com/evaluation-web/imgs/xdjy/excel-icon.png" alt="" />
                        <p className={styles.Upload_p}>备份员工导出数据</p>
                        <Button type="primary" disabled={downloadDis} loading={downloadBtn} onClick={handleDownloadExcel}>立即下载</Button>
                    </div>
                );
            case 2:
                const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
                return (
                    <div className={styles.Upload_download_box}>
                        <Spin className={styles.Spin_loading} indicator={antIcon} tip='下载可能需要一段时间，请不要关闭页面' />
                    </div>
                );
            case 3:
                return (
                    <div className={styles.Upload_download_box}>
                        <img className={styles.Upload_excel_img} src="https://daily-static-file.oss-cn-shanghai.aliyuncs.com/evaluation-web/imgs/xdjy/success-icon.png" alt="" />
                        <p className={styles.Upload_h}>下载完成</p>
                        <p className={styles.Upload_p}>请前往Excel进行批量编辑</p>
                    </div>
                );
            case 4:
                return (
                    <>
                        <div className={styles.Upload_download_box} style={{ opacity: opacity, zIndex: opacity }}>
                            <Upload {...props} maxCount={1} accept='.xlsx' showUploadList={false}>
                                <Button type="primary">导入人岗匹配明细</Button>
                            </Upload>
                            <p className={styles.Upload_p}>支持拓展名：.xlsx</p>
                        </div>
                        <div className={styles.Upload_download_box} style={{ opacity: `${opacity == 1 ? 0 : 1}`, zIndex: `${opacity == 1 ? 0 : 1}` }}>
                            <img className={styles.Upload_excel_img} src="https://daily-static-file.oss-cn-shanghai.aliyuncs.com/evaluation-web/imgs/xdjy/excel-icon.png" alt="" />
                            <p className={styles.Upload_t}>{fileName}</p>
                            <div style={{ display: 'flex', width: '100%' }}>
                                <CloseOutlined className={styles.Close_icon} onClick={handleCancelUpload} />
                            </div>
                            <div className={styles.Upload_track}>
                                <div className={styles.Upload_progress} style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className={styles.Upload_p}>导入可能需要一段时间，请不要关闭或刷新页面</p>
                        </div>
                    </>
                );
            case 5:
                return (
                    <div className={styles.Upload_download_box}>
                        <img className={styles.Upload_excel_img} src={iconSrc} alt="" />
                        <p className={styles.Upload_h}>{promptText}</p>
                    </div>
                );
            default:
                return (
                    <div className={styles.Upload_download_box}>
                        <img className={styles.Upload_excel_img} src="https://daily-static-file.oss-cn-shanghai.aliyuncs.com/evaluation-web/imgs/xdjy/excel-icon.png" alt="" />
                        <p className={styles.Upload_p}>备份员工导出数据</p>
                        <Button type="primary" disabled={downloadDis} loading={downloadBtn} onClick={handleDownloadExcel}>立即下载</Button>
                    </div>
                );
        }
    };

    /**
     * dd download event
     */
    const handleDownloadExcel = () => {
        setDownloadDis(true);
        setLoadStep(2)
        // window.open(url);
        // setTimeout(() => {
        //     setDownloadDis(false);
        //     setLoadStep(3);
        // }, 3000);
        dd.biz.util.downloadFile({
            url: url, //要下载的文件的url
            name: '员工数据', //定义下载文件名字
            onProgress: function (msg: any) {
                // 文件下载进度回调
            },
            onSuccess: function (result: any) {
                setDownloadDis(false);
                setLoadStep(3);
            },
            onFail: function () { }
        })
    }

    return (
        <>
            <Modal title="批量编辑" className={styles.Upload_modal} visible={uploadVisible} footer={null} onCancel={handleCancel} afterClose={afterClose}>
                <main className={styles.Modal_main}>
                    {DownloadExcel()}
                </main>
                <footer className={styles.Modal_Footer}>
                    {Prompt()}
                    <Button style={{ marginLeft: 'auto' }} onClick={handleCancelBtn}>{step === 1 ? '取消' : '上一步'}</Button>
                    <Button type="primary" style={{ marginLeft: '8px' }} disabled={downloadDis} onClick={handleOk}>{step === 1 ? '下一步' : '完成'}</Button>
                </footer>
            </Modal>
        </>
    );
};

export default UploadModal;