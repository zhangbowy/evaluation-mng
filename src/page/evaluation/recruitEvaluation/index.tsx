import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames/bind';
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Select,
  Switch,
  Table,
  Modal,
  Pagination
} from 'antd';
import {
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  CopyOutlined,
  LockOutlined
} from '@ant-design/icons';
import styles from './index.module.less';
import { ColumnsType } from 'antd/lib/table'
import { IColumns, RecruitStatus, rectuitMap, paramsType, ISelectPdfStatusBack, SelectPdfStatus } from './type';
import ModalLink from './components/modalLink';
import LookResult from '@/components/lookResult';
import PdfDetailMBTI from '@/components/report/MBTI';
import { queryRecruitmentExamList, updateRecruitment, recruitmentUnlockItem, getExamResult, getUserExamResult, getPDFDownLoad, getIsHasPdf, getSelectPdfStatus } from '@/api/api';
import { abilityList, TagSort } from '@/components/report/MBTI/type';
import { useCallbackState } from '@/utils/hook';
import { majorType, recruitStatusList } from '@/assets/data';
import { copy, downLoad, formatTime, getAllUrlParam } from '@/utils/utils';
import dd from 'dingtalk-jsapi';
import { downloadFile } from '@/components/dd';



const { confirm } = Modal;
const cx = classNames.bind(styles);
const RecruitEvaluation = () => {
  const [form] = Form.useForm();
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [totalNum, setTotalNum] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1)
  const [tableSize, setTableSize] = useState<number>(10);
  const [candidateList, setCandidateList] = useState<IColumns[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [modalLink, setModalLink] = useState<string>('');
  const [unlockLoading, setUnlockLoading] = useState<boolean[]>([]);
  const [unlockFail, setUnlockFail] = useState<boolean[]>([]);
  const [downLoading, setDownLoading] = useState<string[]>([]); // 下载的loading
  const [resultDetial, setResultDetial] = useCallbackState({});
  const history = useNavigate();
  const lookResultRef: any = useRef();
  const tableRef: any = useRef();
  // const pdfDetail: any = useRef();
  const tasksPdf: any = useRef([]); //下载储存的人任务
  const { appId } = getAllUrlParam();
  let timer: any;
  useEffect(() => {
    return () => {
      clearInterval(timer)
    }
  }, [])
  // 获取列表
  const getListData = (pageNo: number, pageSize?: number) => {
    const values = form.getFieldsValue();
    const formData: paramsType = {
      pageSize: pageSize || 10,
      curPage: pageNo,
      examStatus: values.examStatus
    }
    if (values.candidateName) {
      formData.candidateName = values.candidateName;
    }
    if (values.job) {
      formData.job = values.job;
    }
    setTableLoading(true);
    queryRecruitmentExamList(formData).then((res: IBack) => {
      const { code, data } = res;
      setTableLoading(false);
      if (code === 1) {
        // const data1 = data.resultList.map((v: any) => ({
        //   ...v,
        //   examStatus: 10
        // }))
        setCandidateList(data.resultList);
        setTotalNum(data.totalItem);
      } else {
        setCandidateList([]);
        setTotalNum(0);
      }
    }).catch(() => {
      setTableLoading(false);
    })
  }
  // 重置
  const onResetClick = () => {
    form.resetFields();
    getListData(1);
  };
  // 搜索
  const onSearchClick = () => {
    getListData(1);
  };
  //发起测评
  const onAddEvaluationClick = () => {
    history('/evaluation/recruitEvaluation/launchEvaluation');
  };
  //复制
  const copyText = (text: string) => {
    if (copy(text)) {
      message.success('复制成功!');
    } else {
      message.success('复制失败，请重新复制');
    }
  };
  // 查看报告
  const showReport = (record: IColumns) => {
    if (majorType.includes(record.templateType)) {
      history(`/evaluation/recruitEvaluation/report/${record.id}/lookReport/${record.examPaperId}~${record.userId}~${record.templateType}`);
      return;
    }
    lookResultRef.current.onOpenDrawer({ examPaperId: record.examPaperId, userId: record.userId })
  }
  const onCloseLoading = (examPaperId: string) => {
    const curIndex = downLoading.findIndex(res => examPaperId == res)
    setDownLoading([...downLoading.splice(curIndex, 1)])
  }
  // 轮询
  const polling = async () => {
    const item = await getSelectPdfStatus(tasksPdf.current.map((res: SelectPdfStatus) => res.taskId))
    const obj = (new Function("return " + item))();
    if (obj.code == 1) {
      tasksPdf.current.forEach((taskObj: SelectPdfStatus) => {
        if (obj.data[taskObj.taskId][0].oss_url) {
          downloadFile(obj.data[taskObj.taskId][0].oss_url, taskObj.fileName)
          onCloseLoading(taskObj.examPaperId)
          const curIndex = tasksPdf.current.findIndex((res: SelectPdfStatus) => taskObj.taskId == res.taskId)
          tasksPdf.current.splice(curIndex, 1)
        }
      })
      if (!timer && tasksPdf.current.length > 0) {
        timer = setInterval(() => {
          polling()
        }, 5000)
      }
      if (tasksPdf.current.length < 1) {
        clearInterval(timer)
      }
    }
  }
  // 下载MBTI专业版    
  const onDownLoad = async (record: IColumns) => {
    setDownLoading([...downLoading, record.examPaperId])
    const urlData = await getIsHasPdf({ examPaperId: record.examPaperId, templateType: 2 })
    if (urlData.code == 1) {
      const curExam = urlData.data.filter((co: ISelectPdfStatusBack) => (co.exam_paper_id + '') == record.examPaperId)
      if (curExam.length > 0) {
        if (curExam[0].oss_url && curExam[0].status == 1) {
          downloadFile(curExam[0].oss_url, `${record.templateTitle}.pdf`)
          onCloseLoading(record.examPaperId)
        } else {
          tasksPdf.current.push({
            examPaperId: record.examPaperId,
            taskId: curExam[0].task_id,
            fileName: `${record.templateTitle}-${record.name}.pdf`
          })
          polling()
        }
      } else {
        const obj = {
          // url: `http//daily-eval.sunmeta.top/#/pdf?examPaperId=${record.examPaperId}&userId=${record.userId}`,
          url: `${window.location.origin}/admin/#/pdf/${record.templateType}/${record.userId}/${record.examPaperId}?isRecruit=true&appId=${appId}`,
          examPaperId: record.examPaperId,
          userId: record.userId,
          templateType: 2
        }
        const res = await getPDFDownLoad(obj)
        if (res.code == 1) {
          tasksPdf.current.push({
            examPaperId: record.examPaperId,
            taskId: res.data,
            fileName: `${record.templateTitle}-${record.name}.pdf`
          })
          polling()
        } else {
          onCloseLoading(record.examPaperId)
        }
      }
    }
  }
  // 普通版下载
  const onOrdinaryDownLoad = async (record: IColumns) => {
    lookResultRef.current.onDownLoadReport({ templateTitle: record.templateTitle, examPaperId: record.examPaperId, userId: record.phone })
  }

  const columns: ColumnsType<IColumns> = [
    {
      title: '候选人',
      dataIndex: 'name',
      width: 150,
      fixed: 'left',
      render: (text: string) => <span className={styles.table_column_text}>{text}</span>
    },
    {
      title: '应聘岗位',
      dataIndex: 'job',
      width: 150,
      render: (text: string) => <span className={styles.table_column_text}>{text}</span>
    },
    {
      title: '量表名称',
      dataIndex: 'templateTitle',
      width: 200,
      render: (text: string) => <span className={styles.table_column_text}>{text || '-'}</span>
    },
    {
      title: '测评状态',
      dataIndex: 'examStatus',
      width: 150,
      render: (text: number) =>
        <span
          className={cx({
            'status_base': true,
            'table_column_text': true,
            'status_answer': text == 0,
            'status_start': (text == 1 || text == 2 || text == 3),
            'status_finish': text == 10 || text == 5
          })} >
          {(text == 5 ? '已完成' : (text == 1 || text == 2 || text == 3) ? '进行中' : rectuitMap[text]) || '-'}
        </span>
    },
    {
      title: '测评链接',
      dataIndex: 'shortLink',
      width: 250,
      render: (text: string) => <div className={styles.table_column_link}>
        <span className={styles.table_column_link_text}>{text}</span>
        <span
          className={styles.copyIcon}
          onClick={() => copyText(text)}
        >
          复制
        </span>
      </div>
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 150,
      render: text => <span className={styles.table_column_text}>{text ? text : '-'}</span>
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
      render: text => <span className={styles.table_column_text}>{text ? text : '-'}</span>
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      width: 200,
      render: text =>
        <span className={styles.table_column_text}>{text ? formatTime(text) : '-'}</span>
    },
    {
      title: '操作',
      key: 'options',
      width: 170,
      fixed: 'right',
      render: (record, text, index) => {
        const { examStatus } = record;
        if (examStatus == 10 || examStatus == 5) {
          // 解锁查看
          const onUnlockClick = async () => {
            unlockLoading[index] = true
            setUnlockLoading([...unlockLoading])
            const params = {
              userId: record.userId,
              templateType: record?.templateType,
              operationType: '1',
            }
            const res = await recruitmentUnlockItem(params)
            if (res.code == 1) {
              getListData(current);
              message.success('解锁成功！');
            } else {
              unlockFail[index] = true
              setUnlockFail([...unlockFail])
            }
          }
          const getText = (key: number) => {
            switch (key) {
              case 5:
                return <Button className={styles.columns_btn_lock} loading={unlockLoading[index] && !unlockFail[index]} icon={!unlockFail[index] && <LockOutlined />}
                  onClick={onUnlockClick} type="link">
                  {unlockFail[index] ? '点券不足，充值后解锁查看' : unlockLoading[index] ? `解锁中` : '解锁查看'}</Button>
              case 10:
                return <>
                  <Button className={styles.columns_btn_lock} type="link" onClick={() => showReport(record)}>查看报告</Button>
                  <Divider type="vertical" />
                  <Button
                    className={styles.columns_btn_lock}
                    type='link'
                    loading={downLoading.includes(record.examPaperId)}
                    onClick={majorType.includes(record.templateType) ? () => onDownLoad(record) : () => onOrdinaryDownLoad(record)}
                  >
                    下载
                  </Button>

                  {/* {
                    record.templateType !== 'MBTI' &&
                    record.templateType !== 'MBTI_O' &&
                    record.templateType !== 'DISC' &&
                    <>
                      <Divider type="vertical" />
                      <Button
                        className={styles.columns_btn_lock}
                        type='link'
                        loading={downLoading === record.examPaperId}
                        onClick={() => onOrdinaryDownLoad(record)}
                      >
                        下载
                      </Button>
                    </>
                  } */}
                </>
                {/* {
                    record.templateType === 'MBTI' && <>
                      <Divider type="vertical" />
                      <Button
                        className={styles.columns_btn_lock}
                        type='link'
                        loading={downLoading === record.examPaperId}
                        onClick={() => onDownLoad(record)}
                      >
                        下载
                      </Button>
                    </>
                  } */}
              default:
                break;
            }
          }
          return <>
            {
              getText(examStatus)
            }
          </>
        } else {
          const onOpenClick = (checked: boolean) => {
            if (!checked) {
              confirm({
                title: '确定关闭测评吗?',
                icon: <ExclamationCircleOutlined />,
                content: '关闭后，该人员将无法继续评测',
                onOk() {
                  updateRecruitment({
                    isOpen: checked ? 1 : 0,
                    rId: record.id
                  }).then((res: IBack) => {
                    const { code } = res;
                    if (code === 1) {
                      message.success('操作成功！');
                      getListData(current);
                    }
                  })
                },
              })
            } else {
              updateRecruitment({
                isOpen: checked ? 1 : 0,
                rId: record.id
              }).then((res: IBack) => {
                const { code } = res;
                if (code === 1) {
                  message.success('操作成功！');
                  getListData(current);
                }
              })
            }
          };
          return <Switch
            key="switch"
            checkedChildren="开"
            unCheckedChildren="关"
            onClick={(checked) => onOpenClick(checked)}
            checked={record.isOpen === 1}
          />
        }
      }
    }
  ];
  // 分页
  const changePagination = (page: number, pageSize: number) => {
    if (pageSize !== tableSize) {
      setCurrent(1);
      setTableSize(pageSize);
      getListData(1, pageSize);
      return;
    }
    setCurrent(page);
    setTableSize(pageSize);
    getListData(page, pageSize);
  }
  // 关闭弹窗
  const closeModal = () => {
    setVisible(false);
  }

  useEffect(() => {
    const RECRUIT_MODAL_FLAG = sessionStorage.getItem('RECRUIT_MODAL_FLAG');
    if (RECRUIT_MODAL_FLAG) {
      setVisible(true);
      setModalLink(RECRUIT_MODAL_FLAG);
      sessionStorage.removeItem('RECRUIT_MODAL_FLAG');
    }
    getListData(current, tableSize);
  }, []);

  return (
    <div className={styles.recruitEvaluation_layout}>
      <h1 className={styles.recruitEvaluation_content_title}>招聘测评</h1>
      <div className={styles.recruitEvaluation_content}>
        <nav>
          <Form form={form} className={styles.from_wrapper} labelAlign={'right'}>
            <Form.Item name="candidateName" label="候选人">
              <Input placeholder="请输入" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="job" label="应聘岗位" >
              <Input placeholder="请输入" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="examStatus" label="测评状态">
              <Select
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                placeholder="请选择"
                showSearch
                style={{ width: 200 }} >
                {
                  recruitStatusList.map((item: RecruitStatus) => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)
                }
              </Select>
            </Form.Item>
          </Form>
          <div className={styles.nav_right}>
            {/* <span className={styles.nav_right_more}>
            <span>更多筛选</span>
            <DownOutlined />
          </span> */}
            <Button onClick={onResetClick}>重置</Button>
            <Button
              type="primary"
              onClick={onSearchClick}
            >
              搜索
            </Button>
          </div >
        </nav >
        <Divider style={{ margin: '8px 0 24px' }} />
        <main>
          <section>
            <span>候选人表</span>
            <Button
              id="addPermissions"
              onClick={onAddEvaluationClick}
              type="primary"
              icon={<PlusCircleOutlined />}
            >
              发起测评
            </Button>
          </section>
        </main>
      </div >
      <div className={styles.recruitEvaluation_table_wrap}>
        <Table loading={tableLoading}
          pagination={false}
          columns={columns}
          rowKey={(res) => res.id}
          dataSource={candidateList}
          scroll={{ x: 1620 }}
          ref={tableRef}
          sticky={{ offsetHeader: 82 }}
        />
      </div>
      {
        candidateList.length > 0 && <footer>
          {/* <div className={styles.footer_line} /> */}
          <Pagination
            showQuickJumper={true}
            defaultCurrent={1}
            defaultPageSize={10}
            current={current}
            total={totalNum}
            showTotal={(total: number) => `共 ${total} 条数据`}
            onChange={changePagination}
            pageSizeOptions={[10, 20, 50, 100]}
            showSizeChanger
          />
        </footer>
      }
      < ModalLink
        visible={visible}
        copyText={copyText}
        modalLink={modalLink}
        closeModal={closeModal}
      />
      <LookResult ref={lookResultRef} isRecruit={true} />
      <PdfDetailMBTI
        // ref={pdfDetail}
        resultDetail={resultDetial}
        childStyle={{
          'width': '800px',
          'boxSizing': 'border-box',
          'position': 'fixed',
          'top': '0pt',
          'left': '-9999pt',
          'zIndex': '-9999'
        }}
      />
    </div >
  )
};

export default RecruitEvaluation;
