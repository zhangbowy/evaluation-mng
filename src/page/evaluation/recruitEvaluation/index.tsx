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
  DownOutlined,
  CheckOutlined
} from '@ant-design/icons';
import styles from './index.module.less';
import { ColumnsType } from 'antd/lib/table'
import { IColumns, RecruitStatus, rectuitMap, paramsType } from './type';
import ModalLink from './components/modalLink';
import LookResult from '@/components/lookResult'
import { queryRecruitmentExamList } from '@/api/api';

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
const dataList:IColumns[] = [
  {
    id: 1,
    tpf: 2,
    appId: 3,
    corpId: 4,
    name: '刘寒冰',
    job: '职位',
    phone: '1511111111',
    email: '151@qq.com',
    examPaperId: 22,
    examTemplateType: 'CA',
    shortLink: 'wwwwddddaaa',
    examStatus: '10',
    isOpen: true,
    created: '2022-05-05'
  },
  {
    id: 2,
    tpf: 2,
    appId: 3,
    corpId: 4,
    name: '刘寒冰',
    job: '职位',
    phone: '1511111111',
    email: '151@qq.com',
    examPaperId: 22,
    examTemplateType: 'CA',
    shortLink: 'wwwwddddaaa',
    examStatus: '0',
    isOpen: true,
    created: '2022-05-05'
  },
  {
    id: 3,
    tpf: 2,
    appId: 3,
    corpId: 4,
    name: '刘寒冰',
    job: '职位',
    phone: '1511111111',
    email: '151@qq.com',
    examPaperId: 22,
    examTemplateType: 'CA',
    shortLink: 'wwwwddddaaa',
    examStatus: '1',
    isOpen: true,
    created: '2022-05-05'
  },
];
const { confirm } = Modal;
const cx = classNames.bind(styles);
const RecruitEvaluation = () => {
  const [form] = Form.useForm();
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [totalNum, setTotalNum] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1)
  const [candidateList, setCandidateList] = useState<IColumns[]>(dataList);
  const [visible, setVisible] = useState<boolean>(false);
  const [modalLink, setModalLink] = useState<string>('');
  const history = useNavigate();
  const lookResultRef: any = useRef();

  const getListData = (pageNo: number, pageSize: number = 10) => {
    const values = form.getFieldsValue();
    const formData: paramsType = {
      ...values,
      pageSize,
      curPage: pageNo
    }
    setTableLoading(true);
    queryRecruitmentExamList(formData).then((res: IBack) => {
      const { code, data } = res;
      setTableLoading(false);
      if (code === 1) {
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
    console.log(text, 'text');
    if (copy(text)) {
      message.success('复制成功!');
    } else {
      message.success('复制失败，请重新复制');
    }
  };

  const showReport = (record: IColumns) => {
    lookResultRef.current.onOpenDrawer({ examPaperId: record.examPaperId, userId: '11' })
    // history(`/evaluation/peopleReport/detail/${record.id}`)
  }

  const columns: ColumnsType<IColumns> = [
    {
      title: '候选人',
      dataIndex: 'name'
    },
    {
      title: '应聘岗位',
      dataIndex: 'job'
    },
    {
      title: '测评状态',
      dataIndex: 'examStatus',
      render: (text: number) =>
      <span
        className={cx({
          'status_base': true,
          'status_answer': text == 0,
          'status_start': text == 1,
          'status_finish': text == 10
        })} >
        {rectuitMap[text]}
      </span>
    },
    {
      title: '测评链接',
      dataIndex: 'shortLink',
      render: (text: string) => <div>
        <span>{text}</span>
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
      render: text => text ? text : '-'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      render: text => text ? text : '-'
    },
    {
      title: '创建时间',
      dataIndex: 'created'
    },
    {
      title: '操作',
      key: 'options',
      width: 150,
      render: record => {
        const { examStatus } = record;
        if (examStatus == 10) {
          return <span className={styles.showReport} onClick={() => showReport(record)}>查看报告</span>
        } else {
          const onOpenClick = (checked: boolean) => {
            if (!checked) {
              confirm({
                title: '确定关闭测评吗?',
                icon: <ExclamationCircleOutlined />,
                content: '关闭后，该人员将无法继续评测',
                onOk() {},
                onCancel() {},
              })
            }
          };
          return <Switch
            key="switch"
            checkedChildren="开"
            unCheckedChildren="关"
            onClick={(checked) => onOpenClick(checked)}
            checked={record.isOpen}
          />
        }
      }
    }
  ];

  const changePagination = (page: number, pageSize: number) => {
    setCurrent(page);
    getListData(page);
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
    getListData(current);
  }, []);

  // 分页配置
  const paginationObj = {
    showQuickJumper: true,
    defaultCurrent: 1,
    defaultPageSize: 10,
    current: current,
    total: totalNum,
    showTotal: (total: number) => `共 ${total} 条数据`,
    onChange: (page: number) => {
      setCurrent(page);
      // 请求列表数据
      // getUser({ currentPage: page, ...form.getFieldsValue() })
    }
  }
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
        />
      </main>
    </div>
    <footer>
      <div className={styles.footer_line} />
      <Pagination
      showQuickJumper={true}
      defaultCurrent={1}
      defaultPageSize={10}
      current={current}
      total={totalNum}
      showTotal={(total: number) => `共 ${total} 条数据`}
      onChange={changePagination}
      />
    </footer>
    <ModalLink
      visible={visible}
      copyText={copyText}
      modalLink={modalLink}
      closeModal={closeModal}
    />
    <LookResult ref={lookResultRef} />
  </div>
};

export default RecruitEvaluation;
