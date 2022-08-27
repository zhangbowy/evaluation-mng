import { debounce, deepClone } from '@/utils/utils';
import { Input, Modal, Checkbox, Col, Row, Tag, Empty } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { useState, forwardRef, useImperativeHandle, MouseEvent, useRef, ChangeEvent } from 'react'
import { ICurSelectTag, IFilterList } from '../type';
import styles from './index.module.less'

type IPropsParams = {
    getSelectTags: (arr: IFilterList[]) => void
}
const AddTags = forwardRef((props: IPropsParams, ref) => {
    const tags = [
        { name: '标签一1', id: 1 },
        { name: '标签一2', id: 2 },
        { name: '标签一4', id: 3 },
        { name: '标签一5', id: 4 },
        { name: '标签一7', id: 5 },
        { name: '标签一8', id: 6 },
        { name: '标签一45', id: 7 },
        { name: '标签一34', id: 8 },
        { name: '标签一12', id: 9 },
        { name: '标签一123', id: 10 },
        { name: '标签一413', id: 11 },
        { name: '标签一43', id: 12 },
        { name: '标签一67', id: 13 },
        { name: '标签一535', id: 14 },
        { name: '标签一54', id: 15 },
        { name: '标签一347', id: 16 },
        { name: '标签一87', id: 17 },
        { name: '标签一678', id: 18 },
        { name: '标签一77', id: 19 },
        { name: '标签一55', id: 20 },
        { name: '标签一88', id: 21 },
    ]
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // 弹窗显示
    const [filterList, setFilterList] = useState<IFilterList[]>(tags)
    const [inputValue, setInputValue] = useState<string>()
    const [curSelectTags, setCurSelectTags] = useState<IFilterList[]>([]);

    useImperativeHandle(ref, () => ({
        onOpenClick
    }))
    // 弹窗打开事件
    const onOpenClick = (item: IFilterList[]) => {
        setIsModalVisible(true);
        setCurSelectTags(item)
    };
    // 确认
    const handleOk = () => {
        props.getSelectTags(curSelectTags)
        setIsModalVisible(false);
    }
    // 删除标签
    const preventDefault = (e: MouseEvent<HTMLElement>, id: number) => {
        e.preventDefault()
        const curIndex = curSelectTags.findIndex(res => res.id == id)
        curSelectTags.splice(curIndex, 1)
        setCurSelectTags([...curSelectTags])
    }
    // 关闭回调
    const onCloseCallback = () => {
        setIsModalVisible(false)
        setInputValue('')
        setCurSelectTags([])
    }
    // 搜索
    const search = debounce((e: ChangeEvent<HTMLInputElement>) => {
        const filterArr = tags.filter(res => res.name.indexOf(e.target.value as string) > -1)
        setFilterList(filterArr)
        setInputValue(e.target.value)
    })
    // checked
    const onCheckboxClick = (e: CheckboxChangeEvent, index: number) => {
        const arr = []
        const curIndex = curSelectTags.findIndex(res => res.id == e.target.value.id)
        if (curIndex > -1) {
            curSelectTags.splice(curIndex, 1)
        } else {
            arr.push({
                name: e.target.value.name,
                id: e.target.value.id,
                checked: e.target.checked
            })
        }
        // !e.target.value.checked && curSelectTags.splice(index, 1)
        setCurSelectTags([...curSelectTags, ...arr])
    }
    return (
        <Modal width={684} title="添加标签" visible={isModalVisible} onOk={handleOk} onCancel={onCloseCallback}>
            <div className={styles.modal_wrapper}>
                <div className={styles.modal_left}>
                    <div className={styles.modal_lefHeader}>
                        <Input onChange={search} value={inputValue} allowClear placeholder="搜索标签" />
                    </div>
                    <div className={styles.modal_leftContent}>
                        {
                            filterList.length > 0 ?
                                <Row gutter={[0, 20]}>
                                    {
                                        filterList.map((item, index) => (
                                            <Col push={2} span={11} key={index}>
                                                <Checkbox
                                                    onChange={(e: CheckboxChangeEvent) => onCheckboxClick(e, index)}
                                                    value={item}
                                                    checked={curSelectTags.filter(res => res.id == item.id)[0]?.checked}
                                                >{item.name}</Checkbox>
                                            </Col>
                                        ))
                                    }
                                </Row>
                                : <Empty />
                        }
                    </div>
                </div>
                <div className={styles.modal_right}>
                    <div className={styles.modal_rightContent}>
                        {curSelectTags.length > 0 ?
                            curSelectTags.map((item: IFilterList) => (
                                <Tag key={item.id}
                                    closable
                                    onClose={(e: MouseEvent<HTMLElement>) => preventDefault(e, item.id)}>
                                    {item.name}
                                </Tag>
                            ))
                            : '请在左侧选择价值观标签'}
                        {/* {Object.keys(curSelectTagsValue).length > 0 ?
                            Object.keys(curSelectTagsValue).map((item: string) => (
                                <Tag key={item} closable onClose={(e: MouseEvent<HTMLElement>) => preventDefault(e, item)}>
                                    {curSelectTagsValue[item].value}
                                </Tag>
                            ))
                            : '请在左侧选择价值观标签'} */}
                    </div>
                </div>
            </div>
        </Modal>
    )
})
AddTags.displayName = 'AddTags'

export default AddTags