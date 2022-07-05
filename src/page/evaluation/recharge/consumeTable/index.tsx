import { getConsumeFlow } from '@/api/api'
import { Radio, RadioChangeEvent, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from './index.module.less'
import { IConsumeFlowParams, IConsumeTableList } from '../type'

const ConsumeTable = () => {
    const options = [
        { label: '测评消耗', value: 'unlock_exam_template' },
        { label: '量表解锁', value: 'unlock_exam_result' },
    ];
    const [radioValue, setRadioValue] = useState<string>(options[0].value)
    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const [ConsumeTableList, setConsumeTableList] = useState<IConsumeTableList[]>()
    const [search] = useSearchParams()
    const appId = search.get('appId') || '0'
    const corpId = search.get('corpId') || '0'
    useEffect(() => {
        getConsumeTableList()
    }, [])
    // radio的change
    const radioChange = ({ target: { value } }: RadioChangeEvent) => {
        setRadioValue(value)
        setTableLoading(true)
        setConsumeTableList([])
        getConsumeTableList({ flowType: value })
    }
    // 获取表格数据
    const getConsumeTableList = async (item?: { flowType: string }) => {
        const params = {
            curPage: 1,
            pageSize: 10,
            tpf: 1,
            appId,
            corpId,
            bizType: 'eval',
            flowType: item?.flowType || 'unlock_exam_template'
        }
        const res = await getConsumeFlow(params)
        if (res.code == 1) {
            setConsumeTableList(res.data.resultList)
            setTableLoading(false)
            console.log('res.data', res.data)
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
            dataIndex: 'testCreator',
            render: (text: IConsumeFlowParams) => {
                return text?.name || '-'
            }
        }
    ]
    return (
        <div className={styles.consumeTable_layout}>
            <Radio.Group className={styles.consumeTable_radio} options={options} onChange={radioChange} value={radioValue} optionType="button" />
            <Table loading={tableLoading} rowKey={(row) => row.id} columns={radioValue == 'unlock_exam_template' ? consumeColumns : unlockColumns} scroll={{ y: 450 }} pagination={{ showQuickJumper: true, defaultPageSize: 10 }} dataSource={ConsumeTableList}></Table>
        </div>
    )
}

export default ConsumeTable