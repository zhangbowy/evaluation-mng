import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button, Drawer, message } from 'antd';
import { createExam, getExamTemplateList } from '@/services/api';
import dd from 'dingtalk-jsapi';
import queryString from 'query-string';
import { history } from 'umi';
import styles from './index.less';
import { useState } from 'react';

const ExamTemplate: React.FC = () => {
  const { corpId } = queryString.parse(location.search);
  const [visible, setVisible] = useState<boolean>(false);
  const [img, setImg] = useState<string>();
  const [selected, setSelected] = useState<ExamTemplateListItem>();
  const handleClick = async (template: ExamTemplateListItem) => {
    dd.ready(async () => {
      const pickResult = await dd.biz.contact.choose({
        multiple: true, //是否多选：true多选 false单选； 默认true
        corpId,
      });
      if (pickResult.length < 1) {
        return;
      }
      const res = await createExam({
        examTemplateType: template.type,
        examTemplateId: template.id,
        examTitle: template.title,
        examUserList: pickResult?.map((item: any) => ({ userId: item.emplId })),
      });
      if (res.code === 1) {
        message.success(res.message);
        history.push('/exam/index');
      }
    });
  };
  return (
    <PageContainer header={{ breadcrumb: {} }}>
      <Drawer
        visible={visible}
        onClose={() => setVisible(false)}
        placement="right"
        title="报告详情"
        width="375px"
      >
        <div className="pageIntroduce">
          <div className={styles.describeBox}>
            <img className={styles.describeImg} src={img} />
          </div>
          <div className={styles.buttonBox}>
            <div className={styles.button} onClick={() => handleClick(selected)}>
              创建
            </div>
          </div>
        </div>
      </Drawer>
      <ProCard>
        <ProList<ExamTemplateListItem>
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: false,
          }}
          className="template"
          rowKey="id"
          grid={{ gutter: 16, column: 4 }}
          request={async () => {
            const res = await getExamTemplateList();
            if (res.code === 1) {
              return {
                success: true,
                data: res.data,
              };
            }
            return { success: false };
          }}
          metas={{
            title: {
              dataIndex: 'title',
              render: (title, entity) => {
                return (
                  <div
                    className={styles.titleHeader}
                    onClick={() => {
                      setSelected(entity);
                      setImg(JSON.parse(entity.introductionImage).admin);
                      setVisible(true);
                    }}
                  >
                    {title}
                  </div>
                );
              },
            },
            content: {
              dataIndex: 'introduction',
              render: (introduction, entity) => {
                return (
                  <div>
                    <div
                      onClick={() => {
                        setSelected(entity);
                        setImg(JSON.parse(entity.introductionImage).admin);
                        setVisible(true);
                      }}
                    >
                      <div style={{ color: '#000000', opacity: '45%', fontSize: 16}}>
                        {introduction}
                      </div>
                      <div style={{ backgroundColor: '#ffffff' }}>
                        <div style={{ margin: '10px 20px' }}>
                          <div>
                            <span style={{ color: '#000000', opacity: '45%', fontSize: 14 }}>
                              作答时间：
                            </span>
                            <span style={{ color: '#000000', opacity: '85%', fontSize: 14 }}>
                              {entity.durationDesc}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: '#000000', opacity: '45%', fontSize: 14 }}>
                              题目数量：
                            </span>
                            <span style={{ color: '#000000', opacity: '85%', fontSize: 14 }}>
                              {entity.examLibrarySum}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleClick(entity)}
                      style={{
                        width: '100%',
                        height: 43,
                        backgroundColor: '#E5F2FF',
                        color: '#1890FF',
                        borderRadius: '0px 0px 4px 4px',
                        border: 'none',
                        fontSize: 16,
                      }}
                    >
                      创建
                    </Button>
                  </div>
                );
              },
            },
          }}
        />
      </ProCard>
    </PageContainer>
  );
};

export default ExamTemplate;
