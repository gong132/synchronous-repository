import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";
import StandardTable from "@/components/StandardTable";
import { DefaultPage, TableColumnHelper } from "@/utils/helper";
import budget_xq from '@/assets/icon/modular_xq.svg'
import budget_log from '@/assets/icon/modular_czrz.svg'
import { Card, Descriptions, Spin, Form } from 'antd'
import { getParam } from '@/utils/utils'

const DescriptionItem = Descriptions.Item

@Form.create()
@connect(({ constract, loading }) => ({
  loadingQueryLogData: loading.effects['constract/fetchLogList'],
  loadingQueryInfo: loading.effects['constract/fetchContractInfo'],
  contractInfo: constract.contractInfo,
  logList: constract.logList,
}))
class Detail extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const id = getParam('id')
    this.handleQuerySectorInfo({ clusterId: id })
    this.handleQueryLogList({
      linkId: id,
      type: '3'
    })
  }

  // 查看板块详情
  handleQuerySectorInfo = (params) => {
    this.props.dispatch({
      type: 'constract/fetchContractInfo',
      payload: {
        ...params,
      }
    })
  }

  // 查日志
  handleQueryLogList = (params) => {
    this.props.dispatch({
      type: 'constract/fetchLogList',
      payload: {
        ...DefaultPage,
        ...params,
      }
    })
  }

   // 分页操作
   handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.handleQueryLogList(params)
  };

  render() {
    const { logList, loadingQueryInfo, loadingQueryLogData, contractInfo } = this.props
    const columns = [
      TableColumnHelper.genPlanColumn('operateUserName', '修改人'),
      TableColumnHelper.genPlanColumn('content', '修改内容'),
      TableColumnHelper.genPlanColumn('updateTime', '修改时间'),
    ]
    return (
      <Fragment>
        <GlobalSandBox
          img={budget_xq}
          title='合同详情'
        >
          <Descriptions column={3} bordered>
            <DescriptionItem>

            </DescriptionItem>
          </Descriptions>
        </GlobalSandBox>
        <div style={{ height: '16px' }}></div>
        <GlobalSandBox
          img={budget_log}
          title='操作日志'
        >
          <StandardTable
            rowKey={(record, index) => index}
            columns={columns}
            data={logList}
            onChange={this.handleStandardTableChange}
          />
        </GlobalSandBox>
      </Fragment>

    );
  }
}

export default Detail