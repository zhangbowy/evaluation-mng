import { getExamResult, getExamUsers, measurementExport, UnLockReport } from '@/api/api';
import Loading from '@/components/loading';
import { doneCondition, tagsColor } from '@/config/management.config';
import { useCallbackState } from '@/utils/hook';
import { Button, Divider, Form, Input, Modal, Select, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import React, { Fragment, memo, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { characterProportions, IDepartment, IisDimission, IResultList, IResultTable, ISex, ITableParams } from '../../type';
import styles from './index.module.less'
import { EvalDetail } from '@/store';
import { toJS } from 'mobx';
import { LockOutlined } from '@ant-design/icons'
import LookAllTags from '../lookAllTags';

const PeopleStatistics = memo(() => {
    const [form] = Form.useForm();
    const params = useParams() as { id: string }
    const chartList = toJS(EvalDetail.getEvalDetailInfo())
    const measurement = EvalDetail.measurementObj
    const navigator = useNavigate()
    const deptId = EvalDetail.departmentId
    const [exportLoading, setExportLoading] = useState<boolean>(false) // 导出loading
    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const [tableList, setTableList] = useState<IResultTable>() // 表格数据
    const [downLoading, setDownLoading] = useState<number>(); // 下载的loading
    const [totalNum, setTotalNum] = useState<number>(0);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10) // 多少条
    const [unlockLoading, setUnlockLoading] = useState<boolean[]>([]);
    const [unlockFail, setUnlockFail] = useState<boolean[]>([]);
    const lookAllTagsRef: any = useRef()
    useEffect(() => {
        getTableList()
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
                    lookAllTagsRef?.current?.openModal(tags)
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
                    navigator(`/evaluation/management/detail/${params.id}/lookReport/${record.examPaperId}~${record.userId}~${measurement?.examTemplateType}`);
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

                const getText = (key: number) => {
                    const onDownLoad = () => {

                    }
                    switch (key) {
                        case 0:
                            return <Button type='text' disabled>未参加测评</Button>
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
                                        onClick={() => onDownLoad()}
                                        loading={downLoading === record.examPaperId}>下载</Button>
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
            getTableList({ curPage: page, pageSize, ...form.getFieldsValue(), deptId })
        }
    } // 获取表格数据
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
            let a = document.createElement('a')
            a.href = `${location.protocol}//${res.data.bucket}.${res.data.endpoint}/${res.data.path}`
            a.download = res.data.cname
            a.click()
            setExportLoading(false)
        }
    }
    if (tableLoading) {
        return <Loading />
    }
    return (
        <Fragment>
            <div className={styles.peopleStatistics}>
                <div className={styles.detail_main_filter}>
                    <div className={styles.detail_main_filter_left}>
                        <Form className={styles.from_wrapper} form={form}  >
                            <Form.Item label="姓名" labelCol={{ span: 6 }} name="name">
                                <Input placeholder="请输入姓名" style={{ width: 240 }} />
                            </Form.Item>
                            <Form.Item label="完成情况" name="status">
                                <Select getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择" style={{ width: 240 }}>{backFilterEle(doneCondition, 1)}</Select>
                            </Form.Item>
                            <Form.Item label="性格类型" name="tags">
                                <Select getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择" style={{ width: 240 }}>{backFilterEle(chartList?.characterProportions as characterProportions[])}</Select>
                            </Form.Item>
                            <Form.Item label="人格类型" name="resultType">
                                <Select getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择" style={{ width: 240 }}>{backFilterEle(chartList?.personalityProportions as characterProportions[])}</Select>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className={styles.detail_main_filter_right}>
                        <Button onClick={onResetClick}>重置</Button>
                        <Button type="primary" onClick={onSearchClick}>搜索</Button>
                    </div>
                </div>
                <div className={styles.detail_main_table}>
                    <Button type="primary" loading={exportLoading} onClick={onDeriveClick}>导出</Button>
                    <Table pagination={paginationObj} scroll={{ x: 1500, }} loading={tableLoading} rowKey={(row) => row.userId} columns={columns} dataSource={tableList?.resultList} />
                </div>
            </div>
            <LookAllTags ref={lookAllTagsRef} />
        </Fragment>
    )
})

export default PeopleStatistics