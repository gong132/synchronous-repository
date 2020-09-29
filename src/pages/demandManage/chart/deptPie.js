import React, {memo} from "react";
import Pie from "@/components/Charts/Pie";
import {withRouter} from "umi/index";

const isEqual = (preProps, nextProps) => {
  if (preProps.demandDeptInfo?.data !== nextProps.demandDeptInfo?.data) return false
  return true
}

const Index = memo(withRouter(props => {
  const { demandDeptInfo } = props
  const salesPieData = demandDeptInfo?.data && demandDeptInfo?.data.map(v => ({
    ...v,
    x: v.name,
    y: Number(v.demandCount),
  }))

  console.log(props, "salesPieData")

  const handleClick = e => {
    console.log(e, "E")

    props.history.push({
      pathname: '/demandManage/list',
      query: {
        id: "zhangsan",
      },
    });
  }
  return (
    <Pie
      hasLegend
      data={salesPieData}
      inner={0}
      height={300}
      onPlotClick={handleClick}
      geomLabel
    />
  )
}), isEqual)

export default Index
