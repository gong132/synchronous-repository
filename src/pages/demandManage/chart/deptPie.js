import React, {memo} from "react";
import Pie from "@/components/Charts/Pie";

const isEqual = (preProps, nextProps) => {
  if (preProps.demandDeptInfo?.data !== nextProps.demandDeptInfo?.data) return false
  return true
}

const Index = memo(props => {
  const { demandDeptInfo } = props
  const salesPieData = demandDeptInfo?.data && demandDeptInfo?.data.map(v => ({
    ...v,
    x: v.name,
    y: Number(v.demandCount),
  }))

  console.log(salesPieData, "salesPieData")

  const handleClick = e => {
    console.log(e, "E")
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
}, isEqual)

export default Index
