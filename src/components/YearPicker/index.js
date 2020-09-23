import React, { Component } from 'react';
import { DatePicker } from 'antd';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      visible: false,
    }
  }

  handlePanelChange = (value) => {
    const { onChange } = this.props;
    onChange && onChange(value)
    this.setState({visible: false})
  }

  handleOpenChange = (status) => {
    console.log(status, 'status')
    if(status){
      this.setState({visible: true})
    } else {
      this.setState({visible: false})
    }
  }

  clearValue = () => {
    const { onChange } = this.props;
    onChange && onChange(null)
  }

  render() {
    const { value = null } = this.props;
    const { visible } = this.state;
    return (
      <div>
        <DatePicker
          {...this.props}
          value={value}
          open={visible}
          mode="year"
          placeholder='请选择年份'
          format="YYYY"
          onOpenChange={this.handleOpenChange}
          onPanelChange={this.handlePanelChange}
          onChange={this.clearValue}
        />
      </div>
    );
  }
}
