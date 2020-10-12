import React, { memo, useEffect } from 'react';
import { withRouter } from 'umi/index';
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import echarts from 'echarts';

const isEqual = (preProps, nextProps) =>
  preProps.demandDeptInfo?.data === nextProps.demandDeptInfo?.data;
const Index = memo(
  withRouter(props => {
    const { demandDeptInfo } = props;

    console.log(demandDeptInfo, 'demandDeptInfo');
    const initChart = () => {
      const element = document.getElementById('deptBar');
      const myChart = echarts.init(element);
      const option = {
        color: [
          '#62DAAB',
          '#826AF9',
          '#6395F9',
          '#F6C022',
          '#E96C5B',
          '#6DC8EC',
          '#9967BD',
          '#299999',
          '#FE9D4E',
          '#F29DC8',
          '#657798',
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: 30,
          bottom: 60,
          left: 10,
          right: 100,
        },
        legend: {
          orient: 'vertical',
          right: 10,
          data: demandDeptInfo.data.map(v => v.name),
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            barWidth: 25,
            stillShowZeroSum: true,
            itemStyle: {
              barBorderRadius: [15, 15, 0, 0],
            },
            label: {
              show: true,
              formatter: rows => {
                let labelValue = '';
                if (String(rows?.data?.value) !== '0') {
                  labelValue = `${rows?.data?.name} : ${rows?.data?.value}`;
                }
                return labelValue;
              },
            },
            data: demandDeptInfo.data.map(v => ({
              value: v.demandCount,
              name: v.name,
            })),
          },
        ],
      };
      myChart.setOption(option);
    };

    useEffect(() => {
      initChart();
    });

    return (
      <GlobalSandBox title="需求所属部门" sandboxStyle={{ height: 400 }}>
        <div id="deptBar" style={{ width: '100%', height: 350 }} />
      </GlobalSandBox>
    );
  }),
  isEqual,
);

export default Index;
