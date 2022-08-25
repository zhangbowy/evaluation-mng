import { Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.module.less';

interface Props {
    visible: boolean,
    item: TableType,
    setModalVisible: any
};

interface TableType {
    userId: string;
    name: string;
    positionId: number | null;
    isDimission: number;
    hireDate: number;
    deptNames: string;
    deptIds: string;
    index: number;
};

const { Option } = Select;

const ModalEdit: React.FC<Props> = ({ visible, item, setModalVisible }: Props) => {
    const [modalData, setModalData] = useState<TableType>(); //save modal data

    useEffect(() => {
        if (visible) {
            setModalData(item);
        }
    }, [visible])

    const handleOk = () => {
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const SelectBox = () => {
        return (
            <Select placeholder='请选择' style={{ width: '100%' }} onChange={handleChange}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
            </Select>
        )
    };

    const handleChange = (val: string) => {
        console.log(val);
    }

    return (
        <>
            <Modal title="编辑职位" wrapClassName='Edit_modal' bodyStyle={{ padding: '15px 24px' }} visible={visible} onOk={handleOk} onCancel={handleCancel} maskClosable={false}>
                <p className={styles.Edit_title}>{modalData?.name}的职位</p>
                <SelectBox />
            </Modal>
        </>
    );
};

export default ModalEdit;