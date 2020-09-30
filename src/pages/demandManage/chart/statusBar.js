import React, {memo} from "react";
import {Bar} from "@/components/Charts";
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";

const isEqual = (preProps, nextProps) => {
  if (preProps.demandStatusList !== nextProps.demandStatusList) return false
  return true
}
const Index = memo(props => {
  const { demandStatusList } = props;
  const salesBarData = demandStatusList && demandStatusList.map(v => ({
    x: v.boardName,
    y: v.demandCount,
  }))
  return (
    <GlobalSandBox
      title="需求状态"
      sandboxStyle={{ height: 400 }}
    >
      <Bar
        height={320}
        data={salesBarData}
      />
    </GlobalSandBox>
  )
}, isEqual)

export default Index
