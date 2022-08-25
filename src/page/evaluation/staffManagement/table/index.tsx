import { Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { FC, useEffect, Fragment, useState } from 'react';
import ModalEdit from './modal';

interface DataType {
  userId: string;
  name: string;
  positionId: number | null;
  isDimission: number;
  hireDate: number;
  deptNames: string;
  deptIds: string;
  index: number;
};

interface Props {
  height: number
}

const data: DataType[] = [
  {
    deptIds: '1',
    deptNames: 'qzz',
    hireDate: 0,
    isDimission: 0,
    name: '马文卿',
    positionId: null,
    userId: '1231561521568',
    index: 0
  },
  {
    deptIds: '1',
    deptNames: 'qzz',
    hireDate: 0,
    isDimission: 0,
    name: '刘恒',
    positionId: null,
    userId: '2964165448',
    index: 1
  },
  {
    deptIds: '1',
    deptNames: 'qzz',
    hireDate: 0,
    isDimission: 0,
    name: '吴金锁',
    positionId: null,
    userId: '484965148516',
    index: 2
  },
  {
    deptIds: '1',
    deptNames: 'qzz',
    hireDate: 0,
    isDimission: 0,
    name: '吴金锁',
    positionId: null,
    userId: '15165151',
    index: 3
  },
  {
    deptIds: '1',
    deptNames: 'qzz',
    hireDate: 0,
    isDimission: 0,
    name: '吴金锁',
    positionId: null,
    userId: '484564151',
    index: 4
  },
  {
    deptIds: '1',
    deptNames: 'qzz',
    hireDate: 0,
    isDimission: 0,
    name: '吴金锁',
    positionId: null,
    userId: '24534535445',
    index: 5
  },
  {
    deptIds: '1',
    deptNames: 'qzz',
    hireDate: 0,
    isDimission: 0,
    name: '吴金锁',
    positionId: null,
    userId: '2574354738547',
    index: 6
  },
  {
    deptIds: '1',
    deptNames: 'qzz',
    hireDate: 0,
    isDimission: 0,
    name: '吴金锁',
    positionId: null,
    userId: '484375834151',
    index: 7
  },
];

const Tables: FC<Props> = ({ height }: Props) => {
  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      dataIndex: 'index',
      render: text => <p>{text}</p>,
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '职位',
      dataIndex: 'positionId',
      render: text => <p>{text ? text : '待补充'}</p>
    },
    {
      title: '招聘部门',
      dataIndex: 'deptNames',
    },
    {
      title: '在职情况',
      dataIndex: 'isDimission',
      render: text => <p>{text == 0 ? '不在职' : '在职'}</p>
    },
    {
      title: '入职时间',
      dataIndex: 'hireDate',
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handlePosition(record)}>编辑职位</a>
        </Space>
      ),
    },
  ];
  const [modalVisible, setModalVisible] = useState<boolean>(false); //save modal status
  const [item, setItem] = useState<DataType>()

  const handlePosition = (item:DataType) => {
    setModalVisible(true)
    setItem(item);
  }

  return (
    <Fragment>
      <Table columns={columns} dataSource={data} rowKey={record => record.userId} scroll={{ y: height - 120 }} pagination={{ showQuickJumper: true, showSizeChanger: false, total: 100 }} />
      <ModalEdit visible={modalVisible} item={item as DataType} setModalVisible={setModalVisible} />
    </Fragment>
  )
};

export default Tables;