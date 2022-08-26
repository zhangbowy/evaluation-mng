import { Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { FC, useEffect, Fragment, useState } from 'react';
import { formType } from '../form/type';
import { USER_LIST } from '@/api/api';
import ModalEdit from './modal';

interface DataType {
  userId: string;
  name: string;
  positionId: number | null;
  positionName: string | null;
  isDimission: number;
  isDimissionStr: string;
  hiredDate: number;
  hiredDateStr: string | null;
  deptNames: string;
  deptIds: string;
  index?: number;
};

interface Props {
  height: number,
  searchForm: formType,
  isReload: boolean,
  setIsReload: any
}

const Tables: FC<Props> = ({ height, searchForm, isReload, setIsReload }: Props) => {
  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      dataIndex: 'index',
      render: text => <p>{text}</p>,
      width: 75,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true
    },
    {
      title: '职位',
      dataIndex: 'positionName',
      ellipsis: true,
      render: text => <p>{text ? text : '待补充'}</p>
    },
    {
      title: '招聘部门',
      dataIndex: 'deptNames',
      ellipsis: true
    },
    {
      title: '在职情况',
      dataIndex: 'isDimission',
      width: 100,
      render: text => <p>{text == 0 ? '离职' : '在职'}</p>
    },
    {
      title: '入职时间',
      dataIndex: 'hiredDateStr',
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
  const [item, setItem] = useState<DataType>(); //save click user data
  const [tableList, setTableList] = useState<DataType[]>([]); //save user list
  const [totalItem, setTotalItem] = useState<number>(0); //save total item
  const [tableLoading, setTableLoading] = useState<boolean>(false); //control table loading

  useEffect(() => {
    queryList()
  },[searchForm]);

  useEffect(() => {
    if(isReload) {
      queryList();
      setIsReload(false);
    }
  },[isReload])

  /**
   * query table list
   */
  const queryList = async () => {
    setTableLoading(true);
    const {code, data} = await USER_LIST({
      ...searchForm,
      curPage:1,
      pageSize: 10
    });
    if(code === 1) {
      let arr = data.resultList;
      arr.forEach((el:DataType, index:number) => {
        el.index = index + 1;
      });
      setTotalItem(data.totalItem)
      setTableList(arr);
      setTableLoading(false);
    }
  };

  /**
   * reload list
   */
  const reloadList = () => {
    queryList();
  }

  const handlePosition = (item: DataType) => {
    setModalVisible(true)
    setItem(item);
  }

  return (
    <Fragment>
      <Table columns={columns} dataSource={tableList} loading={tableLoading} rowKey={record => record.userId} scroll={{ y: height - 120 }} pagination={{ showQuickJumper: true, showSizeChanger: false, total: totalItem }} />
      <ModalEdit visible={modalVisible} item={item as DataType} setModalVisible={setModalVisible} reloadList={reloadList} />
    </Fragment>
  )
};

export default Tables;