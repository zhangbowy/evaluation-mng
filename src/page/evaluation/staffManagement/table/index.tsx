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
  setIsReload: (isReload: boolean) => void
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
      ellipsis: true
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
  const [curPage, setCurPage] = useState<number>(1); //save current page
  const [pageSize, setPageSize] = useState<number>(10); //save current page size

  useEffect(() => {
    setCurPage(1)
    queryList()
  },[searchForm]);

  useEffect(() => {
    queryList()
  },[curPage, pageSize]);

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
      curPage: curPage,
      pageSize: pageSize
    });
    if(code === 1) {
      let arr = data.resultList;
      arr.forEach((el:DataType, index:number) => {
        el.index = (curPage - 1)*pageSize + index + 1;
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
    if(curPage === 1) {
      setIsReload(true)
    } else {
      setCurPage(1);
    }
  }

  /**
   * handle change position
   * @param item 
   */
  const handlePosition = (item: DataType) => {
    setModalVisible(true)
    setItem(item);
  };

  /**
   * handle change page
   * @param page 
   * @param pageSize 
   */
  const handlePaging = (page:number,pageSize:number) => {
    setCurPage(page);
    setPageSize(pageSize)
  };

  return (
    <Fragment>
      <Table columns={columns} dataSource={tableList} loading={tableLoading} rowKey={record => record.userId} pagination={{ showQuickJumper: true, pageSize: pageSize, total: totalItem, current: curPage, showTotal: () => `共 ${totalItem} 条数据`, pageSizeOptions: ["10", "20", "50", "100"], onChange: handlePaging }} />
      <ModalEdit visible={modalVisible} item={item as DataType} setModalVisible={setModalVisible} reloadList={reloadList} />
    </Fragment>
  )
};
// scroll={{ y: height - 140 }}
export default Tables;