import React, { useRef, useState } from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';
import { propsType, tagType } from './type';
import AddTags from '@/page/evaluation/portrait/worth/addTags';
import styles from './index.module.less';

const PositionDrawer = ({ visible, closeDrawer }: propsType) => {
  const [form] = Form.useForm();
  const [transferredData, setTransferredData] = useState<tagType[]>([])
  const AddTagsRef: any = useRef();
  // 打开选择标签的弹出窗
  const openTag = () => {
    AddTagsRef.current.onOpenClick(transferredData || [], false)
  }
  const getSelectTags = (obj: any) => {
    setTransferredData(obj);
    const idList = obj.map((v: any) => v.name);
    form.setFieldsValue({
      name2: idList
    });
    // transferredData[curKey] = obj
    // setTransferredData({ ...transferredData })
    // const tagIds = Object.values(obj).flat(Infinity).map(res => res.id)
    // const curObj = getFieldsValue()
    // const curVal = curObj[config.fieldName]
    // !curVal[curKey].tags && (curVal[curKey].tags = [])
    // Object.assign(curVal[curKey], { tagIds, tags: [...Object.values(obj).flat(Infinity)] })
    // setFieldsValue({ [config.fieldName]: curVal })
  }
  const changeTag = (tags: any) => {
    const arr: tagType[] = [];
    transferredData.map((v: tagType) => {
      if (tags.includes(v.name)) {
        arr.push(v)
      }
    })
    setTransferredData(arr)
  }
  return (
    <Drawer
      visible={visible}
      title='新增岗位'
      width={400}
      onClose={closeDrawer}
    >
      <div className={styles.position_drawer}>
        <div className={styles.content}>
          <Form
            form={form}
            layout='vertical'
          >
            <Form.Item
              name="name"
              label="岗位名称"
              rules={[{ required: true, message: '请输入岗位名称!' }]}
            >
              <Input maxLength={20} placeholder="请输入" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="name1"
              label="岗位描述"
              rules={[{ required: true, message: '请输入岗位描述!' }]}
            >
              <Input placeholder="请输入" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="name2"
              label="画像标签（多选）"
              rules={[{ required: true, message: '请选择画像标签!' }]}
            >
              <Select
                open={false}
                mode='tags'
                defaultValue={['a10', 'c12']}
                onClick={() => openTag()}
                placeholder="请选择"
                style={{ width: '100%' }}
                onChange={changeTag}
              />
            </Form.Item>
          </Form>
        </div>
        <div className={styles.footer}>
          <Button className={styles.footer_close} onClick={() => closeDrawer()}>取消</Button>
          <Button type='primary'>确定</Button>
        </div>
      </div>
      <AddTags getSelectTags={getSelectTags} ref={AddTagsRef} />
    </Drawer>
  );
}

export default PositionDrawer;
