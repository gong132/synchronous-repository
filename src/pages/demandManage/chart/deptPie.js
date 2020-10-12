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
          trigger: 'item',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: rows => `名称: ${rows?.name} <br /> 占比: ${rows?.percent}%`,
        },
        grid: {
          top: 30,
          left: -30,
          bottom: 20,
          tooltip: {
            trigger: 'item',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'line', // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: rows => `名称: ${rows?.name} <br /> 占比: ${rows?.percent}%`,
          },
        },
        legend: {
          orient: 'vertical',
          right: 0,
          bottom: 15,
          data: demandDeptInfo.data.map(v => v.name),
          formatter: name => {
            // const txt = []
            // for (let i = 0; i < Math.ceil(name.length / 6); i += 1) {
            //   txt.push(name.substring(6 * i, 6 * (i+1)))
            // }
            const length = name?.length;
            return length > 10 ? `${name.substring(0, 9)}...` : name;
            // return txt.join('\n')
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
            label: {
              show: true,
              formatter: rows => {
                if (String(rows?.data?.value) !== '0') {
                  return `${rows?.data?.name} : ${rows?.data?.value}`;
                }
                return null;
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
      myChart.on('click', params => {
        console.log(params, 'params');
      });
      myChart.on('legendselectchanged', function(params) {
        // 获取点击图例的选中状态
        const isSelected = params.selected[params.name];
        // 在控制台中打印
        console.log(isSelected ? '选中了' : '取消选中了', params.name);
        // 打印所有图例的状态
        console.log(params.selected);
      });
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
