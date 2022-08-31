import { Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { POSITION_SELECT, RENEW_POSITION } from '@/api/api';
import styles from './index.module.less';

interface Props {
    visible: boolean,
    item: TableType,
    setModalVisible: (modalVisible: boolean) => void,
    reloadList: () => void
};

interface TableType {
    userId: string;
    name: string;
    positionId: number | null;
    positionName: string | null;
    isDimission: number;
    isDimissionStr: string;
    hiredDate: number;
    hiredDateStr: string | null;
    deptNames: string;
    deptIds: string;
    index?: number;
};

interface SelectType {
    description: string | null;
    id: number,
    name: string,
    tagIds: any,
    tags: any
}

const { Option } = Select;

const ModalEdit: React.FC<Props> = ({ visible, item, setModalVisible, reloadList }: Props) => {
    const [modalData, setModalData] = useState<TableType>(); //save modal data
    const [selectVal, setSelectVal] = useState<number>();
    const [selectList, setSelectList] = useState<Array<SelectType>>();

    useEffect(() => {
        if (visible) {
            setModalData(item);
        }
    }, [visible]);

    useEffect(() => {
        querySelect();
    },[])

    /**
     * query select option
     */
    const querySelect = async () => {
        const { code, data } = await POSITION_SELECT({});
        if (code === 1) {
            setSelectList(data)
        }
    }

    /**
     * handle ok event
     */
    const handleOk = () => {
        handleUpdatePosition();
    };

    /**
     * handle cancel event
     */
    const handleCancel = () => {
        setModalVisible(false);
    };

    /**
     * handle update position event
     */
    const handleUpdatePosition = async () => {
        let positionId = selectVal;
        let userId = item.userId;
        const { code } = await RENEW_POSITION({
            positionId,
            userId
        });
        if (code === 1) {
            setModalVisible(false);
            reloadList();
        }
    }

    /**
     * return select dom
     * @returns select dom
     */
    const SelectBox = (item:TableType) => {
        return (
            <Select placeholder='请选择' style={{ width: '100%' }} onChange={handleChange} value={item?.positionId}>
                {selectList?.map((el) => {
                    return <Option value={el.id} key={el.id}>{el.name}</Option>
                })}
            </Select>
        )
    };

    /**
     * handle select change event
     * @param val select val
     */
    const handleChange = (val: number) => {
        setSelectVal(val);
        console.log(val);
    }

    return (
        <>
            <Modal title="编辑职位" wrapClassName='Edit_modal' bodyStyle={{ padding: '15px 24px' }} visible={visible} onOk={handleOk} onCancel={handleCancel} maskClosable={false} okButtonProps={{ disabled: !Boolean(selectVal) }}>
                <p className={styles.Edit_title}>{modalData?.name}的职位</p>
                {SelectBox(item)}
            </Modal>
        </>
    );
};

export default ModalEdit;