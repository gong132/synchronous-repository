// 基础饼图
import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'

class Pie extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    const { data, handleClickLegend, handleClickPie } = this.props
    const myChart = this.handleGenPie()
    if (typeof handleClickPie === 'function') {
      myChart.on('click', handleClickPie)
    }
    if (typeof handleClickLegend === 'function') {
      myChart.on('legendselectchanged', handleClickLegend)
    }
    this.setState({
      data
    })
  }

  handleGenPie = (data) => {
    const dom = document.getElementById('pie')
    const myChart = echarts.init(dom)
    myChart.setOption(this.getOption(data))
    return myChart
  }

  shouldComponentUpdate(nextProps, nextState) {
    let bool = false
    if (nextProps.data.length !== nextState.length) {
      bool = true
      this.handleGenPie(nextProps.data)
    }
    const len = nextProps.data.length
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < len; i++) {
      if (nextProps.data[i] !== nextState.data[i]) {
        bool = true
        this.handleGenPie(nextProps.data)
      }
    }
    return bool
  }

  getOption = (data = []) => {
    const { title, barColor } = this.props
    const arr = []
    const legendData = []
    data.map((v, i) => {
      if (v.name) {
        legendData.push(v.name)
        arr.push({
          name: v.name,
          value: v.count || null
        })
      }
      return true
    })
    return {
      title: {
        text: title,
        textStyle: {
          color: '#2E384D',
          fontSize: 16,
        },
      },

      color: barColor || ['#6395F9', '#62DAAB', '#657798', '#F6C022', '#E96C5B', '#6DC8EC', '#9967BD', '#299999', '#FE9D4E', '#F29DC8'],

      legend: {
        orient: 'vertical',
        icon: 'circle',
        right: 10,
        // top: 200,
        bottom: '5%',
        textStyle: {
          color: '#69707F'
        },
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
        bottom: '5%',
      },

      tooltip: {
        renderMode: 'html',
        formatter: params => {
          const str = `${params.name}  <br />  ${Math.ceil(params.percent)}%`
          return str
        },
        backgroundColor: 'white',
        textStyle: {
          color: '#69707F'
        },
        extraCssText: 'box-hadow: 0px 3px 6px rgba(0, 0, 0, 0.16)'
      },

      series: [{
        name: '集群',
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: arr,
        label: {
          color: '#69707F',
          show: true,
          formatter: (params) => {
            const str = `${params.name}: ${params.value} ${Math.ceil(params.percent)}%`
            return str
          },
          // position: 'inside'
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: '#C2C5CC'
          },
        }
      },
      ],
    }
  }

  render() {
    return (
      <div id='pie' style={{ width: '100%', height: 440 }} />
    )
  }
}

export default Pie