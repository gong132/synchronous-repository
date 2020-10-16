import React, { memo, useEffect } from 'react';
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import echarts from 'echarts';

const isEqual = (preProps, nextProps) => preProps.demandStatusList === nextProps.demandStatusList;
const Index = memo(props => {
  const { demandStatusList } = props;

  const initChart = () => {
    const element = document.getElementById('statusBar');
    const myChart = echarts.init(element);
    const option = {
      color: ['#3398DB'],
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
      xAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#909399',
          },
        },
        splitLine: {
          show: false,
        },
        min: 0,
        max: 100,
        splitNumber: 10,
      },
      grid: {
        top: 30,
        bottom: 60,
        left: 90,
        right: 50,
      },
      yAxis: {
        type: 'category',
        data: demandStatusList.map(v => v.boardName),
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
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          barWidth: '35%',
          data: demandStatusList.map(v => v.demandCount),
        },
      ],
    };
    myChart.setOption(option);
  };

  useEffect(() => {
    initChart();
  });
  return (
    <GlobalSandBox title="需求状态" sandboxStyle={{ height: 400 }}>
      <div id="statusBar" style={{ width: '100%', height: 350 }} />
    </GlobalSandBox>
  );
}, isEqual);

export default Index;
