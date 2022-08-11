import { Modal, Tag } from 'antd'
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { characterProportions, ITagsProps } from '../../type'
import styles from './index.module.less'

const LookAllTags = forwardRef((props: ITagsProps, ref) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [tagList, setTagList] = useState<characterProportions[]>([])
    const tagsColor = [
        'magenta',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geekblue',
        'purple',
    ]
    useImperativeHandle(ref, () => ({ openModal }))
    // 关闭
    const handleCancel = () => {
        setIsModalVisible(false)
    }
    // 打开
    const openModal = (item: characterProportions[]) => {
        setIsModalVisible(true)
        setTagList(item)
    }
    const onTagClick = (name: string) => {
        props.onTagClick(name)
        handleCancel()
    }
    return (
        <Modal width={'90%'} visible={isModalVisible} footer={false} onCancel={handleCancel}>
            {
                tagList.map((item: characterProportions) => {
                    const colorText = tagsColor[Math.floor(Math.random() * tagsColor.length)]
                    return (
                        <Tag className={styles.detail_distribution_tag} onClick={() => onTagClick(item.name)} color={colorText} key={item.name}>{item.name} x{item.value}</Tag>
                    )
                })
            }
        </Modal>
    )
})
LookAllTags.displayName = 'LookAllTags'
export default LookAllTags