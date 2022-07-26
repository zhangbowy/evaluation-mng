import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames/bind';
import copy from 'copy-to-clipboard';
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
import { IColumns, RecruitStatus, rectuitMap, paramsType } from './type';
import ModalLink from './components/modalLink';
import LookResult from '@/components/lookResult';
import PdfDetailMBTI from '@/components/report/MBTI';
import { queryRecruitmentExamList, updateRecruitment, recruitmentUnlockItem, getExamResult, getUserExamResult } from '@/api/api';
import moment from 'moment';
import { debounce } from '@/utils/utils';
import { abilityList, TagSort } from '@/components/report/MBTI/type';
import { sortBy } from '@antv/util';
import { useCallbackState } from '@/utils/hook';


const recruitStatusList:RecruitStatus[] = [
  {
    label: '待答题',
    value: 0
  },
  {
    label: '进行中',
    value: 1
  },
  {
    label: '已完成',
    value: 10
  }
];
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
  const [downLoading, setDownLoading] = useState<number>(); // 下载的loading
  const [resultDetial, setResultDetial] = useCallbackState({});
  const history = useNavigate();
  const lookResultRef: any = useRef();
  const pdfDetail: any = useRef();

  const getListData = (pageNo: number, pageSize: number = 10) => {
    const values = form.getFieldsValue();
    const formData: paramsType = {
      pageSize,
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

  const onResetClick = () => {
    form.resetFields();
    getListData(1);
  };

  const onSearchClick = () => {
    getListData(1);
  };

  const onAddEvaluationClick = () => {
    history('/evaluation/recruitEvaluation/launchEvaluation');
  };

  const copyText = (text: string) => {
    if (copy(text)) {
      message.success('复制成功!');
    } else {
      message.success('复制失败，请重新复制');
    }
  };

  const showReport = (record: IColumns) => {
    if (record.templateType === 'MBTI') {
      history(`/evaluation/recruitEvaluation/report/${record.id}/lookReport/${record.examPaperId}~${record.phone}`);
      return;
    }
    lookResultRef.current.onOpenDrawer({ examPaperId: record.examPaperId, userId: record.phone })
  }

  const onDownLoad = async (record: IColumns) => {
    setDownLoading(record.examPaperId);
    const res = await getUserExamResult({ examPaperId: record.examPaperId, userId: record.phone, major: true })
    if (res.code === 1) {
        const newData = {...res.data};
        if (res.data.results) {
            const { htmlDesc } = newData;
            const newDimensional = {};
            htmlDesc?.dimensional.forEach((item: any) => {
                Object.assign(newDimensional, {
                    [item.tag]: item,
                });
            });
            const newList = abilityList.map((item: any) => {
                if (htmlDesc?.ability) {
                    return {
                        ...item,
                        sort: (TagSort as any)[htmlDesc?.ability?.[item.name]]
                    }
                }
            });
            sortBy(newList, function (item:any) { return item.sort });

            Object.assign(newData, {
                resultType: res.data.results[0]?.type,
                examTemplateArr: res.data.results[0]?.type.split(''),
                htmlDesc: {
                    ...htmlDesc,
                    dimensional: newDimensional,
                    abilityList: newList,
                }
            })
        }
        setResultDetial(newData, () => {
          pdfDetail.current.exportPDF(() => {
            setDownLoading(0);
          });
        });
    }
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
      render: (text: string) => <span className={styles.table_column_text}>{text}</span>
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
        {text == 5 ? '已完成' : (text == 1 || text == 2 || text == 3) ? '进行中' : rectuitMap[text]}
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
          <CopyOutlined />
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
      render: text => <span className={styles.table_column_text}>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
    },
    {
      title: '操作',
      key: 'options',
      width: 150,
      fixed: 'right',
      render: (record, text, index) => {
        const { examStatus } = record;
        if (examStatus == 10 || examStatus == 5) {
          // 解锁查看
          const onUnlockClick = async () => {
            unlockLoading[index] = true
            setUnlockLoading([...unlockLoading])
            const params = {
              userId: record.phone,
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
                  {
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
                  }
                </>
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

  return <div className={styles.recruitEvaluation_layout}>
    <div className={styles.recruitEvaluation_content}>
      <h1>招聘测评</h1>
      <nav>
        <Form form={form} layout="inline">
          <Form.Item name="candidateName" label="候选人">
            <Input placeholder="请输入" style={{ width: 240 }} />
          </Form.Item>
          <Form.Item name="job" label="应聘岗位">
            <Input placeholder="请输入" style={{ width: 240 }} />
          </Form.Item>
          <Form.Item name="examStatus" label="测评状态">
            <Select
              optionFilterProp="children"
              allowClear
              filterOption={(input, option) =>
                (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
              placeholder="请选择"
              showSearch
              style={{ width: 240 }} >
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
        </div>
      </nav>
      <Divider />
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
        <Table loading={tableLoading}
          pagination={false}
          columns={columns}
          rowKey={(res) => res.id}
          dataSource={candidateList}
          scroll={{ x: 1600 }}
        />
      </main>
    </div>
    {
      candidateList.length && <footer>
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
    <ModalLink
      visible={visible}
      copyText={copyText}
      modalLink={modalLink}
      closeModal={closeModal}
    />
    <LookResult ref={lookResultRef} isRecruit={true} />
    <PdfDetailMBTI
      ref={pdfDetail}
      resultDetail={resultDetial}
      childStyle={{
        'width': '1120px',
        'boxSizing': 'border-box',
        'position': 'fixed',
        'top': '0pt',
        'left': '-9999pt',
        'zIndex': '-9999'
      }}
    />
  </div>
};

export default RecruitEvaluation;
