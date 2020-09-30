import React, {memo} from "react";
import {Bar} from "@/components/Charts";
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";

const isEqual = (preProps, nextProps) => {
  if (preProps.demandTeamList !== nextProps.demandTeamList) return false
  return true
}
const Index = memo(props => {
  const { demandTeamList } = props;
  const salesBarData = demandTeamList && demandTeamList.map(v => ({
    x: v.userName,
    y: v.demandCount,
  }))
  return (
    <GlobalSandBox
      title="团队成员"
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
