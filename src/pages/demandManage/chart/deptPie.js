import React, {memo} from "react";
import Pie from "@/components/Charts/Pie";
import {withRouter} from "umi/index";
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";

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

  const handleClick = e => {
    console.log(e, "E")


  }
  return (
    <GlobalSandBox
      title="需求所属部门"
      sandboxStyle={{ height: 400 }}
    >
      <Pie
        hasLegend
        data={salesPieData}
        inner={0}
        height={320}
        onPlotClick={handleClick}
        geomLabel
      />
    </GlobalSandBox>
  )
}), isEqual)

export default Index
