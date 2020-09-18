import React, { PureComponent } from 'react'
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import msgIcon from '@/assets/icon/modular_xx.svg'

class ChartCard extends PureComponent {
  render() {
    return (
      <GlobalSandBox
        title='评论'
        img={msgIcon}
      >
        hh
      </GlobalSandBox>
    )
  }
}

export default ChartCard