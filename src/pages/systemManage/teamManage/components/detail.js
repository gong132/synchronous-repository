import React, { useEffect, useState } from 'react'
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import budgetIcon from '@/assets/icon/modular_xq.svg';
import { Descriptions } from 'antd'
import {
  getParam,
  // getUserInfo
} from '@/utils/utils';
import { connect } from 'dva'
import _ from 'lodash'

const TeamDetail = (props) => {
  const { teamManage } = props
  const { teamList = [] } = teamManage
  const [info, setInfo] = useState({})
  const {
    id,
    name,
    teamHeaderName,
    personnels,
  } = info
  console.log(teamList, info)
  useEffect(() => {
    const teamId = getParam('teamId')
    const i = _.findIndex(teamList.list, t => String(t.id) === String(teamId))
    if (i < 0) return true
    setInfo(teamList.list[i])
  }, [])
  const detailList = [
    { span: 1, required: false, name: '团队ID', value: id, dataIndex: 'id' },
    { span: 1, required: false, name: '团队名称', value: name, dataIndex: 'name' },
    { span: 1, required: false, name: '团队经理', value: teamHeaderName, dataIndex: 'teamHeaderName' },
    { span: 3, required: false, name: '团队成员', value: personnels, dataIndex: 'personnels' },
  ];
  return (
    <GlobalSandBox title="团队详情" img={budgetIcon}>
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
              {console.log(v.value)}
              {
                (_.isArray(v.value) && !_.isEmpty(v.value))
                  ? v.value.map(n => <span>{`${n} `}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>)
                  : v.value
              }
            </Descriptions.Item>
          ))
        }
      </Descriptions>
    </GlobalSandBox>
  );
};

export default connect(({ teamManage }) => ({
  teamManage
}))(TeamDetail)
