import React from 'react'
import { Tooltip } from 'antd'
import styles from './ellipse.less'

const Ellipse = (props) => {
  const { text, className, style, onClick } = props
  console.log(style)
  return (
    <Tooltip overlayClassName='tooTipStyle' placement="top" title={text}>
      <div onClick={onClick} className={className} style={style}>
        <span className={styles.cusEllipse}>{text}</span>
      </div>
    </Tooltip>
  )
}

export default Ellipse