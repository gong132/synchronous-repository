import React from 'react'
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import budget_xq from '@/assets/icon/modular_xq.svg';
import { Descriptions } from 'antd'

const TeamDetail = () => {

  const detailList = [
    { span: 1, required: false, name: '团队ID', value: 'name', dataIndex: 'name' },
    { span: 1, required: false, name: '团队名称', value: 'str', dataIndex: 'deptName' },
    { span: 1, required: false, name: '团队经理', value: 'createTime', dataIndex: 'createTime' },
    { span: 3, required: false, name: '团队成员', value: 'updateTime', dataIndex: 'updateTime' },
  ];
  return (
    <GlobalSandBox
      title='团队详情'
      img={budget_xq}
    >
      <Descriptions column={3} bordered>
        {
          detailList.map((v, i) => (
            <Descriptions.Item
              key={i.toString()}
              span={v.span}
              label={
                <>
                  {v.required && <span style={{ color: 'red' }}>*</span>}
                  {v.name}
                </>
              }
            >
              {v.value}
            </Descriptions.Item>
          ))
        }
      </Descriptions>
    </GlobalSandBox>
  )
}

export default TeamDetail