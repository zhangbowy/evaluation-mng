import React from 'react';
import { Modal } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { propsType } from './type';

const ModalLink = ({ visible, modalLink, copyText, closeModal }: propsType) => (
  <Modal
    visible={visible}
    footer={null}
    width={424}
    onCancel={() => closeModal()}
  >
    <div className={styles.recruitEvaluation_modal_content}>
      <div className={styles.recruitEvaluation_modal_icon}>
        <CheckOutlined />
      </div>
      <div
        className={styles.recruitEvaluation_modal_status}
      >
        发布成功
      </div>
      <div
        className={styles.recruitEvaluation_modal_tip}
      >
        候选人可通过此链接参与测评
      </div>
      <div
        className={styles.recruitEvaluation_modal_link}
      >
        <span
          className={styles.recruitEvaluation_modal_link_text}
        >
          邀请链接：{modalLink}
        </span>
        <span
          className={styles.recruitEvaluation_modal_link_copy}
          onClick={() => copyText(modalLink)}
        >
          <CopyOutlined />
        </span>
      </div>
    </div>
  </Modal>
)

export default ModalLink;
