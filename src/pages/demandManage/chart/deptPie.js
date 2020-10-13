import React, { memo, useEffect } from 'react';
import { withRouter } from 'umi/index';
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import echarts from 'echarts';

const isEqual = (preProps, nextProps) =>
  preProps.demandDeptInfo?.data === nextProps.demandDeptInfo?.data;

function throttle(func, wait, ...args) {
  let timeout;
  return function() {
    const context = this;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args)
      }, wait)
    }
  }
}

const Index = memo(
  withRouter(props => {
    const { demandDeptInfo, handleQueryDemandInfo, handleSetDeptId } = props;


    const handleOk = id => {
      handleSetDeptId(id)
      handleQueryDemandInfo({
        currentNumber: demandDeptInfo.currentNumber,
        deptId: id,
      })
    }

    const initChart = () => {
      const element = document.getElementById('deptBar');
      const myChart = echarts.init(element);
      const legend = {
        orient: 'vertical',
        right: 0,
        bottom: 0,
        data: demandDeptInfo.data.map(v => v.name),
        selected: {},
        formatter: name => {
          const length = name?.length;
          return length > 10 ? `${name.substring(0, 9)}...` : name;
        },
      }
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
          formatter: '访问来源 <br/>{b} : {c} ({d}%)'
        },
        grid: {
          tooltip: {
            trigger: 'item',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'line', // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: '访问来源 <br/>{b} : {c} ({d}%)'
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
            center: ["40%", "50%"],
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
              id: v.id
            })),
          },
        ],
      };
      option.legend = legend
      myChart.setOption(option, true, false, true);

      myChart.on('click', params => {
        let count = demandDeptInfo.currentNumber
        console.log(params, "params")
        if (demandDeptInfo.showOtherFlag && params?.name === "其他") {
          count += 10;
          handleQueryDemandInfo({
            currentNumber: count,
          })
        }
        throttle(handleOk(params.data.id), 2000);
      });
    }

    useEffect(() => {
      initChart();
    }, [demandDeptInfo?.data]);

    return (
      <GlobalSandBox title="需求所属部门" sandboxStyle={{ height: 400 }}>
        <div id="deptBar" style={{ width: '100%', height: 320 }} />
      </GlobalSandBox>
    );
  }),
  isEqual,
);

export default Index;
