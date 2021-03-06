import React from 'react'
import { Tooltip, Icon } from 'antd'

const ListOptBtn = (props) => {
  const { title, style, onClick, icon } = props

  return (
    <Tooltip mouseEnterDelay={0.5} overlayClassName='tooTipStyle' placement="top" title={title}>
      <Icon
        onClick={onClick}
        style={style}
        component={icon}
      />
    </Tooltip>
  )
}

export default ListOptBtn