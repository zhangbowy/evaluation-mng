import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import React, { useState } from 'react'

const TopUpTable = () => {
    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const [topUpTableList, setTopUpTableList] = useState()
    // 获取表格数据
    const getTopUpTableList = () => {

    }
    const rechargeColumns: ColumnsType<DataType> = [
        {
            title: '订单编号',
            dataIndex: 'createName',
        },
        {
            title: '类型',
            dataIndex: 'consumeNumber',
        },
        {
            title: '充值金额（元）',
            dataIndex: 'finishNumber',
        },
        {
            title: '新增点券（点券）',
            dataIndex: 'excludingTime',
        },
        {
            title: '交易时间',
            dataIndex: 'testCreator',
        },
        {
            title: '操作人',
            dataIndex: 'testCreator',
        }
    ]
    return (
        <div>
            <Table loading={tableLoading} rowKey={(row) => row.id} columns={rechargeColumns} scroll={{ y: 450 }} pagination={{ showQuickJumper: true, defaultPageSize: 10 }} dataSource={topUpTableList}></Table>
        </div>
    )
}

export default TopUpTable