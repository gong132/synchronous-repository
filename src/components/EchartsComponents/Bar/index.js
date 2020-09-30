import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts'
// import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/chart/bar'

class Bar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    const { handleClickBar, handleSlideBar, data } = this.props
    const myChart = this.handleGenBar(data)
    if (typeof handleClickBar === 'function') {
      myChart.on('click', handleClickBar)
    }
    if (typeof handleSlideBar === 'function') {
      myChart.on('dataZoom', handleSlideBar)
    }
    this.setState({
      data
    })
  }

  handleGenBar = (data) => {
    const dom = document.getElementById('bar')
    const myChart = echarts.init(dom)
    myChart.setOption(this.getOption(data))
    return myChart
  }

  shouldComponentUpdate(nextProps, nextState) {
    let bool = false
    if (nextProps.data.length !== nextState.length) {
      bool = true
      this.handleGenBar(nextProps.data)
    }
    const len = nextProps.data.length
    for (let i = 0; i < len; i++) {
      if (nextProps.data[i] !== nextState.data[i]) {
        bool = true
        this.handleGenBar(nextProps.data)
      }
    }
    return bool
  }

  getOption = (data=[]) => {
    const { title, barColor, cusConfig } = this.props
    const arr = []
    Array(data.length * 2).fill('').map((v, i) => {
      arr.push(Number(Math.ceil((Math.random() + i)) * 20))
    })
    // console.log(Number((Math.random()+i)*10))
    // x,y轴共同配置
    const commonConfig = {
      splitLine: {
        show: false
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 12,
        color: '#909399',
        margin: 12,
      },
      axisLine: {
        lineStyle: {
          color: '#E9EBF1',
        },
      },
    }

    // 

    return {
      title: {
        text: title,
        textStyle: {
          color: '#2E384D',
          fontSize: 16,
        },
      },
      textStyle: {
        color: '#69707F',
      },
      color: barColor,

      grid: {
        left: '5%',
        top: 58,
        right: '5%',
        bottom: '15%',
        tooltip: {
          backgroundColor: 'white',
          textStyle: {
            color: '#69707F'
          },
          extraCssText: 'box-hadow: 0px 3px 6px rgba(0, 0, 0, 0.16)'
        }
      },

      tooltip: {
        renderMode: 'html',
        formatter: params => {
          const str = `${params.name}  <br />  ${params.marker} 需求（个）  ${params.data}`
          return str
        }
      },

      xAxis: {
        type: 'category',
        ...commonConfig,
        axisLabel: {
          fontSize: 12,
          color: '#909399',
          margin: 12,
          interval: 0,
          formatter: value => {
            return echarts.format.truncateText(value, 50, '14px Microsoft Yahei', '…');
            // return value.substr(0, 5) + '\n' + value.substr(5, value.length - 1)
          }
        },
        data: data.concat(data),
      },
      yAxis: {
        type: 'value',
        ...commonConfig,
      },

      series: [{
        name: '部门',
        type: 'bar',
        data: arr,
        label: {
          show: true,
          position: 'top',
        },
        itemStyle: {
          barBorderRadius: [100, 100, 0, 0],
        },
        barWidth: 28,
      },
      ],
      ...cusConfig
    }
  }

  render() {
    return (
      <div id='bar' style={{ width: '100%', height: 440 }}>
        {/* <ReactEcharts option={this.getOption(sales)} /> */}
      </div>
    )
  }

}

export default Bar