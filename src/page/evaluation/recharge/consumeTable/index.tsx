import { Radio, RadioChangeEvent, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React, { useState } from 'react'
import styles from './index.module.less'

const ConsumeTable = () => {
    const [radioValue, setRadioValue] = useState<number>(1)
    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const [ConsumeTableList, setConsumeTableList] = useState()
    const options = [
        { label: '测评消耗', value: 1 },
        { label: '量表解锁', value: 2 },
    ];
    // radio的change
    const radioChange = ({ target: { value } }: RadioChangeEvent) => {
        setRadioValue(value)
    }
    // 获取表格数据
    const getConsumeTableList = () => {

    }
    const consumeColumns: ColumnsType<DataType> = [
        {
            title: '测评名称',
            dataIndex: 'createName',
        },
        {
            title: '消耗数量(点券)',
            dataIndex: 'consumeNumber',
        },
        {
            title: '测评人',
            dataIndex: 'finishNumber',
        },
        {
            title: '扣除时间',
            dataIndex: 'excludingTime',
        },
        {
            title: '测评创建人',
            dataIndex: 'testCreator',
        }
    ]
    const unlockColumns: ColumnsType<DataType> = [
        {
            title: '量表名称',
            dataIndex: 'createName',
        },
        {
            title: '消耗数量(点券)',
            dataIndex: 'consumeNumber',
        },
        {
            title: '操作时间',
            dataIndex: 'finishNumber',
        },
        {
            title: '操作人',
            dataIndex: 'testCreator',
        }
    ]
    return (
        <div className={styles.consumeTable_layout}>
            <Radio.Group className={styles.consumeTable_radio} options={options} onChange={radioChange} value={radioValue} optionType="button" />
            <Table loading={tableLoading} rowKey={(row) => row.id} columns={radioValue == 1 ? consumeColumns : unlockColumns} scroll={{ y: 450 }} pagination={{ showQuickJumper: true, defaultPageSize: 10 }} dataSource={ConsumeTableList}></Table>
        </div>
    )
}

export default ConsumeTable