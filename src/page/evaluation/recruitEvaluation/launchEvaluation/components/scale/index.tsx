import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { message } from 'antd';
import { CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd';
import { IExamTemplateList, propsType } from './type';
import styles from './index.module.less';
import { getExamTemplateList, UnLockReport } from '@/api/api';
import { CountContext } from '@/utils/context'

const cx = classNames.bind(styles);
const { confirm } = Modal;
const Scale = ({ setStampsNum }: propsType) => {
  const [data, setData] = useState<IExamTemplateList[]>([]);
  const [selectScale, setSelectScale] = useState<number>();
  const { dispatch } = useContext(CountContext);

  const qcp_user = JSON.parse(sessionStorage.getItem('QCP_B_USER') || '{}');
  const onSelectScale = (index: number) => {
    setSelectScale(data[index].id);
    setStampsNum && setStampsNum(data[index].examCouponCommodityDetail.pointPrice, data[index].type)
  };

  const getExamTemplate = () => {
    getExamTemplateList().then((res: IBack) => {
      const { code, data } = res;
      if (code === 1) {
        setData(data);
      }
    })
  }

  const onUnlock = (data: IExamTemplateList) => {
    const title = data.type === 'MBTI' ? 'MBTI' : data.type === 'PDP' ? 'PDP'
          : data.type === 'CA' ? '职业锚' : data.type === 'CPI' ? '人格魅力' : ''
    confirm({
      title: `解锁需要${data.examTemplateCommodityDetail.pointPrice}点券`,
      icon: <ExclamationCircleOutlined />,
      content: <div>
        <span>
          是否确定解锁
          【{data.title}】
        </span>
        <div className={styles.scale_unlock_item}>
          <div className={cx({
            'scale_unlock_left': true,
            'is_letter': data.type === 'MBTI' || data.type === 'PDP',
            'is_china_chart': data.type === 'CA' || data.type === 'CPI',
            'scale_unlock_mbti': data.type === 'MBTI',
            'scale_unlock_pdp': data.type === 'PDP',
            'scale_unlock_ca': data.type === 'CA',
            'scale_unlock_cpi': data.type === 'CPI',
          })} />
          <div className={styles.scale_unlock_right}>
            {data.includeText}
          </div>
        </div>
      </div>,
      onOk: (close) => {
        // 调用解锁
        const params = {
          userId: qcp_user.userId,
          templateType: data?.type,
          operationType: '0',
        }
        UnLockReport(params).then((res: IBack) => {
          if (res.code == 1) {
            message.success('解锁成功');
            getExamTemplate();
            dispatch();
            close();
          }
        })
      },
    });
  };
  useEffect(() => {
    getExamTemplate();
  }, [])
  return <div className={styles.scale_wrap}>
    {
      data.map((v: IExamTemplateList, index: number) => {
        const title = v.type === 'MBTI' ? 'MBTI' : v.type === 'PDP' ? 'PDP'
          : v.type === 'CA' ? '职业锚' : v.type === 'CPI' ? '人格魅力' : ''
        if (v.isBuy) {
          return <div
            className={cx({
              'scale_item': true,
              'scale_mbti': v.type === 'MBTI',
              'scale_pdp': v.type === 'PDP',
              'scale_career': v.type === 'CA',
              'scale_personality': v.type === 'CPI',
              'selected': v.id === selectScale
            })}
            onClick={() => onSelectScale(index)}
            key={v.id}
          >
            <div className={styles.scale_item_select}>
              {
                v.id === selectScale ? <CheckOutlined /> : null
              }
            </div>
            <div className={styles.scale_item_title}>
              {title}
            </div>
            <div className={styles.scale_item_content}>
              {v.includeText}
            </div>
          </div>
        } else {
          return (
            <div
              className={cx({
                'scale_item': true,
                'scale_lock': true
              })}
              key={v.id}
            >
              <div className={styles.scale_item_tip}>
                <span>未解锁</span>
              </div>
              <div className={styles.scale_item_title}>
                {title}
              </div>
              <div className={styles.scale_item_content}>
                {v.includeText}
              </div>
              <div onClick={() => onUnlock(v)} className={styles.scale_item_mark}>
                <span>点击解锁</span>
              </div>
            </div>
          )
        }
      })
    }
  </div>
}

export default Scale;
