import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Breadcrumb, Button, message, Form, Input } from 'antd';
import styles from './index.module.less';
import Scale from './components/scale';
import { addRecruitmentExam } from '@/api/api';

const LaunchEvaluation = () => {
  const [form] = Form.useForm();
  const [stamps, setStamps] = useState<number>(0);
  const [stampsId, setStampsId] = useState<string>();
  const navigate = useNavigate();

  const goBackList = () => {
    navigate('/evaluation/recruitEvaluation');
  };

  const onSubmit = () => {
    form.validateFields().then(values => {
      if (!stampsId) {
        message.warning('请选择量表！');
        return;
      }
      const formData = {
        ...values,
        templateType: stampsId
      }
      addRecruitmentExam(formData).then((res: IBack) => {
        const { code, data, message: msg } = res;
        if (code === 1) {
          // 发布测评成功，跳回到列表页
          navigate('/evaluation/recruitEvaluation');
          sessionStorage.setItem('RECRUIT_MODAL_FLAG', data.shortLink);
        } else {
          message.error(msg);
        }
      })
    });
  };

  const setStampsNum = (num: number, type: string) => {
    setStamps(num);
    setStampsId(type);
  };

  return <div className={styles.launch_evaluation_layout}>
    <Breadcrumb separator=">" className={styles.launch_evaluation_nav}>
      <Breadcrumb.Item href="#/evaluation/recruitEvaluation">招聘测评</Breadcrumb.Item>
      <Breadcrumb.Item>发起测评</Breadcrumb.Item>
    </Breadcrumb>
    <main>
      <section>
        <h1>候选人信息</h1>
        <Form
          form={form}
          layout="horizontal"
          wrapperCol={{ span: 14 }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名!' }]}
          >
            <Input placeholder="请输入" style={{ width: 375 }} />
          </Form.Item>
          <Form.Item
            name="job"
            label="应聘岗位"
            rules={[{ required: true, message: '请输入应聘岗位!' }]}
          >
            <Input placeholder="请输入" style={{ width: 375 }} />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入" style={{ width: 375 }} />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入" style={{ width: 375 }} />
          </Form.Item>
        </Form>
      </section>
      <section className={styles.launch_evaluation_scale}>
        <h1>选择量表</h1>
        <Scale setStampsNum={setStampsNum} />
      </section>
      <section className={styles.launch_evaluation_cost}>
        <h1>预计消耗点券</h1>
        <span>{stamps}</span>
      </section>
    </main>
    <footer>
      <Button onClick={goBackList}>
        取消
      </Button>
      <Button
        type='primary'
        className={styles.launch_evaluation_btn}
        onClick={onSubmit}
      >
        发起测评
      </Button>
    </footer>
  </div>
}

export default LaunchEvaluation;
