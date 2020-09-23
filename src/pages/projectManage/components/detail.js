import React, { PureComponent, Fragment } from 'react'
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import StandardTable from '@/components/StandardTable';
import { TableColumnHelper, DefaultPage } from '@/utils/helper';
import { getParam } from '@/utils/utils'
import flowIcon from '@/assets/icon/modular_lcjd.svg';
import budgetXqIcon from '@/assets/icon/modular_xq.svg';
import budgetLogIcon from '@/assets/icon/modular_czrz.svg';
import { Form } from 'antd'
import {connect} from 'dva'

@Form.create()
@connect(({project}) => ({
  project
}))
class Detail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  // 查日志
  handleQueryLogList = (obj = {}) => {
    const id = getParam('id');
    const params = {
      linkId: id,
      type: '6',
    };
    this.props.dispatch({
      type: 'project/fetchLogList',
      payload: {
        ...DefaultPage,
        ...params,
        ...obj,
      },
    });
  };

  // 日志分页操作
  handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.handleQueryLogList(params);
  };

  render() {
    const columns = [
      TableColumnHelper.genPlanColumn('operateUserName', '操作人', { width: '100px' }),
      TableColumnHelper.genPlanColumn('content', '操作内容'),
      TableColumnHelper.genPlanColumn('updateTime', '操作时间', { width: '100px' }),
    ];
    return (
      <Fragment>
        <GlobalSandBox title="项目进度" img={flowIcon}>
          项目进度
        </GlobalSandBox>
        <GlobalSandBox title="项目详情" img={budgetXqIcon}>
          项目详情
        </GlobalSandBox>
        <GlobalSandBox title="项目里程碑计划" img={budgetXqIcon}>
          项目里程碑计划
        </GlobalSandBox>
        <GlobalSandBox title="项目日志" img={budgetLogIcon}>
          <StandardTable
            rowKey={(record, index) => index}
            columns={columns}
            // data={logList}
            // loading={loadingQueryLogData}
            onChange={this.handleStandardTableChange}
          />
        </GlobalSandBox>
      </Fragment>
    )
  }
}
export default Detail