import { tagsColor } from '@/config/management.config'
import { Empty, Modal, Tag } from 'antd'
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { characterProportions, ITagsProps } from '../../type'
import styles from './index.module.less'

const LookAllTags = forwardRef((props: ITagsProps, ref) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [tagList, setTagList] = useState<(characterProportions | string)[]>([])
    useImperativeHandle(ref, () => ({ openModal }))
    // 关闭
    const handleCancel = () => {
        setIsModalVisible(false)
    }
    // 打开
    const openModal = (item: (characterProportions | string)[]) => {
        setIsModalVisible(true)
        setTagList(item)
    }
    const onTagClick = (name: string) => {
        // props.onTagClick(name)
        handleCancel()
    }
    return (
        <Modal width={'30%'} visible={isModalVisible} footer={false} onCancel={handleCancel}>
            <div className={styles.detail_distribution_wrapper}>
                {
                    tagList.map((item: (characterProportions | string), index) => {
                        const str = index + '';
                        const curIndex = str.length < 2 ? str : str.slice(str.length - 1, str.length);
                        const color = tagsColor[curIndex].color;
                        const background = tagsColor[curIndex].bg;
                        return (
                            <span key={typeof item == 'string' ? item : item.name} className={styles.detail_distribution_tag} style={{ color, background }}>{typeof item == 'string' ? item : item.name}</span>
                        )
                    })
                }
            </div>

        </Modal>
    )
})
LookAllTags.displayName = 'LookAllTags'
export default LookAllTags