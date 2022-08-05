import { getConsumeFlow } from '@/api/api'
import { Radio, RadioChangeEvent, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from './index.module.less'
import { IConsumeFlowParams, IConsumeTableList, IConsumeTableParams } from '../type'
import { getAllUrlParam } from '@/utils/utils'

const ConsumeTable = () => {
    const options = [
        { label: '测评消耗', value: 'unlock_exam_result' },
        { label: '量表解锁', value: 'unlock_exam_template' },
    ];
    const [radioValue, setRadioValue] = useState<string>(options[0].value)
    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const [ConsumeTableList, setConsumeTableList] = useState<IConsumeTableList[]>()
    const [totalNum, setTotalNum] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10) // 多少条
    const { corpId, appId } = getAllUrlParam()
    useEffect(() => {
        getConsumeTableList()
    }, [])
    // 分页配置
    const paginationObj = {
        showQuickJumper: true,
        defaultPageSize: 10,
        total: totalNum,
        showTotal: () => `共 ${totalNum} 条数据`,
        onChange: (page: number, pageSize: number) => {
            getConsumeTableList({ curPage: page, pageSize, flowType: radioValue })
        }
    }
    // radio的change
    const radioChange = ({ target: { value } }: RadioChangeEvent) => {
        setRadioValue(value)
        setTableLoading(true)
        setConsumeTableList([])
        getConsumeTableList({ flowType: value })
    }
    // 获取表格数据
    const getConsumeTableList = async (item?: IConsumeTableParams) => {
        setTableLoading(true)
        const params = {
            curPage: item?.curPage || 1,
            pageSize: item?.pageSize || pageSize,
            tpf: 1,
            appId,
            corpId,
            bizType: 'eval',
            flowType: item?.flowType || 'unlock_exam_result'
        }
        const res = await getConsumeFlow(params)
        if (res.code == 1) {
            setConsumeTableList(res.data.resultList)
            setTableLoading(false)
            setTotalNum(res.data.totalItem)
            setPageSize(res.data.pageSize)
        }
    }
    const consumeColumns: ColumnsType<IConsumeTableList> = [
        {
            title: '测评名称',
            dataIndex: 'name',
        },
        {
            title: '消耗数量(点券)',
            dataIndex: 'amount',
        },
        {
            title: '测评人',
            dataIndex: 'buyer',
            render: (text: IConsumeFlowParams) => {
                return text?.name || '-'
            }
        },
        {
            title: '扣除时间',
            dataIndex: 'operateDate',
            render: (text: string) => {
                return text || '-'
            }
        },
        {
            title: '测评创建人',
            dataIndex: 'operator',
            render: (text: IConsumeFlowParams) => {
                return text?.name || '-'
            }
        }
    ]
    const unlockColumns: ColumnsType<IConsumeTableList> = [
        {
            title: '量表名称',
            dataIndex: 'name',
        },
        {
            title: '消耗数量(点券)',
            dataIndex: 'amount',
        },
        {
            title: '操作时间',
            dataIndex: 'operateDate',
            render: (text: string) => {
                return text || '-'
            }
        },
        {
            title: '操作人',
            dataIndex: 'buyer',
            render: (text: IConsumeFlowParams) => {
                return text?.name || '-'
            }
        }
    ]
    return (
        <div className={styles.consumeTable_layout}>
            <Radio.Group className={styles.consumeTable_radio} options={options} onChange={radioChange} value={radioValue} optionType="button" />
            <Table pagination={paginationObj} loading={tableLoading} rowKey={(row) => row.id} columns={radioValue == 'unlock_exam_result' ? consumeColumns : unlockColumns} scroll={{ y: 450 }} dataSource={ConsumeTableList}></Table>
        </div>
    )
}

export default ConsumeTable