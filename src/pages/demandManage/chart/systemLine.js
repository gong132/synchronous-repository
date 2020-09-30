import React, {memo} from "react";
import { LineChart } from "@/components/Charts";
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";

const isEqual = (preProps, nextProps) => {
  if (preProps.demandSystemList !== nextProps.demandSystemList) return false
  return true
}

const Index = memo(props => {
  const { demandSystemList } = props;
  const salesBarData = demandSystemList && demandSystemList.map(v => ({
    x: v.systemName,
    y: v.demandCount,
  }))
  return (
    <GlobalSandBox
      title="所属系统"
      sandboxStyle={{ height: 400 }}
    >
      <LineChart
        height={320}
        data={salesBarData}
      />
    </GlobalSandBox>
  )
}, isEqual)

export default Index
