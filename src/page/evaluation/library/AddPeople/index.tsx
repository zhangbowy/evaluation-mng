import { Button, Input, message, Modal, Result } from 'antd'
import React, { useState, forwardRef, useImperativeHandle, ChangeEvent, Fragment, useContext } from 'react';
import styles from './index.module.less'
import { ddAddPeople, getAllUrlParam, getAppIdType } from '@/utils/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IExamTemplateList } from '../type';
import dd from 'dingtalk-jsapi';
import { shareInfo } from '@/api/api';
import { CountContext } from '@/utils/context';

const AddPeople = forwardRef((props, ref) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false) // 是否显示弹窗
    const [curExamTemplate, setCurExamTemplate] = useState<IExamTemplateList>() // 当前测评模板
    const [successVisible, setSuccessVisible] = useState<boolean>(false) // 是否显示成功弹窗
    const [isSuccess, setIsSuccess] = useState<boolean>(false) // 是否成功
    const [inputValue, setInputValue] = useState<string>()
    const { state, dispatch } = useContext(CountContext)
    const navigator = useNavigate()
    const { corpId, appId, clientId } = getAllUrlParam()
    const appType = getAppIdType();
    const logo = appType === '2'
        ? 'https://qzz-static.forwe.store/evaluation-web/imgs/xdjy/xdjy_logo.png'
        : 'https://qzz-static.forwe.store/evaluation-mng/imgs/%E8%B6%A3%E6%B5%8B%E8%AF%84logo2.png'
    const linkUrl = appType === '2' ? `dingtalk://dingtalkclient/page/link?url=${window.encodeURIComponent(`${window.location.origin}/xdjy-web/?corpId=${corpId}&appId=${appId}&clientId=${clientId}#/login`)}&pc_slide=true`
        : `dingtalk://dingtalkclient/page/link?url=${window.encodeURIComponent(`${window.location.origin}/?corpId=${corpId}&appId=${appId}&clientId=${clientId}#/user/login`)}&pc_slide=true`
    const qcp_b_user = JSON.parse(window.sessionStorage.getItem('QCP_B_USER') || '{}');
    useImperativeHandle(ref, () => ({
        openModal
    }))
    // 下一步
    const handleOk = () => {
        // 成功回调
        const successFn = () => {
            setIsSuccess(true);
            setIsModalVisible(false)
            setSuccessVisible(true)
            dispatch()
        }
        const failFn = () => {
            setIsSuccess(false);
            setIsModalVisible(false)
            setSuccessVisible(true)
        }
        const params: IAddPeopleParams = {
            appId,
            corpId,
            successFn,
            failFn,
            examTemplateType: curExamTemplate?.type,
            examTemplateId: curExamTemplate?.id,
            pointPrice: curExamTemplate?.examCouponCommodityDetail?.pointPrice, // 每人消耗点券
            examTitle: inputValue, // 标题
            availableBalance: state
        }
        ddAddPeople(params, 'add')
    }
    // 打开
    const openModal = (item: IExamTemplateList) => {
        setIsModalVisible(true)
        setInputValue(item.title)
        setCurExamTemplate(item)
    }
    // 去充值
    const goRecharge = () => {
        navigator('/evaluation/recharge')
    }
    // 通知测评
    const onInformClick = () => {
        if (dd.env.platform != 'notInDingTalk') {
            dd.ready(async () => {
                const candidates = await dd.biz.chat.pickConversation({
                    corpId, //企业id,必须是用户所属的企业的corpid
                    isConfirm: false,
                    onFail: (err: any) => {
                        message.error(err);
                    },
                })
                if (candidates.cid) {
                    Modal.confirm({
                        title: '确认发送',
                        content: `消息将发送给${candidates.title}`,
                        okText: '确认',
                        onOk: async () => {
                            const msg = {
                                msgtype: "link",
                                link: {
                                    messageUrl: linkUrl,
                                    image: logo,
                                    title: "您有一份测评待完成",
                                    text: "全抖音1亿用户都在玩的性格测评，赶紧测一测吧！"
                                }
                            }
                            const res = await shareInfo({ cid: candidates.cid, message: JSON.stringify(msg), userId: qcp_b_user?.userId });
                            if (res.code == 1) {
                                message.success('发送成功');
                                setSuccessVisible(false)
                            }
                        },
                        cancelText: '取消',
                    });
                }
            })
        }
    }
    // 关闭
    const handleCancel = () => {
        setIsModalVisible(false)
    }
    // 输入框change
    const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputValue(e.target.value)
    }
    return (
        <Fragment>
            <Modal title="添加人员" cancelText="取消" okText="下一步" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p className={styles.addPeople_title}>请先确认本次测评名称</p>
                <Input className={styles.addPeople_input}
                    style={{ borderBottom: '1px solid #2B85FF', paddingLeft: 0 }}
                    allowClear bordered={false} value={inputValue} onChange={onInputChange} placeholder="请输入测评名称" />
            </Modal>
            <Modal visible={successVisible} onCancel={() => setSuccessVisible(false)} footer={false} width={424}>
                <Result
                    status={isSuccess ? "success" : "error"}
                    title={isSuccess ? "创建成功" : "创建失败"}
                    subTitle={isSuccess ? "快去通知小伙伴们测评吧" : '点券不足，请充值'}
                    extra={[
                        <Button type="primary" key="console" onClick={isSuccess ? onInformClick : goRecharge}>
                            {isSuccess ? '通知测评' : '去充值'}
                        </Button>
                    ]}
                />
            </Modal>
        </Fragment>
    )
})
AddPeople.displayName = 'AddPeople'
export default AddPeople