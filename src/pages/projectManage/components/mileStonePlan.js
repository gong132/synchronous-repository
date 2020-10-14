import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash'
import StandardTable from '@/components/StandardTable';
import { TableColumnHelper } from '@/utils/helper';
import { connect } from 'dva'
import {
  Form,
} from 'antd'

@connect(({ project }) => ({
  project,
}))
class MilePlan extends PureComponent {
  render() {
    const { project } = this.props
    const { milePlanList, planStageListMap } = project
    const proColumns = [
      {
        title: '里程碑阶段',
        dataIndex: 'stage',
        key: 'stage',
        render: (text, record) => {
          return planStageListMap[record.stage]
        }
      },
      {
        title: '里程碑时间段',
        dataIndex: 'planTime',
        key: 'planTime',
        render: (text, record) => {
          return (
            <span>{record.stageStart} — {record.stageEnd}</span>
          )
        }
      },
      TableColumnHelper.genPlanColumn('target', '目标'),
      TableColumnHelper.genPlanColumn('headName', '负责人'),
      TableColumnHelper.genPlanColumn('createUserName', '创建人'),
      TableColumnHelper.genPlanColumn('createTime', '创建时间'),
    ];
    return (
      <Fragment>
        <StandardTable
          rowKey={(record, index) => index}
          columns={proColumns}
          data={milePlanList}
          // loading={loadingQueryLogData}
          onChange={this.handleStandardTableChangePro}
        />
      </Fragment>
    )
  }
}

export default MilePlan