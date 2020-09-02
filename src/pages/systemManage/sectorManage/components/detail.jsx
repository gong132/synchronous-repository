import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";
import StandardTable from "@/components/StandardTable";
import { DefaultPage, TableColumnHelper } from "@/utils/helper";
import budget_xq from '@/assets/icon/modular_xq.svg'
import budget_log from '@/assets/icon/modular_czrz.svg'
import { Card, Descriptions, Spin } from 'antd'
import { getParam } from '@/utils/utils'


@connect(({ sector, global, loading }) => ({
  loadingQueryLogData: loading.effects['global/fetchLogList'],
  loadingQueryInfo: loading.effects['sector/fetchSectorInfo'],
  sectorInfo: sector.sectorInfo,
  logList: sector.logList,
}))
class SectorDetail extends PureComponent {
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
      type: 'sector/fetchSectorInfo',
      payload: {
        ...params,
      }
    })
  }

  // 查日志
  handleQueryLogList = (params) => {
    console.log(params)
    console.log(this.props)
    this.props.dispatch({
      type: 'sector/fetchLogList',
      payload: {
        ...DefaultPage,
        ...params,
      }
    })
  }

  // 分页操作
  handleStandardTableChange = pagination => {
    // const formValues = form.getFieldsValue();
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      // ...formValues, // 添加已查询条件去获取分页
    };
    this.handleQueryLogList(params)
  };

  render() {
    const { sectorInfo, loadingQueryInfo, logList } = this.props
    console.log(logList)
    const { name, createUserName, createTime, updateUserName, updateTime, clusterLinkDepts } = sectorInfo
    let str = ''
    if (_.isArray(clusterLinkDepts) && !_.isEmpty(clusterLinkDepts)) {
      clusterLinkDepts.map((d, index) => {
        if (clusterLinkDepts.length > index + 1) {
          str += `${d.deptName}, `
          return
        }
        str += d.deptName
      })
    }

    const detailList = [
      { span: 1, required: true, name: '集群/板块名称', value: name, dataIndex: 'name' },
      { span: 1, required: false, name: '所属部门', value: str, dataIndex: 'deptName' },
      { span: 1, required: false, name: '创建人', value: createUserName, dataIndex: 'createUserName' },
      { span: 1, required: false, name: '创建时间', value: createTime, dataIndex: 'createTime' },
      { span: 1, required: false, name: '修改人', value: updateUserName, dataIndex: 'updateUserName' },
      { span: 1, required: false, name: '修改时间', value: updateTime, dataIndex: 'updateTime' },
    ]
    const columns = [
      TableColumnHelper.genPlanColumn('operateUserName', '修改人'),
      TableColumnHelper.genPlanColumn('content', '修改内容'),
      TableColumnHelper.genPlanColumn('updateTime', '修改时间'),
    ]
    return (
      <Fragment>
        <GlobalSandBox
          img={budget_xq}
          title='板块详情'
        >
          <Spin spinning={loadingQueryInfo}>
            <Descriptions column={3} bordered>
              {
                detailList.map((v, i) => (
                  <Descriptions.Item
                    key={i.toString()}
                    span={v.span}
                    label={<>{v.required && <span style={{ color: 'red' }}>*</span>}{v.name}</>}
                  >
                    {v.value}
                  </Descriptions.Item>
                ))
              }
            </Descriptions>
          </Spin>
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

    )
  }
}

export default SectorDetail