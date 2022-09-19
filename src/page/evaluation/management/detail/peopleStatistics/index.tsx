import { getExamResult, getExamUsers, getIsHasPdf, getPDFDownLoad, getSelectPdfStatus, measurementExport, UnLockReport, notification } from '@/api/api';
import Loading from '@/components/loading';
import { doneCondition, tagsColor } from '@/config/management.config';
import { useCallbackState } from '@/utils/hook';
import { Button, Divider, Form, Input, message, Modal, Select, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import React, { Fragment, memo, useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { characterProportions, IChartList, IDepartment, IisDimission, IResultList, IResultTable, ISex, ITableParams } from '../../type';
import styles from './index.module.less'
import { EvalDetail, SearchData } from '@/store';
import { LockOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import LookAllTags from '../lookAllTags';
import { downloadFile } from '@/components/dd';
import { IColumns, ISelectPdfStatusBack, SelectPdfStatus } from '@/page/evaluation/recruitEvaluation/type';
import { getAllUrlParam } from '@/utils/utils';

type IPeopleStatistics = { chartList: IChartList, type: string }
const PeopleStatistics = forwardRef(({ chartList, type }: IPeopleStatistics, ref) => {
    const [form] = Form.useForm();
    const params = useParams() as { id: string }
    const measurement = EvalDetail.measurementObj
    const deptId = EvalDetail.departmentId
    const navigator = useNavigate()
    const [exportLoading, setExportLoading] = useState<boolean>(false) // 导出loading
    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const [tableList, setTableList] = useState<IResultTable>() // 表格数据
    const [downLoading, setDownLoading] = useState<number[]>([]); // 下载的loading
    const [totalNum, setTotalNum] = useState<number>(0);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10) // 多少条
    const [unlockLoading, setUnlockLoading] = useState<boolean[]>([]);
    const [unlockFail, setUnlockFail] = useState<boolean[]>([]);
    const [isUrge, setIsUrge] = useState<boolean>(false);
    const [selectKeys, setSelectKeys] = useState<any[]>([]);
    const [selectInfo, setSelectInfo] = useState<IResultList[]>([]);
    const lookAllTagsRef: any = useRef()
    const tasksPdf: any = useRef([]); //下载储存的人任务
    const { appId } = getAllUrlParam();
    const { confirm } = Modal;
    let timer: any;
    useImperativeHandle(ref, () => ({
        getTableList
    }))
    useEffect(() => {
        getTableList(SearchData.searchObj)
        form.setFieldsValue(SearchData.searchObj)
        return () => {
            clearInterval(timer)
        }
    }, [])
    const columns: ColumnsType<IResultList> = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 70,
            fixed: 'left',
            render: (text, record, index) => `${index + 1}`
        },
        {
            title: '姓名',
            dataIndex: 'name',
            width: 80,
            fixed: 'left',
        },
        {
            title: '部门',
            width: 150,
            dataIndex: 'deptAggregationDTOS',
            render: (text: IDepartment[]) => {
                const nameArr = text.map(res => res.name)
                const department = nameArr.join(',')
                return <span>{department}</span>
            }
        },
        {
            title: '性别',
            width: 70,
            dataIndex: 'sex',
            render: (text: number) => ISex[text] || '-'
        },
        {
            title: '人格类型',
            dataIndex: 'resultType',
            width: 170,
            render: (text: string) => text || '-'
        },
        {
            title: '性格类型',
            dataIndex: 'tags',
            width: 230,
            render: (text: string[]) => {
                const tags: string[] = JSON.parse(JSON.stringify(text))
                const tagsArr = tags.length > 3 ? tags.splice(0, 3) : tags
                // 查看所有tags
                const onMagnifyClick = () => {
                    lookAllTagsRef?.current?.openModal(text)
                }
                return (
                    <div className={styles.table_list_tags}>
                        {tagsArr.length > 0 ? tagsArr?.map(res => (<span key={res}>{res}</span>)) : '-'}
                        {text.length > 3 && <div onClick={onMagnifyClick}>...</div>}
                    </div>
                )
            }
        },
        {
            title: '测评时间',
            width: 200,
            dataIndex: 'startTime',
            render: (text: string) => text || '-'
        },
        {
            title: '是否在职',
            width: 120,
            dataIndex: 'isDimission',
            render: (text: number) => IisDimission[text] || '-'
        },
        {
            title: '测评报告',
            dataIndex: 'status',
            fixed: 'right',
            width: 220,
            render: (text: number, record, index: number) => {
                // 查看报告
                const onLookResult = () => {
                    SearchData.setSearchObj({ ...SearchData.searchObj, ...form.getFieldsValue(), current, pageSize })
                    navigator(`/evaluation/management/detail/${params.id}/lookReport/${record.examPaperId}~${record.userId}~${type}`);
                }
                // 解锁查看
                const onUnlockClick = async () => {
                    unlockLoading[index] = true
                    setUnlockLoading([...unlockLoading])
                    const params = {
                        userId: record.userId,
                        templateType: measurement?.examTemplateType as string,
                        operationType: '1',
                        examId: record.examId
                    }
                    const res = await UnLockReport(params)
                    if (res.code == 1) {
                        getTableList()
                    } else {
                        unlockFail[index] = true
                        setUnlockFail([...unlockFail])
                    }
                }
                // 一键催办
                const onUrgeClick = (record: any) => {
                    notification({
                        examPaperIds: [record.examPaperId]
                    }).then(res => {
                        const { code } = res;
                        if (code === 1) {
                            message.success('操作成功');
                            // setSelectInfo([]);
                            // setSelectKeys([]);
                            // setIsUrge(false)
                        }
                    })
                }
                const getText = (key: number) => {
                    switch (key) {
                        case 0:
                            return <>
                                <Button type='text' disabled>未参加测评</Button>
                                <Divider type="vertical" />
                                <Button type='link' onClick={() => onUrgeClick(record)} className={styles.urgeBtn}>催办</Button>
                            </>
                        case 1 || 2 || 3:
                            return <Button type='text' disabled>测评中</Button>
                        case 5:
                            return <Button loading={unlockLoading[index] && !unlockFail[index]} icon={!unlockFail[index] && <LockOutlined />}
                                onClick={onUnlockClick} type="link">
                                {unlockFail[index] ? '点券不足，充值后解锁查看' : unlockLoading[index] ? `解锁中` : '解锁查看'}</Button>
                        case 10:
                            return (
                                <>
                                    <Button type="link" onClick={onLookResult}>查看报告</Button>
                                    <Divider type="vertical" />
                                    <Button
                                        type="link"
                                        onClick={() => onDownLoad(record)}
                                        loading={downLoading.includes(record.examPaperId)}>下载</Button>
                                </>
                            )
                        default:
                            break;
                    }
                }
                return (getText(text))
            }
        },
    ]
    const paginationObj = {
        showQuickJumper: true,
        defaultPageSize: 10,
        total: totalNum,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"],
        current: current,
        showTotal: () => `共 ${totalNum} 条数据`,
        onChange: (page: number, pageSize: number) => {
            const obj = { curPage: page, pageSize, ...form.getFieldsValue(), deptId }
            obj.deptId == -1 && delete obj.deptId
            getTableList(obj)
        }
    }
    // 获取表格数据
    const getTableList = async (item?: ITableParams) => {
        const obj = {
            examid: params.id,
            curPage: item?.curPage || 1,
            pageSize: item?.pageSize || pageSize,
            ...item,
            status: item?.status?.split(',').map(Number)
        }
        !item?.status && delete obj.status
        const res: IBackResult = await getExamUsers(obj)
        if (res.code === 1) {
            setTableList(res.data)
            setTableLoading(false)
            setPageSize(res.data.pageSize)
            setTotalNum(res.data.totalItem)
            setCurrent(res.data.curPage)
        }
    }
    // 下拉筛选
    const backFilterEle = (arr: characterProportions[] = [], type?: number) => {
        return arr.map((res: characterProportions) => <Select.Option key={res.name} value={type ? res.value : res.name}>{res.name}</Select.Option>)
    }
    // 搜索
    const onSearchClick = () => {
        getTableList(form.getFieldsValue())
    }
    // 重置
    const onResetClick = () => {
        form.resetFields()
        getTableList()
    }
    // 导出
    const onDeriveClick = async () => {
        setExportLoading(true)
        const res = await measurementExport(params.id)
        if (res.code == 1) {
            const a = document.createElement('a')
            a.href = `${location.protocol}//${res.data.bucket}.${res.data.endpoint}/${res.data.path}`
            a.download = res.data.cname
            a.click()
            setExportLoading(false)
        }
    }
    // 关闭loading
    const onCloseLoading = (examPaperId: string | number) => {
        const curIndex = downLoading.findIndex(res => examPaperId == res)
        setDownLoading([...downLoading.splice(curIndex, 1)])
    }
    // 轮询
    const polling = async () => {
        const item = await getSelectPdfStatus(tasksPdf.current.map((res: SelectPdfStatus) => res.taskId))
        const obj = (new Function("return " + item))();
        if (obj.code == 1) {
            tasksPdf.current.forEach((taskObj: SelectPdfStatus) => {
                if (obj.data[taskObj.taskId][0].oss_url) {
                    downloadFile(obj.data[taskObj.taskId][0].oss_url, taskObj.fileName)
                    onCloseLoading(taskObj.examPaperId)
                    const curIndex = tasksPdf.current.findIndex((res: SelectPdfStatus) => taskObj.taskId == res.taskId)
                    tasksPdf.current.splice(curIndex, 1)

                }
            })
            if (!timer && tasksPdf.current.length > 0) {
                timer = setInterval(() => {
                    polling()
                }, 5000)
            }
            if (tasksPdf.current.length < 1) {
                clearInterval(timer)
            }
        }
    }
    // 下载MBTI专业版    
    const onDownLoad = async (record: IResultList) => {

        setDownLoading([...downLoading, record.examPaperId])
        const urlData = await getIsHasPdf({ examPaperId: record.examPaperId, templateType: 2 })
        if (urlData.code == 1) {
            const curExam = urlData.data.filter((co: ISelectPdfStatusBack) => co.exam_paper_id == record.examPaperId)
            if (curExam.length > 0) {
                if (curExam[0].oss_url && curExam[0].status == 1) {
                    downloadFile(curExam[0].oss_url, `${record.examTemplateTitle}.pdf`)
                    onCloseLoading(record.examPaperId)
                } else {
                    tasksPdf.current.push({
                        examPaperId: record.examPaperId,
                        taskId: curExam[0].task_id,
                        fileName: `${record.examTemplateTitle}.pdf`
                    })
                    polling()
                }
            } else {
                const obj = {
                    // url: `http//daily-eval.sunmeta.top/#/pdf?examPaperId=${record.examPaperId}&userId=${record.userId}`,
                    url: `${window.location.origin}/admin/#/pdf/${type.toUpperCase()}/${record.userId}/${record.examPaperId}?isPeople=true&appId=${appId}`,
                    examPaperId: record.examPaperId,
                    userId: record.userId,
                    templateType: 2
                }
                const res = await getPDFDownLoad(obj)
                if (res.code == 1) {
                    tasksPdf.current.push({
                        examPaperId: record.examPaperId,
                        taskId: res.data,
                        fileName: `${record.examTemplateTitle}.pdf`
                    })
                    polling()
                } else {
                    onCloseLoading(record.examPaperId)
                }
            }
        }
    }
    // 开始批量选择
    const startBatch = () => {
        const infoList: any = tableList?.resultList.filter(v => v.status === 0);
        const keyList = infoList.map((item: any) => item.userId)
        setSelectKeys(keyList)
        setSelectInfo(infoList);
        setIsUrge(true);
    };
    // 关闭批量催办
    const closeBatch = () => {
        setSelectKeys([]);
        setIsUrge(false);
    };
    // 处理表格勾选的数据
    const tableCheckData = (selectData: any) => {
        let copyData = selectKeys;
        let copyInfoData = selectInfo;
        let finallyData = [];
        let finallyInfoData = []
        const selectList: IResultList[] = tableList?.resultList.filter(item => item.status === 0).filter(v => selectData.indexOf(v.userId) > -1) || [];
        const selectListKeys = selectList?.map(v => v.userId);
        const unSelectList = tableList?.resultList.filter(item => item.status === 0).filter(v => selectData.indexOf(v.userId) === -1)
        const unSelectListKeys = unSelectList?.map(v => v.userId);
        copyData = copyData.concat(selectListKeys);
        copyInfoData = copyInfoData.concat(selectList);
        for (let i = 0; i < copyData.length ; i++) {
            if (unSelectListKeys?.indexOf(copyData[i]) === -1) {
                finallyData.push(copyData[i]);
                finallyInfoData.push(copyInfoData[i])
            } 
        }
        finallyData = [...new Set(finallyData)];
        finallyInfoData = [...new Set(finallyInfoData)];
        setSelectKeys(finallyData);
        setSelectInfo(finallyInfoData);
    }
    const urgeNames = useMemo(() => {
        let str = '';
        if (selectInfo.length > 6) {
            selectInfo.map((v, index) => {
                if (index < 6) {
                    str += v.name + '、'
                }
            })
            str = `${str.substring(0, str.length - 1)}...等${selectInfo.length}人`;
        } else {
            selectInfo.map((v, index) => {
                str += v.name + '、'
            })
            str = `${str.substring(0, str.length - 1)}`;
        }
        return str;
    }, [selectInfo]);
    // 确认催办
    const confirmUrge = () => {
        confirm({
            title: '批量催办',
            icon: <ExclamationCircleOutlined />,
            content: `将为您向${urgeNames}发送测评催办`,
            onOk() {
                const paperIds = selectInfo.map(v => v.examPaperId)
                notification({
                    examPaperIds: paperIds
                }).then(res => {
                    const { code } = res;
                    if (code === 1) {
                        message.success('操作成功');
                        setSelectInfo([]);
                        setSelectKeys([]);
                        setIsUrge(false)
                    }
                })
            },
          })
    };
    if (tableLoading) {
        return <Loading />
    }
    return (
        <Fragment>
            <div className={styles.peopleStatistics}>
                <div className={styles.detail_main_filter}>
                    <div className={styles.detail_main_filter_left}>
                        <Form className={styles.from_wrapper} form={form}  >
                            <Form.Item label="姓名" name="name">
                                <Input placeholder="请输入姓名" style={{ width: 200 }} />
                            </Form.Item>
                            <Form.Item label="完成情况" name="status">
                                <Select getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择" style={{ width: 200 }}>{backFilterEle(doneCondition, 1)}</Select>
                            </Form.Item>
                            <Form.Item label="性格类型" name="tags">
                                <Select getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择" style={{ width: 200 }}>{backFilterEle(chartList?.characterProportions as characterProportions[])}</Select>
                            </Form.Item>
                            <Form.Item label="人格类型" name="resultType">
                                <Select getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择" style={{ width: 200 }}>{backFilterEle(chartList?.personalityProportions as characterProportions[])}</Select>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className={styles.detail_main_filter_right}>
                        <Button onClick={onResetClick}>重置</Button>
                        <Button type="primary" onClick={onSearchClick}>搜索</Button>
                    </div>
                </div>
                <Divider style={{ margin: '8px 0 24px' }} />
                <div className={styles.detail_main_table}>
                    <div className={styles.detail_main_title}>
                        <span>测评列表</span>
                        <div>
                            {
                                isUrge ? <>
                                    <Button onClick={closeBatch}>取消</Button>
                                    <Button onClick={confirmUrge} type="primary">确定催办({selectKeys.length})</Button>
                                </>
                                    :<>
                                        <Button type="primary" ghost onClick={startBatch}>批量催办</Button>
                                        <Button type="primary" loading={exportLoading} onClick={onDeriveClick}>导出</Button>
                                    </>
                            }
                            
                        </div>
                    </div>
                    <Table
                        pagination={paginationObj}
                        scroll={{ x: 1500, }}
                        loading={tableLoading}
                        rowKey={(row) => row.userId}
                        columns={columns}
                        dataSource={tableList?.resultList}
                        rowSelection={{
                            type: 'checkbox',
                            selectedRowKeys: selectKeys,
                            onChange: (selectedRowKeys, selectedRow, info) => {
                                tableCheckData(selectedRowKeys);
                                // setSelectKeys(selectedRowKeys);
                            },
                            getCheckboxProps: (record: any) => ({
                                disabled: record.status === 10,
                            })
                        }}
                        sticky={{ offsetHeader: 81 }}
                    />
                </div>
            </div>
            <LookAllTags ref={lookAllTagsRef} />
        </Fragment>
    )
})
PeopleStatistics.displayName = 'PeopleStatistics'
export default PeopleStatistics