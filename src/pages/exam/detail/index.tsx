import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { useParams } from 'umi';
import { useEffect, useState } from 'react';
import { Col, message, Progress, Row, Space, Typography, Breadcrumb } from 'antd';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ExamReport from '../../../components/Result/report';
import { getExamUsers } from '@/services/api';
import './index.less';

const ExamDetail: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [examId, setExamId] = useState<number>();
  const [examTemplateType, setExamTemplateType] = useState<string>('');
  const [examUsers, setExamUsers] = useState<ExamUsers>();

  const columns: ProColumnType<ExamUser>[] = [
    {
      key: 'id',
      title: '序号',
      valueType: 'index',
    },
    {
      dataIndex: 'name',
      title: '姓名',
    },
    {
      title: '部门',
      dataIndex: 'deptAggregationDTOS',
      render: (dom, entity) => {
        return <Space>{entity.deptAggregationDTOS.map((item) => item.name)}</Space>;
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueEnum: {
        0: '未设置',
        1: '男',
        2: '女',
      },
    },
    {
      title: '测评时间',
      dataIndex: 'startTime',
    },
    {
      title: '测评报告',
      key: 'report',
      valueType: 'option',
      render: (dom, entity) => {
        if (entity.status === 10) {
          return (
            <a
              key="view"
              style={{ float: 'right', marginRight: 20 }}
              onClick={() => {
                setVisible(true);
                setUserId(entity.userId);
                setExamId(entity.examId);
              }}
            >
              查看报告
            </a>
          );
        }
        return entity.status === 0 ? (
          <span style={{ color: 'rgba(0, 0, 0, 0.45)', marginRight: 10, float: 'right' }}>
            未参加测评
          </span>
        ) : (
          <div style={{ marginRight: 26, float: 'right' }}>
            测评中
          </div>
        );
      },
    },
  ];
  const { id } = useParams() as { id: string };
  useEffect(() => {
    if (!id) {
      message.error('缺少必要参数');
      return;
    }
    getExamUsers({ examid: id }).then((res) => {
      if (res.code === 1) {
        setExamUsers(res.data);
        setExamTemplateType(res.data.examTemplateType);
      }
    });
  }, [id]);
  if (!examUsers) {
    return <PageLoading />;
  }
  return (
    <PageContainer>
      <ExamReport type={examTemplateType} userId={userId} examId={examId} visible={visible} onVisibleChange={setVisible} />
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>
          <a href='#/exam/index'>测评管理</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{examUsers?.examTitle}</Breadcrumb.Item>
      </Breadcrumb>
      <ProCard>
        <Typography>
          <Row className="Details">
            <div>
              <Space>
                <Typography.Title>{examUsers?.examTitle}</Typography.Title>
                {/* <Typography.Text disabled style={{color:'#333333',cursor:'default',fontSize:14,textAlign:'end'}}>覆盖人数:{examUsers?.num}</Typography.Text> */}
              </Space>
            </div>
            <div className="det-right">
              <Progress
                className="schedule"
                type="line"
                percent={parseFloat(examUsers?.finishValue || '0')}
                format={(percent) => `完成度${percent}%`}
              />

              <Typography.Text
                disabled
                style={{
                  color: '#333333',
                  cursor: 'default',
                  fontSize: 14,
                  marginTop: 10,
                  paddingRight: 15,
                  textAlign: 'right'
                }}
              >
                覆盖人数:{examUsers?.num}
              </Typography.Text>
            </div>
          </Row>
          <Typography.Paragraph style={{ paddingRight: '24px' }}>
            {examUsers?.introduction}
          </Typography.Paragraph>
        </Typography>
        <ProTable<ExamUser>
          search={false}
          options={false}
          columns={columns}
          rowKey="id"
          dataSource={examUsers?.userExamVos}
        />
      </ProCard>
    </PageContainer>
  );
};

export default ExamDetail;
