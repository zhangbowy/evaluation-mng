import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { message, Tooltip } from 'antd';
import { CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd';
import { IExamTemplateList, propsType, titleType } from './type';
import styles from './index.module.less';
import { getExamTemplateList, UnLockReport } from '@/api/api';
import { CountContext } from '@/utils/context'
import Introduce from '../introduce';

const cx = classNames.bind(styles);
const { confirm } = Modal;
const checkSvg = 'https://qzz-static.forwe.store/evaluation-mng/imgs/qcp_mng_recruit_hook.svg';
const Scale = ({ setStampsNum }: propsType) => {
  const [data, setData] = useState<IExamTemplateList[]>([]);
  const [selectScale, setSelectScale] = useState<number[]>([]);
  const [priceTotal, setPriceTotal] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const { dispatch } = useContext(CountContext);

  const qcp_user = JSON.parse(sessionStorage.getItem('QCP_B_USER') || '{}');
  const onSelectScale = (index: number) => {
    // const dataArr = selectScale;
    const priceTotalCopy: number = data[index].examCouponCommodityDetail.pointPrice;
    // if (dataArr.includes(data[index].id)) {
    //   const delIdx = dataArr.indexOf(data[index].id)
    //   dataArr.splice(delIdx, 1);
    //   priceTotalCopy -= data[index].examCouponCommodityDetail.pointPrice
    // } else {
    //   priceTotalCopy += data[index].examCouponCommodityDetail.pointPrice
    //   dataArr.push(data[index].id)
    // }
    setSelectScale([data[index].id]);
    setPriceTotal(priceTotalCopy);
    setStampsNum && setStampsNum(priceTotalCopy, data[index].type)
  };

  const getExamTemplate = () => {
    getExamTemplateList({
      fromType: 1
    }).then((res: IBack) => {
      const { code, data } = res;
      if (code === 1) {
        setData(data);
      }
    })
  }

  const onUnlock = (data: IExamTemplateList) => {
    const title = data.type === 'MBTI' ? 'MBTI' : data.type === 'PDP' ? 'PDP'
      : data.type === 'CA' ? '职业锚' : data.type === 'CPI' ? '人格魅力' : data.type === 'DISC' ? 'DISC' : ''
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
            'scale_unlock_mbti_o': data.type === 'MBTI_O',
            'scale_unlock_pdp': data.type === 'PDP',
            'scale_unlock_ca': data.type === 'CA',
            'scale_unlock_cpi': data.type === 'CPI',
            'scale_unlock_disc': data.type === 'DISC',
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
  const openDrawer = (item: any) => {
    setVisible(true);
    console.log(item, 'item');
  };
  const closeDrawer = () => {
    setVisible(false);
  };
  useEffect(() => {
    getExamTemplate();
  }, [])
  return <div className={styles.scale_wrap}>
    {
      data.map((v: IExamTemplateList, index: number) => {
        const title: titleType = {
          'PDP': 'PDP',
          'MBTI': 'MBTI-专业版',
          'MBTI_O': 'MBTI-普通版',
          'CA': '职业锚',
          'CPI': '人格魅力',
          "DISC": "DISC",
          'XD-01': '职业胜任力',
          'XD-02': '价值观测评',
          'XD-03': '康帕斯价值观',
        }
        // const title = v.type === 'MBTI' ? 'MBTI' : v.type === 'PDP' ? 'PDP'
        //   : v.type === 'CA' ? '职业锚' : v.type === 'CPI' ? '人格魅力' : ''
        if (v.isBuy) {
          return <div
            className={cx({
              'scale_item': true,
              'scale_mbti': v.type === 'MBTI' || v.type === 'MBTI_O',
              'scale_pdp': v.type === 'PDP',
              'scale_career': v.type === 'CA',
              'scale_personality': v.type === 'CPI',
              'scale_disc': v.type === 'DISC',
              'scale_xd': v.type === 'XD-01',
              'scale_xd_value': v.type === 'XD-02',
              'scale_kps': v.type === 'XD-03',
              'selected': selectScale?.includes(v.id)
            })}
            onClick={() => onSelectScale(index)}
            key={v.id}
          >
            <div className={styles.scale_item_select}>
              {
                selectScale?.includes(v.id) ? <img src={checkSvg} alt='check' /> : null
              }
            </div>
            <div className={styles.scale_item_title}>
              {title[v.type]}
            </div>
            <Tooltip title={v.includeText} placement='bottom'>
              <div className={styles.scale_item_content}>
                {/* {v.title.split('（')[0]} */}
                {v.includeText}
              </div>
            </Tooltip>
            {/* <div
              onClick={(e) => {
                e.stopPropagation();
                openDrawer(v)
              }}
              className={styles.scale_item_introduce}
            >
              查看介绍&gt;
            </div> */}
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
                {title[v.type]}
              </div>
              <Tooltip title={v.includeText}>
                <div className={styles.scale_item_content}>
                  {v.includeText}
                </div>
              </Tooltip>
              <div onClick={() => onUnlock(v)} className={styles.scale_item_mark}>
                <span>点击解锁</span>
              </div>
            </div>
          )
        }
      })
    }
    <Introduce visible={visible} closeDrawer={closeDrawer} />
  </div>
}

export default Scale;
