import React from 'react'
import { Tooltip } from 'antd'
import classnames from 'classnames'
import styles from './ellipse.less'

const Ellipse = (props) => {
  const { text, className, style, onClick } = props
  return (
    <div onClick={onClick} className={classnames(className, styles.cusEllipse)} style={style}>
      <Tooltip mouseEnterDelay={0.5} overlayClassName='tooTipStyle' placement="top" title={text}>
        <span>{text}</span>
      </Tooltip>
    </div>

  )
}

export default Ellipse