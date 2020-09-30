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
    const { data } = this.props
    const myChart = this.handleGenPie()
    myChart.on('click', (params) => {
      console.log(params)
    })
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
    for (let i = 0; i < len; i++) {
      if (nextProps.data[i] !== nextState.data[i]) {
        bool = true
        this.handleGenPie(nextProps.data)
      }
    }
    return bool
  }

  getOption = (data = []) => {
    const { title, barColor, cusConfig } = this.props
    console.log(data)
    const arr = []
    const legendData = []
    data.map((v, i) => {
      if (v.name) {
        legendData.push(v.name)
        arr.push({
          name: v.name,
          value: Math.ceil((Math.random() + i) * 10)
        })
      }
    })
    return {
      title: {
        text: title,
        textStyle: {
          color: '#2E384D',
          fontSize: 16,
        },
      },

      color: ['#6395F9', '#62DAAB', '#657798', '#F6C022', '#E96C5B', '#6DC8EC', '#9967BD', '#299999', '#FE9D4E', '#F29DC8'],

      legend: {
        orient: 'vertical',
        icon: 'circle',
        right: 10,
        top: 20,
        bottom: 20,
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
          const str = `${params.name}  <br />  ${params.percent}%`
          return str
        }
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
            const str = `${params.name}:${params.value} ${params.percent}%`
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