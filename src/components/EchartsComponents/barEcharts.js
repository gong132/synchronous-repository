import React, { PureComponent } from 'react'
import echarts from 'echarts/lib/echarts' //必须
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/chart/bar'

class Bar extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      sales: [5, 20, 36, 10, 10, 20, 10, 10, 10, 10],
    }
  }

  getOption = (sales) => {
    const { xAxis } = this.props
    const arr = []
    Array(xAxis.length).fill('').map((v, i) => {
      arr.push(Number(Math.ceil((Math.random() + i)) * 10))
    })
    // console.log(Number((Math.random()+i)*10))
    return {
      title: {
        text: '需求发起部门',
        textStyle: {
          color: '#2E384D',
          fontSize: 16,
        },
      },
      grid: {
        left: '5%',
        top: 58,
        right: '5%',
        bottom: '10%',
        tooltip: {
          backgroundColor: 'white',
          // color: 'black',
          // formatter: (params, ticket, callback) => {
          //   console.log(params, ticket)
          //   return ticket
          // }
          textStyle: {
            color: '#69707F'
          },
          extraCssText: 'box-hadow: 0px 3px 6px rgba(0, 0, 0, 0.16)'
        }
      },

      tooltip: {},
      // legend: {
      //   data: ['销量', '库存']
      // },
      xAxis: {
        type: 'category',
        dataMin: '5%',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#E9EBF1',
          },
        },
        axisTick: {
          show: false,
          alignWithLabel: true
        },
        axisLabel: {
          fontSize: 12,
          color: '#909399',
          margin: 12
        },
        data: xAxis
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: '#E9EBF1',
          },
        },
        axisTick: {
          show: false,
          length: 15,
        },
        axisLabel: {
          fontSize: 12,
          color: '#909399',
          margin: 12,
          formatter: (value, index) => {
            return index * 50
          }
        },
        type: 'value',
        splitNumber: 10,
      },
      series: [{
        name: '部门',
        type: 'bar',
        data: arr
      },
      ]
    }
  }

  render() {
    const { sales } = this.state;
    return (
      <div>
        <ReactEcharts option={this.getOption(sales)} />
      </div>
    )
  }

}

export default Bar