import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Breadcrumb, Button, message, Form, Input, Select, Divider } from 'antd';
import styles from './index.module.less';
import Scale from './components/scale';
import PositionDrawer from './components/positionDrawer';
import { addRecruitmentExam } from '@/api/api';
import { getAllUrlParam, getAppIdType } from '@/utils/utils';

const LaunchEvaluation = () => {
  const [form] = Form.useForm();
  const [stamps, setStamps] = useState<number>(0);
  const [stampsId, setStampsId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const { appId } = getAllUrlParam();
  const { Option } = Select;
  const appType: string = getAppIdType();

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
      setLoading(true);
      addRecruitmentExam(formData).then((res: IBack) => {
        const { code, data, message: msg } = res;
        setLoading(false);
        if (code === 1) {
          // 发布测评成功，跳回到列表页
          navigate('/evaluation/recruitEvaluation');
          sessionStorage.setItem('RECRUIT_MODAL_FLAG', data.shortLink);
        }
      })
    });
  };

  const setStampsNum = (num: number, type: string) => {
    setStamps(num);
    setStampsId(type);
  };

  const validatorPhone = () => {
    const phoneNum = form.getFieldValue('phone');
    const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
    const flag = reg.test(phoneNum);
    if (phoneNum === '' || phoneNum === undefined) {
      return Promise.resolve();
    }
    if (!flag) {
      return Promise.reject('请输入正确的手机号码');
    }
    return Promise.resolve();
  }

  const validatorEmail = () => {
    const email = form.getFieldValue('email');
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const flag = reg.test(email);
    if (email === '' || email === undefined) {
      return Promise.resolve();
    }
    if (!flag) {
      return Promise.reject('请输入正确的邮箱地址');
    }
    return Promise.resolve();
  };

  const openDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const dropdownRender = (menu: any) => (
    <>
      {menu}
      <Divider style={{ margin: '8px 0' }} />
      <div onClick={openDrawer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px 0', cursor: 'pointer' }}>
        <span style={{ fontSize: '18px', color: '#2B85FF', marginRight: '4px', marginTop: '-2px' }}>+</span>
        <span style={{ fontSize: '14px', color: '#2B85FF' }}>新增岗位</span>
      </div>
    </>
  )

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
            <Input showCount maxLength={20} placeholder="请输入" style={{ width: 375 }} />
          </Form.Item>
          <Form.Item
            name="job"
            label="应聘岗位"
            rules={[{ required: true, message: '请输入应聘岗位!' }]}
          >
            {/* {
              appType === '1'
                ? <Input showCount maxLength={20} placeholder="请输入" style={{ width: 375 }} />
                : <Select
                  style={{ width: 375 }}
                  placeholder='请选择'
                  dropdownRender={dropdownRender}
                >
                  <Option value='jack'>jack</Option>
                  <Option value='jim'>jim</Option>
                </Select>
            } */}
            <Input showCount maxLength={20} placeholder="请输入" style={{ width: 375 }} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            // rules={[{ validator: validatorPhone }, { required: false }]}
          >
            <Input type='tel' placeholder="请输入" style={{ width: 375 }} />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            // rules={[{ validator: validatorEmail }, { required: false }]}
          >
            <Input type='email' placeholder="请输入" style={{ width: 375 }} />
          </Form.Item>
        </Form>
      </section>
      <section className={styles.launch_evaluation_scale}>
        <h1>选择量表</h1>
        <Scale setStampsNum={setStampsNum} />
      </section>
      {
        appId.split('_')[0] === '1' && <section className={styles.launch_evaluation_cost}>
          <h1>预计消耗点券</h1>
          <span>{stamps}</span>
        </section>
      }
    </main>
    <footer>
      <Button onClick={goBackList}>
        取消
      </Button>
      <Button
        type='primary'
        className={styles.launch_evaluation_btn}
        onClick={onSubmit}
        loading={loading}
      >
        发起测评
      </Button>
    </footer>
    <PositionDrawer visible={visible} closeDrawer={closeDrawer} />
  </div>
}

export default LaunchEvaluation;
