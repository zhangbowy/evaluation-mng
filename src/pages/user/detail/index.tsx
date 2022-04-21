import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Col, Progress, Row, Space, Tag, Typography, Breadcrumb } from 'antd';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { getAllExam } from '@/services/api';
import ExamReport from '@/components/Result/report';
import './index.less';

const UserDetail: React.FC = () => {
  const { id } = queryString.parse(location.hash.split('?')[1]);
  const [all, setAll] = useState<AllExam>();
  const [visible, setVisible] = useState<boolean>(false);
  const [examId, setExamId] = useState<number>();
  useEffect(() => {
    getAllExam({ userId: id }).then((res) => {
      if (res.code === 1) {
        setAll(res.data);
      }
    });
  }, [id]);
  if (!all) {
    return <PageLoading />;
  }
  const columns: ProColumnType<Exam>[] = [
    { title: '序号', dataIndex: 'examId', key: 'examId', valueType: 'index' },
    { title: '测评名称', dataIndex: 'examName' },
    { title: '测评时间', dataIndex: 'date', valueType: 'dateTime' },
    {
      title: '测评报告',
      key: 'op',
      valueType: 'option',
      render: (dom, record) => {
        if (record.answerStatus === 0) {
          return <span>未开始</span>;
        } else if (record.answerStatus < 3) {
          return <span>答题中</span>;
        } else if (record.answerStatus < 10) {
          return <span>报告生成中</span>;
        }
        return (
          <a
            style={{ float: 'right', marginRight: 20 }}
            key="report"
            onClick={() => {
              setExamId(record.examId);
              setVisible(true);
            }}
          >
            查看报告
          </a>
        );
      },
    },
  ];
  return (
    <PageContainer header={{}}>
      <ExamReport userId={id} examId={examId} visible={visible} onVisibleChange={setVisible} />
      <Breadcrumb  style={{marginBottom:20}}>
        <Breadcrumb.Item><a href='#/report'>人才报告</a></Breadcrumb.Item>
        <Breadcrumb.Item>{all.name}</Breadcrumb.Item>
      </Breadcrumb>
      <ProCard>
        <Typography>
          <div className="information">
            {/* 名字性别 */}
            <div>
              <Space>
                <Typography.Title>
                  {all.name}-{all.deptList?.[0]?.name}
                </Typography.Title>
                <Typography.Text style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                  性别:{all.sex === 1 ? '男' : '女'}
                </Typography.Text>
              </Space>
            </div>
            {/* 完成度 */}
            <div style={{ marginRight: '40px' }}>
              <Progress
                style={{ marginRight:10 }}
                type="line"
                percent={all.finishValue}
                format={(percent) => `完成度${percent}%`}
              />
            </div>
          </div>
          <div className="information">
            {/* 性格 */}
            <div>
              <Space>
                <Typography.Text style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                  性格标签:
                </Typography.Text>
              </Space>
            </div>
            {/* 完成信息 */}
            <div>
              <Space>
                <Typography.Text style={{ color: 'rgba(0, 0, 0, 0.65)', marginRight: 23 }}>
                  完成测评:{all.successNum}个
                </Typography.Text>
                <Typography.Text style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                  剩余测评:{all.remainingNum}个
                </Typography.Text>
              </Space>
            </div>
          </div>
        </Typography>
        <Space style={{ margin: '10px 0' }}>
          {all.userTagVoList.map((item) => (
            <Tag color="processing" key={item.id}>
              {item.name}
            </Tag>
          ))}
        </Space>
        <ProTable
          search={false}
          toolBarRender={false}
          rowKey="examId"
          dataSource={all.evaluationVoList}
          columns={columns}
        />
      </ProCard>
    </PageContainer>
  );
};

export default UserDetail;
