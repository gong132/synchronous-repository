import React, { memo, useEffect } from 'react';
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import echarts from 'echarts';

const isEqual = (preProps, nextProps) => {
  if (preProps.demandSystemList !== nextProps.demandSystemList) return false;
  return true;
};

const Index = memo(props => {
  const { demandSystemList } = props;

  const initChart = () => {
    const element = document.getElementById('systemLine');
    const myChart = echarts.init(element);
    const option = {
      color: ['#FE9D4E'],
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
          boundaryGap: false,
          data: demandSystemList.map(v => v.systemName),
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
        },
      ],
      series: [
        {
          name: '数量',
          type: 'line',
          data: demandSystemList.map(v => v.demandCount),
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#FE9D4E', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(254, 157, 78, 0)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    };
    myChart.setOption(option);
  };

  useEffect(() => {
    initChart();
  });
  return (
    <GlobalSandBox title="所属系统" sandboxStyle={{ height: 400 }}>
      <div id="systemLine" style={{ width: '100%', height: 350 }} />
    </GlobalSandBox>
  );
}, isEqual);

export default Index;
