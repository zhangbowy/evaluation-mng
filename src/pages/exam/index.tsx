import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message, Progress, Switch } from 'antd';
import { editExam, examList, queryExamUserIds, updateExam } from '@/services/api';
import { history } from 'umi';
import dd from 'dingtalk-jsapi';
import { useRef } from 'react';

const ExamList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const handleClick = (id: number) => {
    history.push('/exam/' + id);
  };
  const handleEdit = async (examId: number) => {
    const res = await queryExamUserIds(examId);
    if (res.code === 1) {
      const pickResult = await dd.biz.contact.choose({
        multiple: true, //是否多选：true多选 false单选； 默认true
        users: res.data,
      });
      if (pickResult.length < 1) {
        message.error('至少选择一个用户');
        return;
      }
      const result = await updateExam({
        examId,
        examUsers: pickResult.map((item: any) => ({ userId: item.emplId })),
      });
      if (result.code === 1) {
        message.success('修改成功');
      }
    }
  };
  const columns: ProColumnType<ExamListItem>[] = [
    { title: '序号', dataIndex: 'id' },
    { title: '测试名称', dataIndex: 'evaluationName' },
    { title: '覆盖人数', dataIndex: 'totalNumber' },
    { title: '完成人数', dataIndex: 'finishNumber' },
    {
      title: '完成率',
      dataIndex: 'completion',
      render: (dom, entity) => <Progress percent={entity.completion * 100} />,
    },
    { title: '创建人', dataIndex: 'createName' },
    { title: '创建时间', dataIndex: 'created', valueType: 'dateTime' },
    {
      key: 'detail',
      render: (_dom, entity) => <a onClick={() => handleClick(entity.id)}>查看详情</a>,
    },
    {
      key: 'op',
      title: '操作',
      valueType: 'option',
      render: (_dom, entity) => [
        <a key="edit" onClick={() => handleEdit(entity.id)}>
          编辑
        </a>,
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
      ],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: {} }}>
      <ProCard>
        <ProTable<ExamListItem>
          actionRef={actionRef}
          search={false}
          rowKey="id"
          columns={columns}
          request={async (params) => {
            const res = await examList({ ...params, curPage: params.current });
            if (res.code === 1) {
              return {
                success: true,
                data: res.data.resultList,
                total: res.data.totalItem,
              };
            }
            return { success: false };
          }}
        />
      </ProCard>
    </PageContainer>
  );
};

export default ExamList;
