import { Button, Input, message, Modal, Result } from 'antd'
import React, { useState, forwardRef, useImperativeHandle, ChangeEvent, Fragment, useContext } from 'react';
import styles from './index.module.less'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IExamTemplateList } from '../type';
import dd from 'dingtalk-jsapi';
import { createExam, getAllPeople, shareInfo } from '@/api/api';
import { CountContext } from '@/utils/hook';

const AddPeople = forwardRef((props, ref) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false) // 是否显示弹窗
    const [curExamTemplate, setCurExamTemplate] = useState<IExamTemplateList>() // 当前测评模板
    const [successVisible, setSuccessVisible] = useState<boolean>(false) // 是否显示成功弹窗
    const [isSuccess, setIsSuccess] = useState<boolean>(false) // 是否成功
    const [inputValue, setInputValue] = useState<string>()
    const [search] = useSearchParams()
    const navigator = useNavigate()
    const corpId = search.get('corpId') || '0';
    const appId = search.get('appId') || '0';
    const clientId = search.get('clientId') || '0';
    const qcp_b_user = JSON.parse(window.sessionStorage.getItem('QCP_B_USER') || '{}');
    useImperativeHandle(ref, () => ({
        openModal
    }))
    // 下一步
    const handleOk = async () => {
        // 成功回调
        const successFn = () => {
            setIsSuccess(true);
            setIsModalVisible(false)
            setSuccessVisible(true)
        }
        const failFn = () => {
            setIsSuccess(false);
            setIsModalVisible(false)
            setSuccessVisible(true)
        }
        console.log(location.href, corpId, appId)
        // const { state } = useContext(CountContext)
        // console.log(state, 'state')
        const obj = {
            tpf: 1,
            appId,
            corpId,
            curPage: 1,
            pageSize: 1000
        }
        console.log(obj, 'obj')
        const res = await getAllPeople(obj)
        console.log(res, 'res')
        if (res.code == 1) {
            dd.env.platform !== 'notInDingTalk' &&
                dd.ready(() => {
                    console.log('多选人')
                    dd.biz.customContact.multipleChoose({
                        title: '请选择', //标题
                        users: res.data.resultList.map((user: IUser) => user.userId),//一组员工工号
                        corpId,//企业 ID，
                        isShowCompanyName: true,   //true|false，默认为 false
                        selectedUsers: [], //默认选中的人，注意:已选中不可以取消
                        max: 10, //人数限制
                        onSuccess: (data: Multiple[]) => {
                            console.log(data, '成功了')
                            Modal.confirm({
                                title: '温馨提示',
                                content: `本次测评预计最多消耗${(curExamTemplate?.examCouponCommodityDetail?.originalPointPrice || 0) * data.length}点券，当前可用点券：1000`,
                                okText: '确认',
                                cancelText: '取消',
                                onOk: async () => {
                                    console.log('球球了')
                                    const list = {
                                        examTemplateType: curExamTemplate?.type as string,
                                        examTemplateId: curExamTemplate?.id as number,
                                        examTitle: inputValue as string,
                                        examUserList: data.map((list: Multiple) => ({ userId: list.emplId }))
                                    }
                                    const result = await createExam(list)
                                },
                            })
                        },
                        onFail: function (err: Error) {
                            console.log(err, '失败了啊')
                        }
                    });
                })
        }

        // const params: IAddPeopleParams = {
        //     appId,
        //     corpId,
        //     successFn,
        //     failFn,
        //     examTemplateType: curExamTemplate?.type,
        //     examTemplateId: curExamTemplate?.id,
        //     originalPointPrice: curExamTemplate?.examCouponCommodityDetail?.originalPointPrice,
        //     examTitle: inputValue,
        // }
        // ddAddPeople(params)
    }
    // 钉钉选人
    const ddSelectPeople = (item: IDDSelectPeopleParams) => {
        console.log('进来了', item)
        const { state } = useContext(CountContext)
        dd.env.platform !== 'notInDingTalk' &&
            dd.ready(() => {
                dd.biz.customContact.multipleChoose({
                    title: '请选择', //标题
                    users: item.usersList,//一组员工工号
                    corpId: item.corpId,//企业 ID，
                    isShowCompanyName: true,   //true|false，默认为 false
                    selectedUsers: item.selectedUsers || [], //默认选中的人，注意:已选中不可以取消
                    max: 10, //人数限制
                    onSuccess: (data: Multiple[]) => {
                        console.log(data, '成功了')
                        Modal.confirm({
                            title: '温馨提示',
                            content: `本次测评预计最多消耗${(item?.originalPointPrice || 0) * data.length}点券，当前可用点券：${state}`,
                            okText: '确认',
                            cancelText: '取消',
                            onOk() {
                                item.successFn(data)
                            },
                        })
                    },
                    onFail: function (err: Error) {
                        console.log(err, '失败了啊')
                    }
                });
            })
    }
    // 添加
    const ddAddPeople = async (item: IAddPeopleParams) => {
        const obj = {
            tpf: 1,
            appId: item.appId,
            corpId: item.corpId,
            curPage: 1,
            pageSize: 1000
        }
        const res = await getAllPeople(obj)
        if (res.code == 1) {
            const createFn = async (data: Multiple[]) => {
                const list = {
                    examTemplateType: item.examTemplateType as string,
                    examTemplateId: item.examTemplateId as number,
                    examTitle: item.examTitle as string,
                    examUserList: data.map((list: Multiple) => ({ userId: list.emplId }))
                }
                const result = await createExam(list)
                if (result.code === 1) {
                    item.successFn()
                } else {
                    item.failFn()
                }
            }
            const ddParams = {
                corpId: item.corpId,
                usersList: res.data.resultList.map((user: IUser) => user.userId),
                successFn: createFn,
                originalPointPrice: item.originalPointPrice
            }
            ddSelectPeople(ddParams)
        }
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
                                    messageUrl: `${window.location.origin}/?corpId=${corpId}&appId=${appId}&clientId=${clientId}#/user/login`,
                                    image: "http://qzz-static.forwe.store/evaluation-mng/imgs/%E8%B6%A3%E6%B5%8B%E8%AF%84logo2.png",
                                    title: "您有一份测评待完成",
                                    text: "全抖音1亿用户都在玩的性格测评，赶紧测一测吧！"
                                }
                            }
                            const res = await shareInfo({ cid: candidates.cid, message: JSON.stringify(msg), userId: qcp_b_user?.userId });
                            if (res.code == 1) {
                                message.success('发送成功');
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
                    style={{ borderBottom: '1px solid #2B85FF' }}
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

export default AddPeople