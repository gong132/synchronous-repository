import React, { useEffect } from 'react';
import echarts from 'echarts';
import {connect} from "dva";
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";

const Index = props => {
  const { dispatch, location: { query: { YEAR }}, budgetChart: { budgetTreeList } } = props;

  const handleQueryTreeList = params => {
    dispatch({
      type: "budgetChart/queryBudgetTreeData",
      payload: {
        year: YEAR,
        ...params,
      }
    })
  }


  const initChart = () => {
    const myChart = echarts.init(document.getElementById('budgetTree'));

    const option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: "#fff",
        textStyle: {
          color: "#000"
        }
      },
      series:[
        {
          type: 'tree',
          id: 0,
          name: "tree1",
          data: [{
            "name": "年度总预算额",
            "value" : budgetTreeList?.budgetTotalAmount,
            "children": budgetTreeList?.tree || []
          }],
          roam: true,
          top: 0,
          left: '10%',
          bottom: '1%',
          right: '20%',

          itemStyle: {
            borderColor: "#606265"
          },
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            formatter: rows => {
              const findLine = rows?.data?.number ? rows?.data?.number.split("-") : []
              if (findLine.length === 0) {
                return [`${rows?.name.length > 10 ? `${rows?.name.substring(0, 10)}...` : rows?.name}`, rows.value].join("\n")
              }
              if (findLine.length === 1) {
                return `${rows?.name.length > 10 ? `${rows?.name.substring(0, 10)}...` : rows?.name}: ${rows?.data?.number}`
              }
              if (findLine.length === 2) {
                return [`${rows?.name.length > 10 ? `${rows?.name.substring(0, 10)}...` : rows?.name}: ${rows?.data?.number || ""}`,
                  `立项金额: ${rows.value || 0}元`].join("\n")
              }
              if (findLine.length === 3) {
                return [`${rows?.name.length > 10 ? `${rows?.name.substring(0, 10)}...` : rows?.name}: ${rows?.data?.number || ""}`,
                  `合同成交额: ${rows.value || 0}元`].join("\n")
              }
              const arr = [`${rows?.name.length > 10 ? `${rows?.name.substring(0, 10)}...` : rows?.name}`, rows.value]
              return arr.join("\n")
            }
          },
          leaves: {
            label: {
              show: true,
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
              formatter: rows => {
                const findLine = rows?.data?.number ? rows?.data?.number.split("-") : []
                console.log(findLine, "findLine")
                if (findLine.length === 0) {
                  return [`${rows?.name.length > 10 ? `${rows?.name.substring(0, 10)}...` : rows?.name}`, rows.value].join("\n")
                }
                if (findLine.length === 1) {
                  return `${rows?.name.length > 10 ? `${rows?.name.substring(0, 10)}...` : rows?.name}: ${rows?.data?.number}`
                }
                if (findLine.length === 2) {
                  return [`${rows?.name.length > 10 ? `${rows?.name.substring(0, 10)}...` : rows?.name}: ${rows?.data?.number || ""}`,
                    `立项金额: ${rows.value || 0}元`].join("\n")
                }
                if (findLine.length === 3) {
                  return [`${rows?.name.length > 10 ? `${rows?.name.substring(0, 10)}...` : rows?.name}: ${rows?.data?.number || ""}`,
                    `合同成交额: ${rows.value || 0}元`].join("\n")
                }
                const arr = [`${rows?.name.length > 10 ? `${rows?.name.substring(0, 10)}...` : rows?.name}`, rows.value]
                return arr.join("\n")
              }
            }
          },

          // symbolSize: (value, params) => {
          //   if (isEmpty(params.data?.children)) {
          //     return 1
          //   }
          //   return 12
          // },
          symbolSize: 12,
          edgeShape: 'polyline',
          edgeForkPosition: '63%',
          initialTreeDepth: 3,
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    };
    myChart.setOption(option, true, false, true);
  };

  useEffect(() => {
    handleQueryTreeList()
  }, []);

  useEffect(() => {
    initChart();
  }, [budgetTreeList]);

  console.log(budgetTreeList, "budgetTreeList")
  const height = document.body.clientHeight - 125
  return (
    <GlobalSandBox title="年度总预算树形图">
      <div id="budgetTree" style={{ width: 'auto', height }} />
    </GlobalSandBox>
  )
}

export default connect(
  ({
     budgetChart,
     loading,
   }) => ({
    budgetChart,
    loading: loading.models.budgetChart,
  }))(Index)
