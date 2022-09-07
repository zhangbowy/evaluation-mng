import React, { useEffect, useState } from 'react';
import { Modal, Button, message } from 'antd';
import styles from './index.module.less';
import { propsType } from './type';
import { getDataScreenUrl } from '@/api/api';
import { getAllUrlParam, openLink } from "@/utils/utils";

const ModalScreen = (props: propsType) => {
  const { visible, closeModal } = props;
  const [isAction, setIsAction] = useState<boolean>(true);
  const [screenUrl, setScreenUrl] = useState<string>('');
  const { corpId, appId, clientId } = getAllUrlParam();

  useEffect(() => {
    if (visible) {
      getDataScreenUrl({}).then(res => {
        const { data, code } = res;
        if (code === 1) {
          setIsAction(false);
          if (data) {
            setScreenUrl(data)
          }
        }
      })
    }
  }, [visible])
  const goScreen = () => {
    if (screenUrl) {
      window.open(screenUrl);
      // openLink({
      //   url: `${window.location.origin}/admin/?corpId=${corpId}&appId=${appId}&clientId=${clientId}#/share/${encodeURIComponent(screenUrl)}?ddtab=true`
      // }, true)
    } else {
      message.error('大屏数据暂未配置');
    }
  };
  const close = () => {
    closeModal();
  };
  return (
    <Modal
      visible={visible}
      footer={null}
      width={600}
      onCancel={close}
    >
      <div className={styles.screen}>
        <div className={styles.screen_title}>请确保全员已完成测评</div>
        <div className={styles.screen_tips}>为保证大屏分析数据的准确性和完整性，请确保全员已完成全部量表的测评</div>
        <img className={styles.screen_img} src="https://qzz-static.forwe.store/evaluation-mng/imgs/xdjy_LargeScreen.png" alt="" />
        <div className={styles.screen_footer}>
          <Button onClick={goScreen} disabled={isAction} className={styles.screen_footer_go} type='primary'>已完成，立即前往</Button>
          <span onClick={close} className={styles.screen_footer_back}>暂不前往</span>
        </div>
      </div>
    </Modal>
  );
}

export default ModalScreen;
