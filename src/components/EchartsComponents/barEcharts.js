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
      arr.push(Number(Math.ceil((Math.random() + i)) * 20))
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
      color: ['#FE9D4E'],
      grid: {
        left: '5%',
        top: 58,
        right: '5%',
        bottom: '15%',
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

      tooltip: {
        renderMode: 'html',
        formatter: params => {
          console.log(params)
          const str = `${params.name}  <br />  ${params.marker} 需求（个）  ${params.data}`
          return str
        }
      },
      xAxis: {
        type: 'category',
        dataMin: '5%',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#E9EBF1',
          },
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false,
          alignWithLabel: true
        },
        axisLabel: {
          fontSize: 12,
          color: '#909399',
          margin: 12,
          interval: 0,
          formatter: value => {
            console.log(value)
            return value.substr(0,5)+'\n'+value.substr(5, value.length-1)
          }
        },
        data: xAxis
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: '#E9EBF1',
          },
        },
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
        type: 'value',
      },
      series: [{
        name: '部门',
        type: 'bar',
        data: arr,
        label: {
          show: true,		//开启显示
          position: 'top',	//在上方显示
          textStyle: {	    //数值样式
            color: '#69707F',
          }
        },
        itemStyle: {
          barBorderRadius: [20, 20, 0, 0],
        },
        barWidth: 28,
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