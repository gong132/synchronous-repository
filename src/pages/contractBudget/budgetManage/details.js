import React from "react";
import { Descriptions } from "antd";

import GlobalSandBox from "@/components/commonUseModule/globalSandBox";
import budget_xq from '@/assets/icon/modular_xq.svg'
import budget_log from '@/assets/icon/modular_czrz.svg'

const Index = props => {
  const detailsList = [
    { span: 1, required: true, name: '预算编号', value: '111111' },
    { span: 1, required: false, name: '项目名称', value: '111111' },
    { span: 1, required: false, name: '需求部门', value: '111111' },
    { span: 1, required: false, name: '所属集群或板块', value: '111111' },
    { span: 1, required: false, name: '预计立项时间', value: '111111' },
    { span: 1, required: false, name: '预算总金额', value: '111111' },
    { span: 1, required: false, name: '硬件预算金额', value: '111111' },
    { span: 1, required: false, name: '软件预算金额', value: '111111' },
    { span: 1, required: true, name: '项目类型', value: '111111' },
    { span: 1, required: true, name: '预算类型', value: '111111' },
    { span: 1, required: false, name: '承建团队', value: '111111' },
    { span: 1, required: false, name: '录入人', value: '111111' },
    { span: 3, required: false, name: '录入时间', value: '111111' },
    { span: 3, required: false, name: '项目描述', value: '111111' },
  ]
  return (
    <div className="main">
      <GlobalSandBox
        img={budget_xq}
        title="预算详情"
      >
        <Descriptions column={3} bordered>
          {
            detailsList.map((v, i) => (
              <Descriptions.Item
                key={i.toString()}
                span={v.span}
                label={<>{v.required && <span style={{ color: 'red' }}>*</span>}预算编号</>}
              >
                {v.value}
              </Descriptions.Item>
            ))
          }
        </Descriptions>
      </GlobalSandBox>
      <GlobalSandBox
        img={budget_log}
        title="操作日志"
        sandboxStyle={{ marginTop: 16 }}
      >
          操作日志
      </GlobalSandBox>
    </div>
  )
};
export default Index
