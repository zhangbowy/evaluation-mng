import { Spin } from 'antd'
import React from 'react'
import styles from './index.module.less'

const Loading = (props: {
  children?: React.ReactNode
}) => {
  return (
    <div className={styles.loading}>
      <Spin size="large" />
      {props.children}
    </div>
  )
}

export default Loading