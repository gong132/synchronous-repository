import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts'
// import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/dataZoom'

class Bar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      sliderWidth: 0,
      barWidth: 0,
    }
  }

  componentDidMount = () => {
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
    let res = {}
    const dom = document.getElementById('stackBar')
    const myChart = echarts.init(dom)
    if (data.length > 0) {
      res = this.calc(10, data.length)
      const { w, sliderWidth } = res
      this.setState({
        barWidth: w,
        sliderWidth,
        data,
      }, () => {
        myChart.setOption(this.getOption(data, w, sliderWidth))
      })
      return myChart
    }
    myChart.setOption(this.getOption(data))
    return myChart
  }

  calc = (count, len) => {
    const dom = document.getElementById('stackBar')
    const iWidth = dom.offsetWidth
    // 两边占用的宽度
    const gridWidth = iWidth * 0.1
    // y轴占用的宽度, 30 是估值
    const yWidth = 12 + 30
    // 所有条数占用的margin
    const barMargin = count * 48
    // 初始展示的滑动条的宽度
    const w = (iWidth - (gridWidth + yWidth + barMargin)) / count
    const sliderWidth = count / len * 100
    return { w, sliderWidth }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let bool = false
    const len = nextProps.data.length
    if (len === 0) {
      return bool
    }

    if (len !== nextState.data.length) {
      bool = true
      this.handleGenBar(nextProps.data)
    }
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < len; i++) {
      if (nextProps.data[i] !== nextState.data[i]) {
        bool = true
        this.handleGenBar(nextProps.data)
      }
    }
    return bool
  }

  getOption = (data = [], barWidthProps, sliderWidthProps) => {
    const { barWidth = barWidthProps, sliderWidth = sliderWidthProps } = this.state
    const { title, barColor, cusConfigBool } = this.props
    const arr = []
    const actualMoney = []
    const xAxisName = []
    // eslint-disable-next-line compat/compat
    data.map((v,i) => {
      arr.push(Number(Math.ceil((Math.random() + i)) * 20))
      actualMoney.push(v.estAmount)
      xAxisName.push(v.pjName)
      return true
    })
    console.log(actualMoney,arr)
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

    const cusConfig = {
      dataZoom: [{
        show: cusConfigBool,
        start: 0,
        end: sliderWidth,
        height: 24,
        bottom: 0,
        throttle: 500,
        zoomOnMouseWheel: true
      }],
    }

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
      legend: {
        icon: 'circle',
        right: 10,
        bottom: '15%',
        orient: 'vertical',
        formatter: (name) => {
          return echarts.format.truncateText(name, 50, '14px Microsoft Yahei', '…');
        },
        tooltip: {
          show: true
        }
      },

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

      // toolbox: {
      //   feature: {
      //     dataZoom: {
      //       yAxisIndex: 'none'
      //     },
      //     restore: {},
      //     saveAsImage: {}
      //   }
      // },

      tooltip: {
        renderMode: 'html',
        formatter: params => {
          console.log(params)
          const {dataIndex} = params
          const markerOne = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#826AF9;"></span>`
          const markerTwo = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#D0AEFF;"></span>`
          const name = data[dataIndex].pjName
          const str = `${name}  <br />  ${markerOne} 立项金额（元）：${actualMoney[dataIndex]} <br />  ${markerTwo} 实际成交金额（元）：${arr[dataIndex]}`
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
            if(data.length < 10) {
              return echarts.format.truncateText(value, (10-data.length)*barWidth/data.length + barWidth+48, '14px Microsoft Yahei', '…');
            }
            return echarts.format.truncateText(value, barWidth+48, '14px Microsoft Yahei', '…');
            // return value.substr(0, 5) + '\n' + value.substr(5, value.length - 1)
          }
        },
        data: xAxisName,
      },
      yAxis: {
        type: 'value',
        ...commonConfig,
      },

      series: [{
        name: '立项金额',
        type: 'bar',
        stack: '总量',
        data: actualMoney,
        itemStyle: {
          barBorderRadius: [0, 0, 100, 100],
        },
        barWidth,
      },
      {
        name: '实际成交金额',
        type: 'bar',
        stack: '总量',
        data: arr,
        itemStyle: {
          barBorderRadius: [100, 100, 0, 0],
        },
        barWidth,
      },
      ],
      ...cusConfig,
    }
  }

  render() {
    return (
      <div id='stackBar' style={{ width: '100%', height: 440 }} />
    )
  }

}

export default Bar