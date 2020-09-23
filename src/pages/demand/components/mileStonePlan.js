import React, { PureComponent, Fragment } from 'react';
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import StandardTable from '@/components/StandardTable';
import ListOptBtn from '@/components/commonUseModule/listOptBtn';
import editIconList from '@/assets/icon/cz_bj.svg';
import delIcon from '@/assets/icon/cz_del.svg';
import OptButton from '@/components/commonUseModule/optButton';
import sdIcon from '@/assets/icon/modular_xtxq.svg';
import { TableColumnHelper, DefaultPage, PagerHelper } from '@/utils/helper';
import { connect } from 'dva'
import {
  Modal,
  Form,
} from 'antd'

@Form.create()
@connect(({ demand }) => ({
  demand,
}))
class MilePlan extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visibleModal: false,
      modalTitle: '新建里程碑计划'
    }
  }

  handleQueryList = (params) => {
    this.props.dispatch({
      type: 'demand/queryMilePlan',
      payload: {
        ...DefaultPage,
        ...params
      },
    });
  }

  handleAddPlan = (params) => {
    this.props.dispatch({
      type: 'demand/addMilePlan',
      payload: {
        ...params
      },
    });
  }

  handleEditPlan = (params) => {
    this.props.dispatch({
      type: 'demand/updateMilePlan',
      payload: {
        ...params
      },
    });
  }

  handleDeletePlan = (params) => {
    this.props.dispatch({
      type: 'demand/deleteMilePlan',
      payload: {
        ...params
      },
    });
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, val) => {
      if (err) return true;

    });
  }

  handleVisibleModal = (bool, modalTitle) => {
    this.setState({
      visibleModal: bool,
      modalTitle: bool ? modalTitle : ''
    })
  }

  // 项目里程碑分页
  handleStandardTableChangePro = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.handleQueryList(params);
  };

  genModal = () => {
    const { visibleModal, modalTitle } = this.state
    return (
      <Modal
        visible={visibleModal}
        title={modalTitle}
        onCancel={() => this.handleVisibleModal(false)}
      >

      </Modal>
    )
  }

  render() {
    const {visibleModal} = this.state
    const proColumns = [
      TableColumnHelper.genPlanColumn('operateUserName', '里程碑阶段'),
      TableColumnHelper.genPlanColumn('content1', '负责人'),
      TableColumnHelper.genPlanColumn('updateTime', '计划完成日期'),
      TableColumnHelper.genPlanColumn('content2', '创建人'),
      TableColumnHelper.genPlanColumn('content3', '创建时间'),
      TableColumnHelper.genPlanColumn('content4', '修改人'),
      TableColumnHelper.genPlanColumn('content5', '修改时间'),
      {
        title: '操作',
        align: 'left',
        width: 190,
        render: () => {
          return (
            <div>
              <ListOptBtn
                title="编辑"
                style={{
                  fontSize: '20px',
                  marginRight: '16px',
                  position: 'relative',
                  top: '1px',
                }}
                // onClick={() => this.handleViewModal(true, '编辑', record)}
                icon={editIconList}
              />

              <ListOptBtn
                icon={delIcon}
                style={{
                  fontSize: '20px',
                  marginRight: '16px',
                  position: 'relative',
                  top: '1px',
                }}
                // onClick={() => this.handleViewDetail(record)}
                title="删除"
              />
            </div>
          );
        },
      },
    ];
    return (
      <Fragment>
        {visibleModal && this.genModal()}
        <GlobalSandBox
          title="项目里程碑"
          img={sdIcon}
          optNode={
            <OptButton
              onClick={() => this.handleVisibleModal(true, '新建里程碑计划')}
              style={{
                backgroundColor: 'white',
              }}
              icon="plus"
              text="新建"
            />
          }
        >
          <StandardTable
            rowKey={(record, index) => index}
            columns={proColumns}
            // data={logList}
            // loading={loadingQueryLogData}
            onChange={this.handleStandardTableChangePro}
          />
        </GlobalSandBox>
      </Fragment>
    )
  }
}

export default MilePlan