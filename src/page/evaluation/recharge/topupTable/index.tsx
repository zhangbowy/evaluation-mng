import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react'
import { getRechargeFlow } from '@/api/api'
import { useSearchParams } from 'react-router-dom';
import { IConsumeFlowParams, IConsumeTableParams } from '../type';
import { getAllUrlParam } from '@/utils/utils';

const TopUpTable = () => {
    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const [topUpTableList, setTopUpTableList] = useState()
    const [totalNum, setTotalNum] = useState<number>(0);
    const { corpId, appId } = getAllUrlParam()
    useEffect(() => {
        getTopUpTableList()
    }, [])
    // 分页配置
    const paginationObj = {
        showQuickJumper: true,
        defaultPageSize: 10,
        total: totalNum,
        onChange: (page: number) => {
            getTopUpTableList({ curPage: page })
        }
    }
    // 获取表格数据
    const getTopUpTableList = async (item?: IConsumeTableParams) => {
        setTableLoading(true)
        const params = {
            curPage: item?.curPage || 1,
            pageSize: 10,
            tpf: 1,
            appId,
            corpId
        }
        const res = await getRechargeFlow(params)
        if (res.code == 1) {
            setTopUpTableList(res.data.resultList)
            setTableLoading(false)
            setTotalNum(res.data.totalItem)
        }
    }
    const rechargeColumns: ColumnsType<DataType> = [
        {
            title: '订单编号',
            dataIndex: 'bizOrderId',
        },
        {
            title: '类型',
            dataIndex: 'consumeNumber',
            render: (text: string) => '钉钉充值'
        },
        {
            title: '充值金额（元）',
            dataIndex: 'amount',
            render: (text: number = 0) => text / 100
        },
        {
            title: '新增点券（点券）',
            dataIndex: 'pointAssetAmount',
        },
        {
            title: '交易时间',
            dataIndex: 'payDate',
        },
        // {
        //     title: '操作人',
        //     dataIndex: 'operator',
        //     render: (text: IConsumeFlowParams) => {
        //         return text?.name || '-'
        //     }
        // }
    ]
    return (
        <div>
            <Table loading={tableLoading} rowKey={(row) => row.id} columns={rechargeColumns} scroll={{ y: 450 }} pagination={paginationObj} dataSource={topUpTableList}></Table>
        </div>
    )
}

export default TopUpTable