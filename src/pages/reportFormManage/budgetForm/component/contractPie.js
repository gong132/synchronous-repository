import React, { memo, useEffect } from 'react';
import echarts from 'echarts';
import { withRouter } from 'umi/index';

const isEqual = (preProps, nextProps) =>
  preProps.budgetChartList?.contractData === nextProps.budgetChartList?.contractData;

const Index = memo(withRouter(props => {
    const { budgetChartList: { contractData } } = props;

    const initChart = () => {
      const myChart = echarts.init(document.getElementById('contractPie'));

      const option = {
        color: [
          '#E96C5B',
          '#6F9BF6',
        ],
        legend: {
          orient: 'vertical',
          right: 20,
          bottom: 0,
          icon: 'circle',
          data: contractData.map(v => v.name),
          selected: {},
          formatter: name => {
            const length = name?.length;
            return length > 10 ? `${name.substring(0, 9)}...` : name;
          },
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
          },
          backgroundColor: "#fff",
          textStyle: {
            color: "#000"
          },
          formatter: '访问来源 <br/>{b} : {c} ({d}%)',
        },
        grid: {
          tooltip: {
            trigger: 'item',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'line', // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: '访问来源 <br/>{b} : {c} ({d}%)',
          },
        },
        series: [
          {
            type: 'pie',
            barWidth: 25,
            minShowLabelAngle: 0.0001,
            itemStyle: {
              barBorderRadius: [15, 15, 0, 0],
            },
            center: ['45%', '50%'],
            label: {
              show: true,
              align: 'left',
              width: 100,
              formatter: rows => `${rows?.data?.name} : ${rows?.data?.value}`
            },
            data: contractData,
          },
        ],
      };
      myChart.setOption(option, true, false, true);
    };

    useEffect(() => {
      initChart();
    }, [contractData]);

    return (
      <div id="contractPie" style={{ width: '100%', height: 320 }} />
    );
  }),
  isEqual,
);

export default Index;
