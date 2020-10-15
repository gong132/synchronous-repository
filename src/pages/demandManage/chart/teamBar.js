import React, { memo, useEffect } from 'react';
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import echarts from 'echarts';

const isEqual = (preProps, nextProps) => preProps.demandTeamList === nextProps.demandTeamList;
const Index = memo(props => {
  const { demandTeamList } = props;

  const initChart = () => {
    const element = document.getElementById('teamBar');
    const myChart = echarts.init(element);
    const option = {
      color: ['#E96C5B'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'line', // 默认为直线，可选为：'line' | 'shadow'
        },
        backgroundColor: "#fff",
        textStyle: {
          color: "#000"
        },
      },
      xAxis: [
        {
          type: 'category',
          data: demandTeamList.map(v => v.userName),
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#909399',
            },
          },
        },
      ],
      grid: {
        top: 30,
        bottom: 60,
      },
      yAxis: [
        {
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#B0BAC9',
            },
          },
          splitLine: {
            show: false,
          },
          min: 0,
          max: 10,
        },
      ],
      series: [
        {
          name: '数量',
          type: 'bar',
          barWidth: 25,
          itemStyle: {
            barBorderRadius: [15, 15, 0, 0],
          },
          data: demandTeamList.map(v => v.demandCount),
        },
      ],
    };
    myChart.setOption(option);
  };

  useEffect(() => {
    initChart();
  });
  return (
    <GlobalSandBox title="团队成员" sandboxStyle={{ height: 400 }}>
      <div id="teamBar" style={{ width: '100%', height: 350 }} />
    </GlobalSandBox>
  );
}, isEqual);

export default Index;
