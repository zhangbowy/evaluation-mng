import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message, Progress, Switch } from 'antd';
import { editExam, examList, queryExamUserIds, updateExam } from '@/services/api';
import { history } from 'umi';
import dd from 'dingtalk-jsapi';
import { useEffect, useRef, useState } from 'react';
import queryString from 'query-string';
import './index.less';
import { getIsGuide } from '@/utils/utils'

const ExamList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { corpId } = queryString.parse(location.search);
  const [examListData, setExamListData] = useState<any>()
  const handleClick = (id: number, type: string) => {
    history.push(`/exam/${id}?type=${type}`);
  };
  const handleEdit = async (examId: number) => {
    const res = await queryExamUserIds(examId);
    if (res.code === 1) {
      const pickResult = await dd.biz.contact.choose({
        multiple: true, //是否多选：true多选 false单选； 默认true
        users: res.data,
        corpId,
      });
      const result = await updateExam({
        examId,
        examUsers: pickResult.map((item: any) => ({ userId: item.emplId })),
      });
      if (result.code === 1) {
        message.success('修改成功');
        actionRef.current?.reload();
      }
    }
  };
  const columns: ProColumnType<ExamListItem>[] = [
    { title: '序号', key: 'id', valueType: 'index' },
    { title: '测试名称', dataIndex: 'evaluationName' },
    { title: '覆盖人数', dataIndex: 'totalNumber' },
    { title: '完成人数', dataIndex: 'finishNumber' },
    {
      title: '完成率',
      dataIndex: 'completion',
      render: (dom, entity) => <Progress percent={entity.completion} />,
    },
    { title: '创建人', dataIndex: 'createName' },
    { title: '创建时间', dataIndex: 'created', valueType: 'dateTime' },
    {
      key: 'detail',
      title: '详情',
      render: (_dom, entity, index) => <a className={`lookdetatil${index}`} onClick={() => handleClick(entity.id, entity.examTemplateType)}>查看详情</a>,
    },
    {
      key: 'op',
      title: '操作',
      valueType: 'option',
      render: (_dom, entity, index) => [
        <Switch
          key="switch"
          checkedChildren="开启"
          unCheckedChildren="关闭"
          onClick={async (checked) => {
            const res = await editExam({ type: checked, examId: entity.id });
            if (res.code === 1) {
              message.success('修改成功');
              actionRef.current?.reload();
            }
          }}
          checked={entity.type}
        />,
        <a key="edit" className={`addpeople${index}`} onClick={() => handleEdit(entity.id)}>
          添加人员
        </a>,
      ],
    },
  ];
  useEffect(() => {
    if (examListData) {
      const setpsArr: stepsType[] = [{
        element: ".ant-page-header-heading-title",
        intro: "该模块主要用于查看测评量表的测试进度和各人员的测试结果",
        position: "bottom",
      }]
      if (examListData.length > 0) {
        setpsArr.push({
          element: ".lookdetatil0",
          intro: "点击查看测评数据分析",
          position: "bottom",
        }, {
          element: ".addpeople0",
          intro: "如有新人员需要参与测试，可直接在此添加",
          position: "bottom",
        })
      }
      getIsGuide(setpsArr, 2)
    }
  }, [examListData])
  return (
    <PageContainer header={{ breadcrumb: {} }}>
      <ProCard className="card-head"></ProCard>
      <ProTable<ExamListItem>
        actionRef={actionRef}
        options={false}
        rowKey="id"
        search={false}
        columns={columns}
        request={async (params) => {
          const res = await examList({ ...params, curPage: params.current });
          if (res.code === 1) {
            setExamListData(res.data.resultList)
            return {
              success: true,
              data: res.data.resultList,
              total: res.data.totalItem,
            };
          }
          return { success: false };
        }}
        pagination={{
          showSizeChanger: true,
          pageSize: 50,
        }}
      />
    </PageContainer>
  );
};

export default ExamList;
