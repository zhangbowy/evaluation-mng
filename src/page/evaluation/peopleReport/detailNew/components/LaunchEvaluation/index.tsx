import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Table, Tooltip, Tag, Button, Radio } from 'antd';
import styles from './index.module.less';
import { ColumnsType } from 'antd/lib/table';
import { getExamList } from '@/api/api';
import { propsType } from './type';

const LaunchEvaluation = ({ reportDetail, visible, closeEvaluation, addEvaluation, examType }: propsType) => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [evaluationList, setEvaluationList] = useState<DataType[]>([]);
  const [selectId, setSelectId] = useState<number>();
  const history = useNavigate();
  const changeSelect = (record: DataType) => {
    setSelectId(record.id);
  }
  const addNewEvalution = () => {
    history('/evaluation/library');
  };
  const columns: ColumnsType<DataType> = [
    {
      dataIndex: 'createName',
      fixed: 'left',
      width: 340,
      render: (text: string, record: DataType) => {
        return (
          <div className={styles.create_userInfo}>
            <Radio className={styles.create_userInfo_radio} checked={selectId === record.id} onChange={() => changeSelect(record)} />
            <img src={record.logoImage} alt="" />
            <div className={styles.create_right}>
              <div className={styles.create_title}>
                <Tooltip placement="top" title={record.evaluationName}>
                  <p>{record.evaluationName}</p>
                </Tooltip>
                {
                  record.examTemplateType == 'MBTI' && <span className={styles.create_tag}>专</span>
                }
                {
                  record.fromSourceType == 1 && <Tag className={styles.create_tag2} color="processing">酷应用</Tag>
                }
              </div>
              <span>创建人:{record.createName || '暂无'}    {record.created}</span>
            </div>
          </div>
        )
      }
    },
    {
      dataIndex: 'totalNumber',
      width: 130,
      render: (text: string) => {
        return (
          <div className={styles.create_right}>
            <p>{text}</p>
            <span>覆盖人数(人)</span>
          </div>
        )
      }
    },
    {
      dataIndex: 'finishNumber',
      width: 130,
      render: (text: string) => {
        return (
          <div className={styles.create_right}>
            <p>{text}</p>
            <span>完成人数(人)</span>
          </div>
        )
      }
    },
  ];
  // 获取列表记录
  const getEvaluationList = () => {
    setTableLoading(true);
    getExamList({
      curPage: 1,
      pageSize: 1000,
      templateType: examType,
      isOpen: 1
    }).then(res => {
      setTableLoading(false);
      if (res.code === 1) {
        setEvaluationList(res.data.resultList);
      }
    })
  }
  // 确定按钮点击事件
  const addEvalution = () => {
    addEvaluation && addEvaluation(selectId);
  };
  useEffect(() => {
    if (visible) {
      getEvaluationList();
    } else {
      setEvaluationList([]);
      setSelectId(undefined);
    }
  }, [visible]);
  return (
    <Modal
      visible={visible}
      title='发起测评'
      footer={null}
      width={680}
      onCancel={closeEvaluation}
    >
      <div className={styles.launch_evaluation}>
        <div>从已发起的盘点测评列表添加</div>
        <div className={styles.launch_evaluation_table}>
          <Table
            loading={tableLoading} 
            rowKey={(row) => row.id}
            showHeader={false}
            columns={columns}
            dataSource={evaluationList}
            pagination={false}
          >
          </Table>
        </div>
        <div className={styles.launch_evaluation_footer}>
          <div onClick={addNewEvalution} className={styles.launch_evaluation_footer_text}>
            <span>未找到合适的，点我新建</span>
          </div>
          <div className={styles.launch_evaluation_footer_btns}>
            <Button onClick={() => closeEvaluation()} className={styles.launch_evaluation_footer_btn_close}>取消</Button>
            <Button onClick={addEvalution} type='primary' disabled={selectId ? false : true}>确定</Button>
          </div>
        </div>
      </div>
      
    </Modal>
  );
}

export default LaunchEvaluation;
